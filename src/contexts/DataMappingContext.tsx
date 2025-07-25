

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface DataMappingContextType {
  mapApiData: <T,>(data: any, mapping?: Record<string, string>) => T;
  mapArrayData: <T,>(data: any[], mapping?: Record<string, string>) => T[];
  getStationByNozzleId: (nozzleId: string) => string;
  getNozzleNumber: (nozzleId: string) => number;
  getNozzleFuelType: (nozzleId: string) => string;
  isReady: boolean;
  isLoading: boolean;
}

const DataMappingContext = createContext<DataMappingContextType | undefined>(undefined);

interface DataMappingProviderProps {
  children: ReactNode;
}

export function DataMappingProvider({ children }: DataMappingProviderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const mapApiData = <T,>(data: any, mapping?: Record<string, string>): T => {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (!mapping) {
      return data as T;
    }

    const mappedData: any = {};
    
    // Apply field mappings
    Object.entries(mapping).forEach(([apiField, localField]) => {
      if (data[apiField] !== undefined) {
        mappedData[localField] = data[apiField];
      }
    });

    // Keep unmapped fields
    Object.entries(data).forEach(([key, value]) => {
      if (!mapping[key] && !mappedData[key]) {
        mappedData[key] = value;
      }
    });

    return mappedData as T;
  };

  const mapArrayData = <T,>(data: any[], mapping?: Record<string, string>): T[] => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => mapApiData<T>(item, mapping));
  };

  // Helpers to access cached query data
  const findNozzle = (id: string): any => {
    const direct = queryClient.getQueryData<any>(['nozzle', id]);
    if (direct) return direct;

    const nozzleQueries = queryClient
      .getQueriesData<any[]>({ predicate: q => {
        const key = q.queryKey[0];
        return key === 'nozzles' || key === 'contract-nozzles';
      } }) as [unknown, any[]][];

    for (const [, data] of nozzleQueries) {
      if (Array.isArray(data)) {
        const found = data.find(n => n.id === id);
        if (found) return found;
      }
    }

    return undefined;
  };

  const findPump = (id: string): any => {
    const direct = queryClient.getQueryData<any>(['pump', id]);
    if (direct) return direct;

    const pumpQueries = queryClient
      .getQueriesData<any[]>({ predicate: q => {
        const key = q.queryKey[0];
        return key === 'pumps' || key === 'contract-pumps';
      } }) as [unknown, any[]][];

    for (const [, data] of pumpQueries) {
      if (Array.isArray(data)) {
        const found = data.find(p => p.id === id);
        if (found) return found;
      }
    }

    return undefined;
  };

  const getStationByNozzleId = (nozzleId: string): string => {
    const nozzle = findNozzle(nozzleId);
    if (!nozzle) return '';

    const stationId = nozzle.stationId || nozzle.station_id;
    if (stationId) return stationId;

    const pumpId = nozzle.pumpId || nozzle.pump_id;
    if (pumpId) {
      const pump = findPump(pumpId);
      return pump?.stationId || pump?.station_id || '';
    }
    return '';
  };

  const getNozzleNumber = (nozzleId: string): number => {
    const nozzle = findNozzle(nozzleId);
    return (
      nozzle?.nozzleNumber ||
      nozzle?.nozzle_number ||
      0
    );
  };

  const getNozzleFuelType = (nozzleId: string): string => {
    const nozzle = findNozzle(nozzleId);
    return nozzle?.fuelType || nozzle?.fuel_type || '';
  };

  const value: DataMappingContextType = {
    mapApiData,
    mapArrayData,
    getStationByNozzleId,
    getNozzleNumber,
    getNozzleFuelType,
    isReady: isAuthenticated && !authLoading,
    isLoading: authLoading,
  };

  return (
    <DataMappingContext.Provider value={value}>
      {children}
    </DataMappingContext.Provider>
  );
}

export function useDataMapping() {
  const context = useContext(DataMappingContext);
  if (context === undefined) {
    throw new Error('useDataMapping must be used within a DataMappingProvider');
  }
  return context;
}

