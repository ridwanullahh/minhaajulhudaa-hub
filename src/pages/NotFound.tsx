import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ModernButton } from '@/components/ui/ModernButton';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      '404: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl sm:text-8xl font-bold text-primary mb-4">404</p>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <ModernButton onClick={() => navigate('/')}>
            <Home className="h-4 w-4" />
            Go Home
          </ModernButton>
          <ModernButton variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </ModernButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
