
/**
 * @file CreateNozzlePage.tsx
 * @description Create nozzle page component
 * Updated layout for mobile-friendliness – 2025-07-03
 */
import { useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePump } from '@/hooks/api/usePumps';
import { useCreateNozzle } from '@/hooks/api/useNozzles';
import { useToast } from '@/hooks/use-toast';

export default function CreateNozzlePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get IDs from URL params or search params
  const stationId = searchParams.get('stationId');
  const pumpId = searchParams.get('pumpId');
  
  const [nozzleNumber, setNozzleNumber] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch pump details
  const { data: pump, isLoading: pumpLoading } = usePump(pumpId || '');
  
  // Create nozzle mutation
  const createNozzleMutation = useCreateNozzle();
  
  // Handle form submission with proper error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pumpId || !nozzleNumber || !fuelType) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createNozzleMutation.mutateAsync({
        pumpId,
        nozzleNumber: parseInt(nozzleNumber),
        fuelType: fuelType as 'petrol' | 'diesel' | 'premium',
        status: 'active'
      });
      
      toast({
        title: 'Success',
        description: 'Nozzle created successfully'
      });
      
      // Navigate back to nozzles page
      if (stationId && pumpId) {
        navigate(`/dashboard/nozzles?pumpId=${pumpId}&stationId=${stationId}`);
      } else {
        navigate('/dashboard/nozzles');
      }
    } catch (error) {
      console.error('Error creating nozzle:', error);
      toast({
        title: 'Error',
        description: 'Failed to create nozzle. Please try again.',
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  };
  
  if (pumpLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const backUrl = stationId && pumpId 
    ? `/dashboard/nozzles?pumpId=${pumpId}&stationId=${stationId}`
    : '/dashboard/nozzles';
  
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header with back button - improved mobile layout */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to={backUrl}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Add New Nozzle</h1>
          <p className="text-muted-foreground text-sm">
            {pump?.name ? `For pump: ${pump.name}` : ''}
          </p>
        </div>
      </div>
      
      {/* Create Nozzle Form */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Nozzle Details</CardTitle>
          <CardDescription className="text-sm">
            Enter the details for the new nozzle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nozzleNumber" className="text-sm font-medium">
                  Nozzle Number
                </Label>
                <Input
                  id="nozzleNumber"
                  type="number"
                  min="1"
                  placeholder="Enter nozzle number"
                  value={nozzleNumber}
                  onChange={(e) => setNozzleNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-sm font-medium">
                  Fuel Type
                </Label>
                <Select
                  value={fuelType}
                  onValueChange={setFuelType}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(backUrl)}
                className="order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !nozzleNumber || !fuelType}
                className="order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Nozzle'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
