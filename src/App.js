import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { PrimeReactProvider } from 'primereact/api';


import 'primereact/resources/themes/saga-blue/theme.css';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { privateRoutes, publicRoutes } from './pages/routes';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Loading from './components/Loading';

function App({ Component, pageProps }) {
  return (
    <PrimeReactProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            {publicRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element}>
                {route.children?.map((child, j) => (
                  <Route key={j} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
          </Route>

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            {privateRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element}>
                {route.children?.map((child, j) => (
                  <Route key={j} path={child.path} element={child.element} />
                ))}
              </Route>
            ))}
          </Route>
        </Routes>
      </Suspense>
    </PrimeReactProvider>
  );
}

export default App;
