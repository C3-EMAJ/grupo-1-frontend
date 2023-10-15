import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Demandas from './pages/Demandas';
import Usuarios from './pages/Usuarios';
import Assistidos from './pages/Assistidos';
import Agendamentos from './pages/Agendamentos';
import Login from './pages/Login';

import ErrorBoundary from './ErrorBoundary';

import { useSelector } from 'react-redux';

const DefaultLayout = React.lazy(() => import('./layout/Default'));

function App() {
  //const user = true; // true vai para a página inicial, false vai para o login
  const user = useSelector((state) => state.user.currentUser);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/demandas" /> : <Login/> }/>
          
          <Route element={user ? <DefaultLayout /> : <Navigate to="/login" />}>
            <Route path="/demandas" element={<Demandas />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/assistidos" element={<Assistidos />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;