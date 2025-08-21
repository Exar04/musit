import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext.js';

import './index.css'
import App from './App.tsx'
import { Login } from './pages/login.tsx';
import { Signup } from './pages/siginup.tsx';
import { NoPage } from './pages/noPage.tsx';

function PrivateRoute() {
  const { token } = useAuth();
  console.log('PrivateRoute token:', token);
  return token ? <App /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      // { path: "/", element: <App /> },
      // { path: "/", element: <ProductList /> },
      // { path: "/product/:id", element: <ProductDetail /> },
      // { path: "/uploadproduct", element: <UploadProduct /> },
    ],
  },
  { path: '*', element: <NoPage /> }, // ⬅️ catch-all route
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)