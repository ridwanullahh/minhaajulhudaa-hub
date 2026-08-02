import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { schoolDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { DataState } from '@/components/ui/states';
import { useListData } from '@/hooks/useListData';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const ManageOrders = () => {
  const navigate = useNavigate();
  const { data: items, isLoading, error, refetch } = useListData(() => schoolDB.get('shop_orders'));

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await schoolDB.delete('shop_orders', id);
        toast.success('Record deleted successfully');
        refetch();
      } catch (error) {
        console.error('Error deleting:', error);
        toast.error('Failed to delete record');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage orders</p>
        </div>
        <Link to="/school/admin/orders/new">
          <ModernButton leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Order
          </ModernButton>
        </Link>
      </div>

      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && items.length === 0}
        onRetry={refetch}
        emptyTitle="No orders yet"
        emptyMessage="Create your first record to get started."
        emptyActionLabel="New Order"
        onEmptyAction={() => navigate('/school/admin/orders/new')}
      >
        <ModernCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.title || item.name || item.studentName || item.orderNumber || item.reference || item.id}
                  </TableCell>
                  <TableCell>{item.status || (item.publishedAt ? 'Published' : 'Draft')}</TableCell>
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ModernButton variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </ModernButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/school/admin/orders/edit/${item.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModernCard>
      </DataState>
    </div>
  );
};

export default ManageOrders;
