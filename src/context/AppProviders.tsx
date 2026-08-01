import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LoadingProvider } from './LoadingContext';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import { AuthProvider } from '@/lib/auth';

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <AdminAuthProvider>
                        <LoadingProvider>
                            <TooltipProvider>
                                <Toaster />
                                <Sonner />
                                {children}
                            </TooltipProvider>
                        </LoadingProvider>
                    </AdminAuthProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}
