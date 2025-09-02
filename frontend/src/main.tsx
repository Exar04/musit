import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext.js';

import './index.css'
// import App from './App.tsx'
import { Login } from './pages/login.tsx';
import { Signup } from './pages/siginup.tsx';
import { NoPage } from './pages/noPage.tsx';
import { HomePage } from './pages/homePage.tsx';
import { ChatPage } from './pages/chatPage.tsx';
import MainLayout from './layout/mainLayout.tsx';
import { AlbumPage } from './pages/albumPage.tsx';
import { AdminPage } from './pages/admin/adminPage.tsx';

function PrivateRoute() {
  const { token } = useAuth();
  console.log('PrivateRoute token:', token);
  return token ? <MainLayout /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path:"/admin", element: <AdminPage />},
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/album/:albumId", element: <AlbumPage /> },
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