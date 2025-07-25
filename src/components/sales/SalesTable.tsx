
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EnhancedSale } from '@/hooks/useEnhancedSales';
import { formatSafeDate, formatVolume, formatPrice, formatCurrency, formatSafeNumber } from '@/utils/formatters';

interface SalesTableProps {
  sales: EnhancedSale[];
  isLoading?: boolean;
  error?: Error | null;
}

export function SalesTable({ sales, isLoading, error }: SalesTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading sales: {error.message}
      </div>
    );
  }

  if (!sales.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No sales found for the selected filters.
      </div>
    );
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'upi': return 'bg-purple-100 text-purple-800';
      case 'credit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'petrol': return 'bg-green-100 text-green-800';
      case 'diesel': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date/Time</TableHead>
          <TableHead>Station</TableHead>
          <TableHead>Nozzle</TableHead>
          <TableHead>Volume (L)</TableHead>
          <TableHead>Fuel Type</TableHead>
          <TableHead>Price/L</TableHead>
          <TableHead>Amount (₹)</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-mono text-sm">
              {formatSafeDate(sale.recordedAt, 'dd/MM/yy HH:mm')}
            </TableCell>
            <TableCell className="font-medium">
              {sale.station?.name || 'Unknown Station'}
            </TableCell>
            <TableCell>
              Nozzle {formatSafeNumber(sale.nozzle?.nozzleNumber, 0) || 'N/A'}
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatVolume(sale.volume, 'L')}
            </TableCell>
            <TableCell>
              <Badge className={getFuelTypeColor(sale.fuelType)}>
                {sale.fuelType}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatPrice(sale.fuelPrice)}
            </TableCell>
            <TableCell className="text-right font-mono font-medium">
              {formatCurrency(sale.amount)}
            </TableCell>
            <TableCell>
              <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                {sale.paymentMethod}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={sale.status === 'posted' ? 'default' : 'secondary'}>
                {sale.status === 'posted' ? '✅ Posted' : '🕒 Draft'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
