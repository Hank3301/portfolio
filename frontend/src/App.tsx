import {useEffect, Suspense} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import {Footer, Header} from './components/Chrome';
import {Contact} from './components/Contact';
import {Expertise} from './components/Expertise';
import {Hero} from './components/Hero';
import {Projects} from './components/Projects';
import {useReducedMotion} from './hooks/useReducedMotion';
import {startScroll} from './lib/scroll';
import {queryClient} from './services/queryClient';
import {AdminLayout} from './pages/admin/AdminLayout';
import {AdminLogin} from './pages/admin/AdminLogin';
import {AdminDashboard} from './pages/admin/AdminDashboard';

const AdminLoader = () => (
  <div className="min-h-screen bg-void flex items-center justify-center">
    <div className="animate-pulse text-terminal">Carregando admin...</div>
  </div>
);

export default function App() {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<AdminLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="admin/login" element={<AdminLogin />} />
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Expertise />
      <Contact />
    </>
  );
}