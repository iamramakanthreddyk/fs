
/**
 * Fuel Prices Service - Contract-aligned API service
 * 
 * This service follows the OpenAPI specification exactly.
 */

import { contractClient } from '../contract-client';
import type { FuelPrice, CreateFuelPriceRequest } from '../api-contract';

export const fuelPricesService = {
  /**
   * Get all fuel prices with station information
   */
  async getFuelPrices(): Promise<FuelPrice[]> {
    try {
      console.log('[FUEL-PRICES-SERVICE] Fetching fuel prices...');
      const response = await contractClient.get('/fuel-prices');
      
      // Handle different response structures from backend
      let rawPrices: any[] = [];
      
      // Type-safe response handling
      const responseData = response as any;
      
      if (responseData?.data?.prices) {
        rawPrices = responseData.data.prices;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        rawPrices = responseData.data;
      } else if (responseData?.prices) {
        rawPrices = responseData.prices;
      } else if (Array.isArray(responseData)) {
        rawPrices = responseData;
      }
      
      console.log('[FUEL-PRICES-SERVICE] Raw prices:', rawPrices);
      
      // Transform to contract format
      const fuelPrices = rawPrices.map((price: any) => ({
        id: price.id,
        stationId: price.station_id || price.stationId,
        fuelType: price.fuel_type || price.fuelType,
        price: parseFloat(price.price) || 0,
        validFrom: price.valid_from || price.validFrom,
        createdAt: price.created_at || price.createdAt,
        isActive: price.is_active !== false, // Default to true if not specified
        // Handle station name - get from relationship or fetch separately
        stationName: price.station?.name || undefined
      }));
      
      console.log('[FUEL-PRICES-SERVICE] Transformed prices:', fuelPrices);
      return fuelPrices;
    } catch (error) {
      console.error('[FUEL-PRICES-SERVICE] Error fetching fuel prices:', error);
      return [];
    }
  },

  /**
   * Create new fuel price
   */
  async createFuelPrice(data: CreateFuelPriceRequest): Promise<FuelPrice> {
    console.log('[FUEL-PRICES-SERVICE] Creating fuel price:', data);
    const response = await contractClient.post<FuelPrice>('/fuel-prices', data);
    console.log('[FUEL-PRICES-SERVICE] Created:', response);
    return response;
  },

  /**
   * Update fuel price
   */
  async updateFuelPrice(priceId: string, data: Partial<CreateFuelPriceRequest>): Promise<FuelPrice> {
    console.log('[FUEL-PRICES-SERVICE] Updating fuel price:', priceId, data);
    const response = await contractClient.put<FuelPrice>(`/fuel-prices/${priceId}`, data);
    console.log('[FUEL-PRICES-SERVICE] Updated:', response);
    return response;
  },

  /**
   * Delete fuel price
   */
  async deleteFuelPrice(priceId: string): Promise<void> {
    console.log('[FUEL-PRICES-SERVICE] Deleting fuel price:', priceId);
    await contractClient.delete(`/fuel-prices/${priceId}`);
  },

  /**
   * Validate fuel prices for a station
   */
  async validateStationPrices(stationId: string): Promise<{
    hasActivePrices: boolean;
    missingFuelTypes?: string[];
  }> {
    return contractClient.get<{
      hasActivePrices: boolean;
      missingFuelTypes?: string[];
    }>(`/fuel-prices/validate/${stationId}`);
  },

  /**
   * Get stations missing active prices
   */
  async getStationsMissingPrices(): Promise<any[]> {
    const response = await contractClient.get('/fuel-prices/missing');
    const responseData = response as any;
    return responseData?.stations || responseData?.data?.stations || [];
  }
};
