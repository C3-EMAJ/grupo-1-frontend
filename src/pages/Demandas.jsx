import React, { useEffect, useState } from "react";

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

import LoaderTables from "../components/LoaderTables";
import DemandsTable from "../components/datatables/DemandsTable";
import AddDemand from "../components/modals/AddDemand";

import { getAllDemands } from "../data/axios/apiCalls";
import DemandsCompletedTable from "../components/datatables/DemandsCompleted";


export default function Demandas() {
  const [isLoading, setIsLoading] = useState(true);

  // Demandas que são pegos do DB:
  const [demands, setDemands] = useState([]);
  const [completedDemands, setCompletedDemands] = useState([]);
  const [seeCompletedDemands, setSeeCompletedDemands] = useState(false);
  //

  // Abrir o modal para adicionar uma nova demanda:
  const [openAddModal, setOpenAddModal] = useState(false);
  //

  // Se ocorrer um erro ao fazer o "fetch" das demandas:
  const [errorGettingTheDemandsTable, setErrorGettingTheDemandsTable] = useState(false);
  //

  // Verificando se "demands" está vazio:
  useEffect(() => {
    if (demands.length === 0){ 
      fetchDemands();
    }

  }, []);
  //

  // Requisição para a API:
  const fetchDemands = async () => {
    try {
      if (isLoading === false) {
        setIsLoading(true)
      }

      const req = getAllDemands();
      req.then(response => {
        if (response.status === 200) {
          const demandsData = response.data;
          organizeDemands(demandsData);
        }

        else {
          setIsLoading(false);
          setErrorGettingTheDemandsTable(true);
        }

        }).catch(error => {
          console.log(error)
          setIsLoading(false);
          setErrorGettingTheDemandsTable(true);
        });
    } catch (error) {
      setIsLoading(false);
      setErrorGettingTheDemandsTable(true);
    }
  };

  function organizeDemands(demandsData) {
    var activeDemandsOnFetch = [];
    var completedDemandsOnFetch = [];

    // Separando os usuários ativos dos usuários desativados:
    demandsData.map((item, index) => {
      if (item.isActive == true) {
        activeDemandsOnFetch.push(item);
      } else {
        completedDemandsOnFetch.push(item);
      }
    });
    //

    setDemands(activeDemandsOnFetch);
    setCompletedDemands(completedDemandsOnFetch);

    setIsLoading(false);
    setErrorGettingTheDemandsTable(false)
  }
  //

  // Ver ou não demandas desativadas (concluídas):
  const handleCompletedDemands =  () => {
    if (seeCompletedDemands == false) {
      setSeeCompletedDemands(true)
    } else {
      setSeeCompletedDemands(false)
    }
  }
  //
  
  return (
    <div className="flex flex-col min-h-screen rounded-md border screen rounded-lg bg-white px-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 rounded-t border-b">
        <div className="w-full md:w-1/2">
        {seeCompletedDemands ? 
          (
            <h4 className="text-xl font-semibold text-black dark:text-white">
                Demandas Concluídas
            </h4>
          ) : (
            <h4 className="text-xl font-semibold text-black dark:text-white">
                Demandas Ativas
            </h4>
            )
          }
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          
          <button
              onClick={() => handleCompletedDemands()}
              className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
            > 
            {seeCompletedDemands == false ? (
              <>
                <CheckBoxOutlinedIcon style={{ marginRight: '4px' }} />
                Ver Concluídas
              </>
            ):(
              <>
                <GavelOutlinedIcon style={{ marginRight: '4px'}} />
                Ver Ativas
              </>
            )}
              
          </button>
          
          
          <button
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
            onClick={() => fetchDemands()}
          >
            <RefreshIcon  style={{ marginRight: '4px' }}/>
            Recarregar Demandas
          </button>

          <button
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
            onClick={() => setOpenAddModal(true)}
          >
            <AddIcon  style={{ marginRight: '4px' }}/>
            Adicionar Demanda
          </button>

        </div>
        
      </div>
      
      {/* Tabela e loading: */}
      <div className="flex flex-colum w-full h-full">
      <React.Fragment>
          {isLoading ? (

            <LoaderTables />

          ) : errorGettingTheDemandsTable ? (

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

              {seeCompletedDemands == false ? (
                <DemandsTable demands={demands} />
              ) : (
                <DemandsCompletedTable completedDemands={completedDemands} />
              )}
              
            </div>

          )}
        </React.Fragment>

      {openAddModal && <AddDemand setOpenAddModal={setOpenAddModal}/>}
      </div>
    </div>
  );
};