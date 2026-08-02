import React from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { AlertCircle, RefreshCw, Inbox } from 'lucide-react';

/**
 * Loading, Error, and Empty state components
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Standardized state components for consistent UX across all admin
 * pages and public pages. Addresses PRODUCTION_GAPS.md items 3.1, 3.2,
 * and 3.3 (inconsistent loading, no error states, no empty states).
 */

// ---------------------------------------------------------------------------
// LoadingState
// ---------------------------------------------------------------------------

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...', rows = 3 }) => {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <p className="text-sm text-muted-foreground sr-only">{message}</p>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-12 rounded-md bg-secondary animate-pulse" />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ErrorState
// ---------------------------------------------------------------------------

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  onRetry,
}) => {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto mb-3">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <ModernButton size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </ModernButton>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  message = 'There are no items to display.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mx-auto mb-3">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">{message}</p>
      {actionLabel && onAction && (
        <ModernButton size="sm" onClick={onAction}>
          {actionLabel}
        </ModernButton>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// DataState (combines all three for convenience)
// ---------------------------------------------------------------------------

interface DataStateProps {
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const DataState: React.FC<DataStateProps> = ({
  isLoading,
  error,
  isEmpty,
  loadingMessage,
  errorMessage,
  emptyTitle,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  children,
}) => {
  if (isLoading) return <LoadingState message={loadingMessage} />;
  if (error) return <ErrorState message={errorMessage || error.message} onRetry={onRetry} />;
  if (isEmpty)
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  return <>{children}</>;
};

export default { LoadingState, ErrorState, EmptyState, DataState };
