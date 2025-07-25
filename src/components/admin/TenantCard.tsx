
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDate } from '@/utils/formatters';
import { Tenant } from '@/api/api-contract';
import { TenantActions } from './TenantActions';
import { TenantStats } from './TenantStats';

interface TenantCardProps {
  tenant: Tenant;
  onUpdateStatus: (id: string, status: 'active' | 'suspended' | 'cancelled') => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function TenantCard({ tenant, onUpdateStatus, onDelete, onView }: TenantCardProps) {
  const getPlanColor = (planName: string) => {
    if (planName.toLowerCase().includes('basic')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (planName.toLowerCase().includes('premium')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (planName.toLowerCase().includes('enterprise')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg min-w-0 flex-1">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex-shrink-0">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="truncate text-sm sm:text-lg">{tenant.name}</span>
          </CardTitle>
          <Badge className={`${getPlanColor(tenant.planName)} border font-medium text-xs px-2 py-1 flex-shrink-0`}>
            <span className="hidden sm:inline">{tenant.planName}</span>
            <span className="sm:hidden">{tenant.planName.slice(0, 3)}</span>
          </Badge>
        </div>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          <span className="hidden sm:inline">Organization: </span>
          <span className="font-medium">{tenant.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <TenantStats 
          stationCount={tenant.stationCount || 0}
          userCount={tenant.userCount || 0}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
            <StatusBadge status={tenant.status} />
          </div>
          <TenantActions
            tenant={tenant}
            onStatusChange={onUpdateStatus}
            onDelete={onDelete}
          />
        </div>
        <div className="text-xs text-muted-foreground text-center">
          <span className="hidden sm:inline">Created: </span>
          {formatDate(tenant.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}
