import React, { useEffect, useState } from "react";

import AddUser from "../components/modals/AddUser";
import LoaderTables from "../components/LoaderTables";
import UsersTable from "../components/datatables/UsersTable";
import DisabledUsersTable from "../components/datatables/DisabledUsers";

import { getAllUsers } from "../data/axios/apiCalls";

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import BedtimeOffOutlinedIcon from '@mui/icons-material/BedtimeOffOutlined';

import { useSelector } from 'react-redux';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

export default function Usuarios() {
  const [isLoading, setIsLoading] = useState(true);

  // Mensagens de alerta que são mostradas na parte superior:
  const [alertMessage, setAlertMessage] = useState(""); // Mensagem;
  const [showAlertMessage, setShowAlertMessage] = useState(false); // Exibir ou não;
  const [typeAlertMessage, setTypeAlertMessage] = useState(''); // Tipo da mensagem: success, error, warning ou info;

  const handleAlertMessage = (type, message) => {
    setShowAlertMessage(true);
    setAlertMessage(message);
    setTypeAlertMessage(type);

    setTimeout(() => { setShowAlertMessage(false) }, 7000); // Fechar a mensagem;
  };
  //
  
  // Pegando o usuário logado, para pegar as informações:
  const user = useSelector((state) => state.user.currentUser);
  //

  // Abrir o modal para adicionar um novo usuário:
  const [openAddModal, setOpenAddModal] = useState(false);
  //

  // Usuários que são pegos do DB:
  const [users, setUsers] = useState([]);
  const [disabledUsers, setDisabledUsers] = useState([]);
  const [seeDisabledUsers, setSeeDisabledUsers] = useState(false);
  //

  // Se ocorrer um erro ao fazer o "fetch" dos usuários:
  const [errorGettingTheUsersTable, setErrorGettingTheUsersTable] = useState(false);
  //

  // Verificando se "users" está vazio:
  useEffect(() => {
    if (users.length === 0){ 
      fetchUsers();
    }

  }, []);
  //

  // Requisição para a API:
  const fetchUsers = async () => {
    try {
      if (isLoading === false) {
        setIsLoading(true)
      }

      const req = getAllUsers();
      req.then(response => {
        if (response.status === 200) {
          const usersData = response.data;
          organizeUsers(usersData);
        }

        else {
          setIsLoading(false);
          setErrorGettingTheUsersTable(true);
        }

        }).catch(error => {
          console.log(error)
          setIsLoading(false);
          setErrorGettingTheUsersTable(true);
        });
    } catch (error) {
      setIsLoading(false);
      setErrorGettingTheUsersTable(true);
    }
  };

  function organizeUsers(usersData) {
    var activeUsersOnFetch = [];
    var disabledUsersOnFetch = [];

    // Separando os usuários ativos dos usuários desativados:
    usersData.map((item, index) => {
      if (item.isActive == true) {
        activeUsersOnFetch.push(item);
      } else {
        disabledUsersOnFetch.push(item);
      }
    });
    //

    setUsers(activeUsersOnFetch);
    setDisabledUsers(disabledUsersOnFetch);

    setIsLoading(false);
    setErrorGettingTheUsersTable(false)
  }
  //

  // Ver ou não usuários desativados (somente admins):
  const handleDisabledUsers =  () => {
    if (seeDisabledUsers == false) {
      setSeeDisabledUsers(true)
    } else {
      setSeeDisabledUsers(false)
    }
  }
  //

  return (
    <div className="flex flex-col min-h-screen rounded-md border screen rounded-lg bg-white px-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 rounded-t border-b">
        <div className="w-full md:w-1/2">
          
          {seeDisabledUsers ? 
          (
            <h4 className="text-xl font-semibold text-black dark:text-white">
                Usuários Desativados
            </h4>
          ) : (
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Lista de Usuários
            </h4>
            )
          }
          
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          
          {user.isAdmin && (
              <button
                onClick={() => handleDisabledUsers()}
                className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
              > 
              {seeDisabledUsers == false ? (
                <>
                  <BedtimeOutlinedIcon style={{ marginRight: '4px' }} />
                  Ver Inativos
                </>
              ):(
                <>
                  <BedtimeOffOutlinedIcon style={{ marginRight: '4px' }} />
                  Ver Ativos
                </>
              )}
                
              </button>
          )}
          
          <button
            onClick={() => fetchUsers()}
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <RefreshIcon style={{ marginRight: '4px' }}/>
            Recarregar Tabela
          </button>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <AddIcon style={{ marginRight: '4px' }}/>
            Adicionar Usuário
          </button>
          
        </div>
        
      </div>

      <div className="flex flex-colum w-full h-full">
        
        <React.Fragment>
          {isLoading ? (

            <LoaderTables />

          ) : errorGettingTheUsersTable ? (

            <div className="w-full">
              <div className="bg-red-500 mt-5 text-white font-bold rounded-t px-4 py-2">
                Ocorreu um Erro
              </div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <p>Se o erro persistir contate os administradores do sistema.</p>
              </div>
            </div>

          ) : (
            <div className="mt-4 mb-4 w-full">
              {seeDisabledUsers == false ? (
                <UsersTable users={users} />
              ) : (
                <DisabledUsersTable disabledUsers={disabledUsers} />
              )}
            </div>

          )}
        </React.Fragment>

      {openAddModal && <AddUser setOpenAddModal={setOpenAddModal}/>}
      
      <Snackbar
        open={showAlertMessage}
        severity="success"
        TransitionComponent={SlideTransition}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}>
          <Alert  severity={typeAlertMessage} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      </div>
    </div>

  );
};