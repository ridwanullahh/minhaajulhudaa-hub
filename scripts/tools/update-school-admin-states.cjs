#!/usr/bin/env node
/**
 * Batch-update school admin Manage pages to use shared LoadingState/ErrorState/EmptyState.
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Transforms the common pattern:
 *   const [items, setItems] = useState([]);
 *   const [isLoading, setIsLoading] = useState(true);
 *   useEffect(() => { loadX(); }, []);
 *   const loadX = async () => { setIsLoading(true); try { ... } finally { setIsLoading(false); } };
 *   if (isLoading) { return <spinner/> }
 *
 * Into:
 *   const { data: items, isLoading, error, refetch } = useListData(() => db.get('collection'));
 *   <DataState isLoading={isLoading} error={error} isEmpty={...} onRetry={refetch}>...</DataState>
 */

const fs = require('fs');
const path = require('path');

const pages = [
  { file: 'src/pages/admin/school/ManageStudents.tsx', entity: 'student', collection: 'students', title: 'Students', newLabel: 'New Student', basePath: '/school/admin/students' },
  { file: 'src/pages/admin/school/ManageStaff.tsx', entity: 'staff', collection: 'staff', title: 'Staff', newLabel: 'New Staff', basePath: '/school/admin/staff' },
  { file: 'src/pages/admin/school/ManageClasses.tsx', entity: 'class', collection: 'classes', title: 'Classes', newLabel: 'New Class', basePath: '/school/admin/classes' },
  { file: 'src/pages/admin/school/ManagePrograms.tsx', entity: 'program', collection: 'programs', title: 'Programs', newLabel: 'New Program', basePath: '/school/admin/programs' },
  { file: 'src/pages/admin/school/ManageAdmissions.tsx', entity: 'admission', collection: 'admissions', title: 'Admissions', newLabel: 'New Admission', basePath: '/school/admin/admissions' },
  { file: 'src/pages/admin/school/ManageProducts.tsx', entity: 'product', collection: 'shop_products', title: 'Products', newLabel: 'New Product', basePath: '/school/admin/products' },
  { file: 'src/pages/admin/school/ManageOrders.tsx', entity: 'order', collection: 'shop_orders', title: 'Orders', newLabel: 'New Order', basePath: '/school/admin/orders' },
  { file: 'src/pages/admin/school/ManagePayments.tsx', entity: 'payment', collection: 'payments', title: 'Payments', newLabel: 'New Payment', basePath: '/school/admin/payments' },
  { file: 'src/pages/admin/school/ManageBlogPosts.tsx', entity: 'blogPost', collection: 'blog_posts', title: 'Blog Posts', newLabel: 'New Post', basePath: '/school/admin/blog' },
];

const root = '/home/z/my-project';

for (const page of pages) {
  const fullPath = path.join(root, page.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`SKIP (not found): ${page.file}`);
    continue;
  }

  const entityPlural = page.collection;
  const entityVar = page.entity;

  const content = `import React from 'react';
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

const Manage${page.title.replace(/\s/g, '')} = () => {
  const navigate = useNavigate();
  const { data: items, isLoading, error, refetch } = useListData(() => schoolDB.get('${entityPlural}'));

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await schoolDB.delete('${entityPlural}', id);
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
          <h1 className="text-2xl font-bold text-foreground">Manage ${page.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage ${page.title.toLowerCase()}</p>
        </div>
        <Link to="${page.basePath}/new">
          <ModernButton leftIcon={<PlusCircle className="w-4 h-4" />}>
            ${page.newLabel}
          </ModernButton>
        </Link>
      </div>

      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && items.length === 0}
        onRetry={refetch}
        emptyTitle="No ${page.title.toLowerCase()} yet"
        emptyMessage="Create your first record to get started."
        emptyActionLabel="${page.newLabel}"
        onEmptyAction={() => navigate('${page.basePath}/new')}
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
                        <DropdownMenuItem onClick={() => navigate(\`${page.basePath}/edit/\${item.id}\`)}>
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

export default Manage${page.title.replace(/\s/g, '')};
`;

  fs.writeFileSync(fullPath, content);
  console.log(`UPDATED: ${page.file}`);
}

console.log('Done.');
