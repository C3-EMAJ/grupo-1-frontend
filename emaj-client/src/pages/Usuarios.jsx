import React, { useState } from "react";

import AddUser from "../ui/components/CRUD/AddUser";

import AddIcon from '@mui/icons-material/Add';

export default function Usuarios() {
  // Abrir o modal para adicioanr um novo usuário:
  const [openAddModal, setOpenAddModal] = useState(false);
  //


  return (
    <div className="bg-white dark:bg-gray-800 shadow-md sm:rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/2">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Lista de Usuários
          </h4>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <AddIcon/>
            Adicionar Usuário
          </button>
        </div>
      </div>
      {openAddModal && <AddUser setOpenAddModal={setOpenAddModal} openAddModal={openAddModal}/>}
    </div>

  );
};