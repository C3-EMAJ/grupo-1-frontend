import React, { useEffect, useState } from "react";

import AddUser from "../components/modals/AddUser";
import LoaderTables from "../components/LoaderTables";
import UsersTable from "../components/datatables/UsersTable";

import { getAllUsers } from "../data/axios/apiCalls";

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Usuarios() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Abrir o modal para adicionar um novo usuário:
  const [openAddModal, setOpenAddModal] = useState(false);
  //

  // Usuários que são pegos do DB:
  const [users, setUsers] = useState([]);
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

        console.log(response)

        if (response.status === 200) {
          const usersData = response.data;
          setUsers(usersData);
          setIsLoading(false);
          setErrorGettingTheUsersTable(false)
        }

        else {
          setIsLoading(false);
          setErrorGettingTheUsersTable(true);
        }

        }).catch(error => {
          setIsLoading(false);
          setErrorGettingTheUsersTable(true);
        });
    } catch (error) {
      setIsLoading(false);
      setErrorGettingTheUsersTable(true);
    }
  };
  //

  return (
    <div className="flex flex-col min-h-screen rounded-md border screen rounded-lg bg-white px-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 rounded-t border-b">
        <div className="w-full md:w-1/2">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Lista de Usuários
          </h4>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <button
            onClick={() => fetchUsers()}
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <RefreshIcon/>
            Recarregar Tabela
          </button>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <AddIcon/>
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
              <UsersTable users={users} />
            </div>

          )}
        </React.Fragment>

      {openAddModal && <AddUser setOpenAddModal={setOpenAddModal}/>}

      </div>
    </div>

  );
};