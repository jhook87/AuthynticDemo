import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface RouterContextValue {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

interface RouterProps {
  children: ReactNode;
  initialPath?: string;
}

export const Router = ({ children, initialPath = '/' }: RouterProps) => {
  const [path, setPath] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : initialPath));

  useEffect(() => {
    if (typeof window === 'undefined') return () => undefined;
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = useCallback((next: string) => {
    if (typeof window !== 'undefined' && next !== path) {
      window.history.pushState({}, '', next);
      setPath(next);
    }
  }, [path]);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

interface RouteProps {
  path: string;
  element: ReactNode;
}

export const Route = ({ path, element }: RouteProps) => {
  const router = useContext(RouterContext);
  if (!router) throw new Error('Route must be used within Router');
  if (router.path !== path) return null;
  return <>{element}</>;
};

export const useNavigate = () => {
  const router = useContext(RouterContext);
  if (!router) throw new Error('useNavigate must be used within Router');
  return router.navigate;
};

export const useRoute = () => {
  const router = useContext(RouterContext);
  if (!router) throw new Error('useRoute must be used within Router');
  return router.path;
};

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export const NavLink = ({ to, children, className }: NavLinkProps) => {
  const navigate = useNavigate();
  const current = useRoute();
  const active = current === to;
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className={`${className ?? ''} ${active ? 'nav-active' : ''}`.trim()}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </button>
  );
};
