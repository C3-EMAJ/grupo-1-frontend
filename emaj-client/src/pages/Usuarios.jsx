import React, { useEffect, useState } from "react";

import AddUser from "../ui/components/CRUD-Modals/AddUser";
import LoaderTables from "../ui/components/LoaderTables";
import UsersTable from "../ui/components/DataTables/UsersTable";

import { getAllUsers } from "../data/axios/apiCalls";

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Usuarios() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Abrir o modal para adicionar um novo usuário:
  const [openAddModal, setOpenAddModal] = useState(false);
  //

  // Usuário que é selecionado para alguma ação (editar ou excluir):
  const [selectedUser, setSelectedUser] = useState(false);
  //

  // Usuários que são pegos do DB:
  const [users, setUsers] = useState([]);
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
          const usersData = response.data;
          console.log(usersData)
          setUsers(usersData);
          setIsLoading(false)
        }).catch(error => {
          console.log(error)
        });
    } catch (error) {
      console.log(error);
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
            {isLoading ? (
              
              <LoaderTables />
              
              ) : (
                <div className="mt-4 w-full h-full mb-4">
                  <UsersTable users={users} />
                </div>
                )}

      {openAddModal && <AddUser setOpenAddModal={setOpenAddModal}/>}
      </div>
    </div>

  );
};