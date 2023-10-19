
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { useSelector } from 'react-redux';

import LogoutDialogue from './dialogues/LogoutDialogue';
import NewDialogue from './dialogues/NewDialogue';

import { NavLink, useLocation } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';

export default function SideBar() {
  // Pegando o usuário logado, para pegar as informações:
  const user = useSelector((state) => state.user.currentUser);
  //

  // Abrir modal de mensagem para deslogar:
  const [openLogoutAlert, setOpenLogoutAlert] = useState(false);
  //

  // Verificando qual a rota, para deixar o item da sidebar ativo ou não:
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split('/');
  const actualRoute = segments[1]; 
    // Classe para deixar normal:
  const defaultClassName = "flex items-center h-12 px-4 py-2 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-700 hover:bg-yellow-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white"
    // Classe para deixar ativa (amarela):
  const activateClassName = "flex items-center h-12 px-4 py-2 mt-2 text-gray-600 bg-yellow-500 transition-colors duration-300 transform rounded-lg text-white"
  //

  return(
    <div className="scroll-sidebar left-0 top-0 z-9999 flex h-screen w-3/12 max-w-sm flex-col overflow-y-hidden bg-gray-300 p-4 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0">
          <div className="logo-emaj">
              <div className="barra"></div>
              <div className="nome-emaj">EMAJ</div>
          </div>
    
          <div className="flex flex-col items-center mt-10 mb-5 -mx-2 h-2/6">
            <img className="object-cover w-40 h-40 mx-2 rounded-full" src={user.img || "https://i.imgur.com/oYEFKb1.png"} />
            <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">{user.name}</h4>
            <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{user.type}</p>
          </div>
    
          <div className="flex flex-col justify-between mt-10">
            <nav>
              <NavLink to="/demandas">
                <div className={actualRoute === "demandas" ? activateClassName : defaultClassName}>
                  <BusinessCenterOutlinedIcon/>
                  <span className="mx-4 font-medium">Demandas</span>
                </div>
              </NavLink>
              
              <NavLink to="/usuarios">
                <div className={actualRoute === "usuarios" ? activateClassName : defaultClassName}>
                  <PeopleAltOutlinedIcon/>
                  <span className="mx-4 font-medium">Usuários</span>
                </div>
              </NavLink>

              <NavLink to="/assistidos">
                <div className={actualRoute === "assistidos" ? activateClassName : defaultClassName}>
                  <SupportAgentOutlinedIcon/>
                  <span className="mx-4 font-medium">Assistidos</span>
                </div>
              </NavLink>

              <NavLink to="/agendamentos">
                <div className={actualRoute === "agendamentos" ? activateClassName : defaultClassName}>
                  <CalendarMonthOutlinedIcon/>
                  <span className="mx-4 font-medium">Agendamentos</span>
                </div>
              </NavLink>

              <button className="flex items-center w-full h-12 px-4 py-2 mt-2 mb-8 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white">
                <SettingsOutlinedIcon/>
                <span className="mx-4 font-medium">Configurações</span>
              </button>

              <button 
              onClick={() => setOpenLogoutAlert(true)}
              className="flex bottom-0 items-center w-full h-12 px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-red-800 dark:hover:bg-gray-800 dark:hover:text-blue-200 hover:text-white">
                
                <LogoutOutlinedIcon/>
                <span className="mx-4 font-medium">Sair</span>
              </button>

              {openLogoutAlert && <LogoutDialogue setOpenLogoutAlert={setOpenLogoutAlert} />}
            </nav>
          </div>

    
    
    </div>
  )
}