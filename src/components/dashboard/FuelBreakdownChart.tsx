
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useFuelTypeBreakdown } from '@/hooks/useDashboard';

export function FuelBreakdownChart() {
  const { data: breakdown = [], isLoading } = useFuelTypeBreakdown();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fuel Sales Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = breakdown.map(item => ({
    fuelType: item.fuelType,
    volume: item.volume,
    amount: item.amount,
  }));

  const chartConfig = {
    volume: { label: 'Volume (L)', color: '#3b82f6' },
    amount: { label: 'Amount (₹)', color: '#22c55e' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Sales by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="fuelType" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="volume" fill={chartConfig.volume.color} name="Volume (L)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
