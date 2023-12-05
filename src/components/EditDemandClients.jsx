import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WestIcon from '@mui/icons-material/West';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { useSelector } from 'react-redux';

import { addClientOnDemand, getAllClients } from "../data/axios/apiCalls";

import RemoveDemandClientDialogue from "./dialogues/RemoveDemandClientDialogue";

export default function EditDemandClients(props) {
    const [isLoading, setIsLoading] = useState(false);

    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Usuários que serão mostrados;
    const [demandClients, setDemandClients] = useState(props.demandSelected.Clients);
    //

    // Usuários que serão mostrados;
    const [clientsToSelect, setClientsToSelect] = useState(false);

    useEffect(() => {
    if (clientsToSelect === false){ 
        
        fetchClients();

    }}, [clientsToSelect]);
    
    const fetchClients = async () => {
        try {
            if (isLoading === false) {
                setIsLoading(true)
            }

            const req = getAllClients();
            req.then(response => {
                if (response.status === 200) {
                    setClientsToSelect(response.data);
                    setIsLoading(false)
                }

                else {
                    setIsLoading(false);
                    props.handleAlertMessage("error", "Erro ao achar os clientes.")
                    props.setShowEditClients(false);
                }

                }).catch(error => {
                    setIsLoading(false);
                    props.handleAlertMessage("error", "Erro ao achar os clientes.")
                    props.setShowEditClients(false);
                });
        } catch (error) {
            setIsLoading(false);
            props.handleAlertMessage("error", "Erro interno no servidor.")
            props.setShowEditClients(false);
        }
    };
    //
    
    // Mostrar ou não os usuários a serem selecionados:
    const [showSelectClients, setShowSelectClients] = useState(false);
    //

    // Mostrar ou não os usuários a serem selecionados:
    const [selectedClient, setSelectedClient] = useState(false);
    //

    // Quando clicam em um usuário no dropdown:
    const handleSelect = (client) => {   
        setShowSelectClients(false);
        setSelectedClient(client);
    };
    //

    // Quando o botão "Carregar novo usuário" é clicado:
    const handleAddClientOnDemand = (e) => {
        e.preventDefault();
        if (selectedClient === false) {
            props.handleAlertMessage("error", "Insira um assistido.")
            return false
        }
        setIsLoading(true);
    
        addClientOnDemand({"idDemand": props.demandSelected.id , "idClient": selectedClient.id})
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                setIsLoading(false);
                props.handleAlertMessage("success", "Assistido adicionado com sucesso.");
                props.setDemandSelected(false);
                props.setShowEditClients(false);

            }
            // Se não der certo:
            else {
                setIsLoading(false);
                props.handleAlertMessage("error", "Erro ao adicionar esse assistido.");
                setSelectedClient(false);
            }
        })
        // Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            console.log(error)
            setIsLoading(false);
            props.handleAlertMessage("error", "Erro interno no servidor.");
            setSelectedClient(false);
        });

    };
    //

    // Mostrar ou não o diálogo para remover um usuário de uma demanda:
    const [showRemoveClientDialogue, setShowRemoveClientDialogue] = useState(false);
    const [clientToRemove, setClientToRemove] = useState(false);

    const handleDeleteClient = (client) => {
        setClientToRemove(client);
        setShowRemoveClientDialogue(true);
        props.setBlur(true);
    }
    //   

    return (
    <>
        <div className="bg-white rounded-lg">

        {(isLoading && selectedClient === false) ? (

            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: '15px', height: '300px'}}>
                <CircularProgress color="primary" />
            </Box>

        ) : (
            <>

            <div className="mr-2">


                {(demandClients.length > 0) && (
                    <>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Assistidos dessa demanda
                    </label>

                    <div className="w-full align-center mb-8 max-h-40 p-1 block mb- border border-yellow-300 rounded-lg scroll-stylized">
                    
                    <div className="grid grid-cols-3">
                    {demandClients.map((item, index) => (
                      <div key={index} className="inline-flex items-center mb-3 max-w-xs">
                          <div 
                            style={{ 
                              width: '160px',
                              height: '50px',
                              overflow: 'hidden',
                            }}
                            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <AccountCircleOutlinedIcon style={{ marginRight: '4px'}} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                          </div>

                  
                        <button
                          style={{ 
                            width: '50px',
                            height: '50px',
                          }}
                          onClick={() => handleDeleteClient(item)}
                          className="text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </div>
                    ))}
                    </div>
                    </div>
                    </>

                )}

            </div>

            <label className="block mb-3 text-sm font-medium text-gray-900">
                    Adicionar novos assistidos
            </label>

            <button 
                onClick={() => setShowSelectClients(!showSelectClients)}
                disabled={selectedClient}
                className="text-white bg-yellow-500 w-full hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
            >
                
                <span>Selecionar novo usuário</span>
                {(showSelectClients === false) ? (
                    <ExpandMoreIcon/>
                ) : (
                    <ExpandLessIcon/>
                )}

            </button>

            {showSelectClients && (

                <div className="w-full bg-white max-h-40 scroll-stylized divide-y divide-gray-100 rounded-lg shadow-md">
                <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    {clientsToSelect.map((item, index) => (
                        <button 
                        key={index} 
                        onClick={() => handleSelect(item)}
                        className="flex items-center justify-between mb-4 w-full hover:bg-gray-100">
                        
                        <div className="flex items-center ml-2">

                            <AccountCircleOutlinedIcon style={{ marginLeft: '4px', color: "black"}} />
                        
                          <div className="block px-4 py-2">
                            {item.name} (<strong>CPF:</strong> {item.cpf})
                          </div>

                        </div>
                    
                    
                      </button>
                    ))}
                </div>
            </div>
            )}

            {selectedClient && (
                <div className="flex mt-4 flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg bg-gray-50">
                <div className="flex items-center">

                    <AccountCircleOutlinedIcon style={{ marginRight: '5px', fontSize: '40px'}} />
                    <div className="flex flex-col">
                        <strong style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {selectedClient.name}
                        </strong>
                        <span className="text-xs text-gray-500 mt-1">
                        {selectedClient.cpf}
                        <button onClick={() => setSelectedClient(false)} className="border-0 bg-transparent text-red-500 ml-1 cursor-pointer">
                            Remover
                        </button>
                        </span>
                    </div>
                    </div>
               
                </div>
            )}
            </>
            
        )}

        </div>

        <div className="mt-4 ml-2 flex flex-row">
            <button 
                onClick={props.goBackButton}
                className="flex items-center h-11 py-2 px-2 mr-3 text-sm font-medium text-center text-black border border-yellow-300 bg-white-400 hover:bg-yellow-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                <WestIcon style={{marginRight: "5px", fontSize: "20px"}}/>
                Voltar
            </button>

            <button 
                onClick={handleAddClientOnDemand}
                className="flex items-center h-11 py-2 px-2 text-sm font-medium text-center text-white text-white bg-yellow-500 border border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200 rounded-lg">
                    {(isLoading == false) ? (
                        <>
                        <FileUploadOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                        Carregar novo assistido
                        </>
                    ) : (

                        <>
                        <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                        Carregar novo assistido
                        </>
                    )}
                    
            </button>
             
        </div>

        {showRemoveClientDialogue && <RemoveDemandClientDialogue
                                                setDemandSelected={props.setDemandSelected}
                                                demandSelected={props.demandSelected}
                                                goBackButton={props.goBackButton}
                                                setShowEditClients={props.setShowEditClients}
                                                setShowRemoveClientDialogue={setShowRemoveClientDialogue} 
                                                clientToRemove={clientToRemove}
                                                handleAlertMessage={props.handleAlertMessage}
                                                setIsLoading={props.setIsLoading}
                                                setBlur={props.setBlur}
                                            />}
        
    </>
    )
}
