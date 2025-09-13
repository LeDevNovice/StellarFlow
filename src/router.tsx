import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';

import { HomePage } from './pages/HomePage';

const rootRoute = createRootRoute({
  component: () => (
    <div>
        <Outlet />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
]);

export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}