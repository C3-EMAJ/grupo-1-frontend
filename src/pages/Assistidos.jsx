import React, { useEffect, useState } from "react";

// Componentes:
import LoaderTables from "../components/LoaderTables";
import ClientTable from "../components/datatables/ClientTable";
import DisabledClientsTable from "../components/datatables/DisabledClients";
// Ícones:
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddClient from "../components/modals/AddClient";
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import BedtimeOffOutlinedIcon from '@mui/icons-material/BedtimeOffOutlined';

import {getAllClients} from "../data/axios/apiCalls"

import { useSelector } from 'react-redux';

export default function Assistidos() {
  const user = useSelector((state) => state.user.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [clients, setClients] = useState([])
  const [disabledClients, setDisabledClients] = useState([])
  const [ErrorGettingTheClientsTable, setErrorGettingTheClientsTable] = useState(false)
  useEffect(()=> {
    fetchClients();
  }, [])

  useEffect(() => {
  }, [clients])

  const fetchClients = async () => {
    try {
      if (isLoading === false) {
        setIsLoading(true)
      }
      const req = getAllClients()
      req.then(response => {
        if (response.status === 200) {
          formatClients(response.data)
        } else {
          setErrorGettingTheClientsTable(true)
        }
        setIsLoading(false);
      }).catch(error => {
        console.log(error)
        setIsLoading(false);
        setErrorGettingTheClientsTable(true);
      });
    } catch(err) {
      setIsLoading(false);
      setErrorGettingTheClientsTable(true);
    }
  }

  const formatClients = (allClients) => {
    const formattedClients = []
    const activeClientsOnFetch = []
    const disabledClientsOnFetch = []
    allClients.map((item, index)=> {
      formattedClients.push({
        id: item.id,
        name: item.name,
        cpf: item.cpf,
        email: item.ClientContact.email,
        phone: item.ClientContact.phone,
        birthday: new Date(item.birthday).toLocaleDateString('pt-BR'),
        isActive: item.isActive
      })
    })
    formattedClients.map((item, index) => {
      if (item.isActive == true) {
        activeClientsOnFetch.push(item);
      } else {
        disabledClientsOnFetch.push(item);
      }
    });
    setClients(activeClientsOnFetch)
    setDisabledClients(disabledClientsOnFetch)
  }

  const [seeDisabledClients, setSeeDisabledClients] = useState(false)
  const handleSeeDisabledClients = () => {
    setSeeDisabledClients(!seeDisabledClients)
  }

  return (
    <div className="flex flex-col min-h-screen rounded-md border screen rounded-lg bg-white px-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 rounded-t border-b">
        <div className="w-full md:w-1/2">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Lista de Assistidos
          </h4>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          {/* onClick abaixo (funcionalidade ao botão): */}
          
          {user.isAdmin && (
              <button
                onClick={() => handleSeeDisabledClients()}
                className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
              > 
              {seeDisabledClients == false ? (
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
            onClick={() => fetchClients()}
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <RefreshIcon/>
            Recarregar Tabela
          </button>

          {/* onClick abaixo (funcionalidade ao botão): */}
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center justify-center text-white bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-gray-200 dark:hover-bg-yellow-400 focus:outline-none"
          >
            <AddIcon/>
            Adicionar Assistido
          </button>
          
        </div>
        
      </div>
      
      {/* Tabela e loading: */}
      <div className="flex flex-colum w-full h-full">
        <React.Fragment>
          {isLoading ? (
            
            <LoaderTables />
            
            ) : ErrorGettingTheClientsTable ? (
              <div className="w-full">
                <div className="bg-red-500 mt-5 text-white font-bold rounded-t px-4 py-2">
                  Ocorreu um Erro
                </div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  <p>Se o erro persistir contate os administradores do sistema.</p>
                </div>
              </div>
            ): (
              <div className="mt-4 w-full h-full mb-4">
                {seeDisabledClients == false ? (
                  <ClientTable clients={clients}/>
                ): (
                  <DisabledClientsTable disabledClients={disabledClients} />
                )}
              </div>
              ) 
            
          }
        </React.Fragment>
      </div>
      {openAddModal && <AddClient setOpenAddModal={setOpenAddModal}/>}
    </div>
  );
};