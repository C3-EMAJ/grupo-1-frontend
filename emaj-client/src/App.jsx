import { useState } from 'react'

import Processos from "./pages/Processos";
import Login from "./pages/Login";

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";


function App() {
  const user = true; // true vai pra página inicial, false vai para o login

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={user ? <Processos/> : <Login />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
