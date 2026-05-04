import { Facebook, Instagram } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <button
              type="button"
              className="touch-manipulation"
              data-admin-touch-trigger
              aria-label="ZB Propiedades"
            >
              <Logo className="h-10 w-10 text-primary" />
            </button>
            <div className='flex flex-col'>
                <p className="text-xl font-bold text-primary">ZB Propiedades</p>
                <p className="text-sm text-muted-foreground">&copy; 2026. Todos los derechos reservados. SKR Software</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://www.facebook.com/share/18icCQG8gX/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a 
              href="https://www.instagram.com/marketingzb?igsh=bWV1ODE2YXV0Z3Zi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
