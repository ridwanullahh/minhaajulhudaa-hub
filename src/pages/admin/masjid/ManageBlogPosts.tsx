import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { masjidDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { DataState } from '@/components/ui/states';
import { useListData } from '@/hooks/useListData';
import { toast } from 'sonner';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const ManageBlogPosts = () => {
  const navigate = useNavigate();
  const { data: items, isLoading, error, refetch } = useListData(() => masjidDB.get('blog_posts'));

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await masjidDB.delete('blog_posts', id);
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
          <h1 className="text-2xl font-bold text-foreground">Manage Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage blog posts</p>
        </div>
        <Link to="/masjid/admin/blog/new">
          <ModernButton leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Post
          </ModernButton>
        </Link>
      </div>

      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && items.length === 0}
        onRetry={refetch}
        emptyTitle="No blog posts yet"
        emptyMessage="Create your first record to get started."
        emptyActionLabel="New Post"
        onEmptyAction={() => navigate('/masjid/admin/blog/new')}
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
                    {item.title || item.name || item.speaker || item.donor || item.customerName || item.organizer || item.id}
                  </TableCell>
                  <TableCell>{item.status || (item.publishedAt ? 'Published' : item.approved ? 'Approved' : 'Pending')}</TableCell>
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date ? new Date(item.date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ModernButton variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </ModernButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/masjid/admin/blog/edit/${item.id}`)}>
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

export default ManageBlogPosts;
