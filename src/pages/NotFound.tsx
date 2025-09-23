import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">404</h1>
        <p className="mb-6 text-base sm:text-lg lg:text-xl text-muted-foreground">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-primary underline hover:text-primary/80 transition-colors text-sm sm:text-base"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
