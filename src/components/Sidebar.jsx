import { useState } from "react";
import { NavLink, useLocation } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { useSelector } from 'react-redux';
import LogoutDialogue from './dialogues/LogoutDialogue';

export default function Sidebar() {
    // Abrir ou fechar o menu:
    const [open, setOpen] = useState(true);
    //

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
    const defaultClassName = "flex items-center h-12 px-4 py-2 mt-2 text-gray-600 rounded-lg dark:text-gray-700 hover:bg-yellow-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white"
     // Classe para deixar ativa (amarela):
    const activateClassName = "flex items-center h-12 px-4 py-2 mt-2 text-gray-600 bg-yellow-500 rounded-lg text-white"
    //

    return (
        <div className="flex">
        <div
            className={` ${
            open ? "w-72" : "w-22 "
            } bg-gray-200 h-full p-5 pt-8 relative duration-300`}
        >
            <div
                onClick={() => setOpen(!open)}  
                className={`absolute cursor-pointer -right-3 top-9 w-7  ${!open && "left-9"} ${open && "border-yellow-500 bg-yellow-500 border-2 rounded-full hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200"}`}
            >
                <span className={`${open && "hidden"} ${!open && "hover:text-yellow-500"}`}>
                    <MenuIcon/>
                </span>

                <span className={`${!open && "hidden"}`}>
                    <ArrowBackIcon style={{color:'white',}}/>
                </span>

            </div>

            <div className="flex gap-x-4 items-center">
            
            <div className={`logo-emaj ${!open && "scale-0"
                }`}>
              <div className="barra"></div>
              <div className="nome-emaj">EMAJ</div>
            </div>

            </div>
            <nav className={`flex flex-col justify-between ${!open &&  "mt-16"} ${open && "mt-10"}`}>

                <div className="flex flex-col items-center mb-10 -mx-2 h-2/6">
                    <NavLink to="/perfil"> 
                        <img className={`cursor-pointer ${!open && "object-cover w-11 h-11 mx-2 rounded-full"} ${open && "object-cover w-32 h-32 mx-2 rounded-full"}`} src={"https://i.imgur.com/oYEFKb1.png" || "https://i.imgur.com/oYEFKb1.png"} />
                    </NavLink>
                    {open &&(
                        <>
                            <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">{user.name}</h4>
                            <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{user.type}</p>
                        </>
                    )}
                </div>

                <NavLink to="/demandas">
                    <div className={actualRoute === "demandas" ? activateClassName : defaultClassName}>
                        <BusinessCenterOutlinedIcon/>
                         <span className={`${!open && "hidden"} mx-4 font-medium origin-left duration-200`}>
                            Demandas
                        </span>

                    </div>
                </NavLink>
                
                <NavLink to="/usuarios">
                    <div className={actualRoute === "usuarios" ? activateClassName : defaultClassName}>
                        <PeopleAltOutlinedIcon/>
                        <span className={`${!open && "hidden"} mx-4 font-medium origin-left duration-200`}>
                            Usuários
                        </span>
                    </div>
                </NavLink>

                <NavLink to="/assistidos">
                    <div className={actualRoute === "assistidos" ? activateClassName : defaultClassName}>
                        <SupportAgentOutlinedIcon/>
                        <span className={`${!open && "hidden"} mx-4 font-medium origin-left duration-200`}>
                            Assistidos
                        </span>
                    </div>
                </NavLink>

                <NavLink to="/agendamentos">
                    <div className={actualRoute === "agendamentos" ? activateClassName : defaultClassName}>
                        <CalendarMonthOutlinedIcon/>
                        <span className={`${!open && "hidden"} mx-4 font-medium origin-left duration-200`}>
                            Agendamentos
                        </span>
                    </div>
                </NavLink>

                <button className="flex items-center w-full h-12 px-4 py-2 mt-2 mb-8 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white">
                    <SettingsOutlinedIcon/>
                    <span className={`${!open && "hidden"} mx-4 font-medium origin-left duration-200`}>
                            Configurações
                    </span>
                </button>

                <button 
                    onClick={() => setOpenLogoutAlert(true)}
                    className="flex bottom-0 items-center w-full h-12 px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-red-800 dark:hover:bg-gray-800 dark:hover:text-blue-200 hover:text-white">
                
                    <LogoutOutlinedIcon/>
                    <span className={`${!open && "hidden"} mx-4 font-medium origin-left duration-200`}>
                        Sair
                    </span>
                </button>

                {openLogoutAlert && <LogoutDialogue setOpenLogoutAlert={setOpenLogoutAlert} />}
            </nav>
        </div>
        </div>
    );
};