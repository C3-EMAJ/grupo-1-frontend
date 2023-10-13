import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Demandas from './pages/Demandas';
import Usuarios from './pages/Usuarios';
import Assistidos from './pages/Assistidos';
import Agendamentos from './pages/Agendamentos';
import Login from './pages/Login';

import { useSelector } from 'react-redux';

const DefaultLayout = React.lazy(() => import('./layout/Default'));

function App() {
  //const user = true; // true vai para a página inicial, false vai para o login
  const user = useSelector((state) => state.user.currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={user ? <Navigate to="/demandas" /> : <Login />} />

        <Route element={user ? <DefaultLayout /> : <Login />}>
          <Route path="/demandas" element={<Demandas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/assistidos" element={<Assistidos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;