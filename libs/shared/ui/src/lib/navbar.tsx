import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@react-monorepo/shared-auth';
import { Button } from './button';
import { cn } from './utils';
import { ShoppingBag, User } from 'lucide-react';

interface NavbarProps {
  cartSlot?: ReactNode;
  wishlistSlot?: ReactNode;
}

export function Navbar({ cartSlot, wishlistSlot }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <nav className="w-full max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          <ShoppingBag className="h-5 w-5 text-primary" />
          <span>Store</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn(
                'text-sm px-3 py-2 rounded-md transition-colors',
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )
            }
          >
            Products
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  cn(
                    'text-sm px-3 py-2 rounded-md transition-colors',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                My Orders
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    'text-sm px-3 py-2 rounded-md transition-colors',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                Profile
              </NavLink>
            </>
          )}
          {wishlistSlot}
          {cartSlot}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                {user?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login" className="ml-1">
              <Button size="sm">
                <User className="h-4 w-4 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
