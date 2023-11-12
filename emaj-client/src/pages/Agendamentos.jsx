import React, { useEffect, useState } from "react";

// Componentes:
import LoaderTables from "../components/LoaderTables";

// Ícones:
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Agendamentos() {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="flex flex-col min-h-screen rounded-md border screen rounded-lg bg-white px-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 rounded-t border-b">
        <div className="w-full md:w-1/2">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Agendamentos
          </h4>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          {/* onClick abaixo (funcionalidade ao botão): */}
          <button
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <RefreshIcon/>
            Recarregar Agendamentos
          </button>

          {/* onClick abaixo (funcionalidade ao botão): */}
          <button
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <AddIcon/>
            Adicionar Agendamento
          </button>
          
        </div>
        
      </div>
      
      {/* Tabela e loading: */}
      <div className="flex flex-colum w-full h-full">
            {isLoading ? (
              
              <LoaderTables />
              
              ) : (
                <div className="mt-4 w-full h-full mb-4">
                  {/* Tabela (ou calendário) vai aqui */}
                </div>
                )}
      </div>
    </div>
  );
};