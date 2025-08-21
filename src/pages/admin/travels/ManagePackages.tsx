import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { travelsDB } from '@/lib/platform-db';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';

const ManagePackages = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await travelsDB.get('packages');
      setItems(data);
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await travelsDB.delete('packages', id);
        loadItems();
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Failed to delete package.");
      }
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Travel Packages</h1>
        <Link to="/travels/admin/packages/new">
          <ModernButton leftIcon={<PlusCircle className="w-4 h-4" />}>
            New Package
          </ModernButton>
        </Link>
      </div>

      <ModernCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>{item.available ? 'Available' : 'Unavailable'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ModernButton variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></ModernButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/travels/admin/packages/edit/${item.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /><span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /><span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ModernCard>
    </div>
  );
};

export default ManagePackages;
