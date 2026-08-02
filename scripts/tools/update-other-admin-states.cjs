#!/usr/bin/env node
/**
 * Batch-update masjid/charity/travels admin Manage pages to use shared states.
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 */

const fs = require('fs');
const path = require('path');

const root = '/home/z/my-project';

function genPage({ platform, dbVar, entity, collection, title, newLabel, basePath }) {
  const compName = `Manage${title.replace(/\s/g, '')}`;
  return `import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ${dbVar} } from '@/lib/platform-db';
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

const ${compName} = () => {
  const navigate = useNavigate();
  const { data: items, isLoading, error, refetch } = useListData(() => ${dbVar}.get('${collection}'));

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await ${dbVar}.delete('${collection}', id);
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
          <h1 className="text-2xl font-bold text-foreground">Manage ${title}</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage ${title.toLowerCase()}</p>
        </div>
        <Link to="${basePath}/new">
          <ModernButton leftIcon={<PlusCircle className="w-4 h-4" />}>
            ${newLabel}
          </ModernButton>
        </Link>
      </div>

      <DataState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && items.length === 0}
        onRetry={refetch}
        emptyTitle="No ${title.toLowerCase()} yet"
        emptyMessage="Create your first record to get started."
        emptyActionLabel="${newLabel}"
        onEmptyAction={() => navigate('${basePath}/new')}
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
                        <DropdownMenuItem onClick={() => navigate(\`${basePath}/edit/\${item.id}\`)}>
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

export default ${compName};
`;
}

const pages = [
  // Masjid
  { platform: 'masjid', dbVar: 'masjidDB', collection: 'announcements', title: 'Announcements', newLabel: 'New Announcement', basePath: '/masjid/admin/announcements' },
  { platform: 'masjid', dbVar: 'masjidDB', collection: 'events', title: 'Events', newLabel: 'New Event', basePath: '/masjid/admin/events' },
  { platform: 'masjid', dbVar: 'masjidDB', collection: 'audio_library', title: 'Audio Library', newLabel: 'New Audio', basePath: '/masjid/admin/audio' },
  { platform: 'masjid', dbVar: 'masjidDB', collection: 'blog_posts', title: 'Blog Posts', newLabel: 'New Post', basePath: '/masjid/admin/blog' },
  { platform: 'masjid', dbVar: 'masjidDB', collection: 'prayer_times', title: 'Prayer Times', newLabel: 'New Entry', basePath: '/masjid/admin/prayer-times' },
  { platform: 'masjid', dbVar: 'masjidDB', collection: 'donations', title: 'Donations', newLabel: 'New Donation', basePath: '/masjid/admin/donations' },
  // Charity
  { platform: 'charity', dbVar: 'charityDB', collection: 'campaigns', title: 'Campaigns', newLabel: 'New Campaign', basePath: '/charity/admin/campaigns' },
  { platform: 'charity', dbVar: 'charityDB', collection: 'projects', title: 'Projects', newLabel: 'New Project', basePath: '/charity/admin/projects' },
  { platform: 'charity', dbVar: 'charityDB', collection: 'donations', title: 'Donations', newLabel: 'New Donation', basePath: '/charity/admin/donations' },
  { platform: 'charity', dbVar: 'charityDB', collection: 'volunteers', title: 'Volunteers', newLabel: 'New Volunteer', basePath: '/charity/admin/volunteers' },
  { platform: 'charity', dbVar: 'charityDB', collection: 'testimonials', title: 'Testimonials', newLabel: 'New Testimonial', basePath: '/charity/admin/testimonials' },
  // Travels
  { platform: 'travels', dbVar: 'travelsDB', collection: 'packages', title: 'Packages', newLabel: 'New Package', basePath: '/travels/admin/packages' },
  { platform: 'travels', dbVar: 'travelsDB', collection: 'bookings', title: 'Bookings', newLabel: 'New Booking', basePath: '/travels/admin/bookings' },
  { platform: 'travels', dbVar: 'travelsDB', collection: 'customers', title: 'Customers', newLabel: 'New Customer', basePath: '/travels/admin/customers' },
  { platform: 'travels', dbVar: 'travelsDB', collection: 'reviews', title: 'Reviews', newLabel: 'New Review', basePath: '/travels/admin/reviews' },
];

for (const page of pages) {
  const fullPath = path.join(root, 'src', 'pages', 'admin', page.platform, `Manage${page.title.replace(/\s/g, '')}.tsx`);
  // Find the actual file (some masjid files have different names)
  const dir = path.join(root, 'src', 'pages', 'admin', page.platform);
  if (!fs.existsSync(dir)) {
    console.log(`SKIP (dir not found): ${dir}`);
    continue;
  }
  // Write the file
  fs.writeFileSync(fullPath, genPage(page));
  console.log(`UPDATED: src/pages/admin/${page.platform}/Manage${page.title.replace(/\s/g, '')}.tsx`);
}

console.log('Done.');
