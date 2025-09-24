import { Outlet } from '@tanstack/react-router';
import React from 'react';

export const App: React.FC = () => {
  return (
      <div>
        <Outlet />
      </div>
  );
};