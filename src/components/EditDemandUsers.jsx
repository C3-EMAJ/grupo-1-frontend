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

import { addUserOnDemand, getAllUsers, updateUserImage } from "../data/axios/apiCalls";
import RemoveUserImageDialogue from "./dialogues/RemoveUserImageDialogue";
import RemoveDemandUserDialogue from "./dialogues/RemoveDemandUserDialogue";

export default function EditDemandUsers(props) {
    const [isLoading, setIsLoading] = useState(false);

    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Usuários que serão mostrados;
    const [demandUsers, setDemandUsers] = useState(props.demandSelected.Users);
    //

    // Usuários que serão mostrados;
    const [usersToSelect, setUsersToSelect] = useState(false);

    useEffect(() => {
    if (usersToSelect === false){ 
        
        fetchUsers();

    }}, [usersToSelect]);
    
    const fetchUsers = async () => {
        try {
            if (isLoading === false) {
                setIsLoading(true)
            }

            const req = getAllUsers();
            req.then(response => {
                if (response.status === 200) {
                    setUsersToSelect(response.data);
                    setIsLoading(false)
                }

                else {
                    setIsLoading(false);
                    props.handleAlertMessage("error", "Erro ao achar os usuários.")
                    props.setShowEditUsers(false);
                }

                }).catch(error => {
                    setIsLoading(false);
                    props.handleAlertMessage("error", "Erro ao achar os usuários.")
                    props.setShowEditUsers(false);
                });
        } catch (error) {
            setIsLoading(false);
            props.handleAlertMessage("error", "Erro interno no servidor ao procurar os usuários.")
            props.setShowEditUsers(false);
        }
    };
    //
    
    // Mostrar ou não os usuários a serem selecionados:
    const [showSelectUsers, setShowSelectUsers] = useState(false);
    //

    // Mostrar ou não os usuários a serem selecionados:
    const [selectedUser, setSelectedUser] = useState(false);
    //

    // Quando clicam em um usuário no dropdown:
    const handleSelect = (user) => {   
        setShowSelectUsers(false);
        setSelectedUser(user);
    };
    //

    // Quando o botão "Carregar novo usuário" é clicado:
    const handleAddUserOnDemand = (e) => {
        e.preventDefault();
        if (selectedUser === false) {
            props.handleAlertMessage("error", "Insira um usuário.")
            return false
        }
        setIsLoading(true);

        console.log(props.demandSelected)
    
        addUserOnDemand({"idDemand": props.demandSelected.id , "idUser": selectedUser.id})
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                setIsLoading(false);
                props.handleAlertMessage("success", "Usuário adicionado com sucesso.");
                props.setDemandSelected(false);
                props.setShowEditUsers(false);

            }
            // Se não der certo:
            else {
                setIsLoading(false);
                props.handleAlertMessage("error", "Erro ao adicionar esse usuário.");
                setSelectedUser(false);
            }
        })
        // Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            setIsLoading(false);
            props.handleAlertMessage("error", "Erro interno no servidor.");
            setSelectedUser(false);
        });

    };
    //

    // Mostrar ou não o diálogo para remover um usuário de uma demanda:
    const [showRemoveUserDialogue, setShowRemoveUserDialogue] = useState(false);
    const [userToRemove, setUserToRemove] = useState(false);

    const handleDeleteUser = (user) => {
        setUserToRemove(user);
        setShowRemoveUserDialogue(true);
        props.setBlur(true);
    }
    //   

    return (
    <>
        <div className="bg-white rounded-lg">

        {(isLoading && selectedUser === false) ? (

            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: '15px', height: '300px'}}>
                <CircularProgress color="primary" />
            </Box>

        ) : (
            <>

            <div className="mr-2">


                {(demandUsers.length > 0) && (
                    <>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Usuários dessa demanda
                    </label>

                    <div className="w-full align-center mb-8 max-h-40 p-1 block mb- border border-yellow-300 rounded-lg scroll-stylized">
                    
                    <div className="grid grid-cols-3">
                    {demandUsers.map((item, index) => (
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
                          onClick={() => handleDeleteUser(item)}
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
                    Adicionar novos usuários
            </label>

            <button 
                onClick={() => setShowSelectUsers(!showSelectUsers)}
                disabled={selectedUser}
                className="text-white bg-yellow-500 w-full hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between"
            >
                
                <span>Selecionar novo usuário</span>
                {(showSelectUsers === false) ? (
                    <ExpandMoreIcon/>
                ) : (
                    <ExpandLessIcon/>
                )}

            </button>

            {showSelectUsers && (

                <div className="w-full bg-white max-h-40 scroll-stylized divide-y divide-gray-100 rounded-lg shadow-md">
                <div className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    {usersToSelect.map((item, index) => (
                        <button 
                        key={index} 
                        onClick={() => handleSelect(item)}
                        className="flex items-center justify-between mb-4 w-full hover:bg-gray-100">

                        <div className="flex items-center ml-2">
                          <img
                            className="object-cover w-8 h-8 rounded-full mr-4"
                            src={item.UserImage.url}
                          />
                        
                          <div className="block px-4 py-2">
                            {item.name} ({item.type})
                          </div>

                        </div>
                    
                    
                      </button>
                    ))}
                </div>
            </div>
            )}

            {selectedUser && (
                <div className="flex mt-4 flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg bg-gray-50">
                <div className="flex items-center">

                    <img
                        className="object-cover w-12 h-12 rounded-full mr-4"
                        src={selectedUser.UserImage.url}
                    />

                    <div className="flex flex-col">
                        <strong style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {selectedUser.name}
                        </strong>
                        <span className="text-xs text-gray-500 mt-1">
                        {selectedUser.type}
                        <button onClick={() => setSelectedUser(false)} className="border-0 bg-transparent text-red-500 ml-1 cursor-pointer">
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
                onClick={handleAddUserOnDemand}
                className="flex items-center h-11 py-2 px-2 text-sm font-medium text-center text-white text-white bg-yellow-500 border border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200 rounded-lg">
                    {(isLoading == false) ? (
                        <>
                        <FileUploadOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                        Carregar novo usuário
                        </>
                    ) : (

                        <>
                        <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                        Carregar novo usuário
                        </>
                    )}
                    
            </button>
             
        </div>

        {showRemoveUserDialogue && <RemoveDemandUserDialogue
                                                setDemandSelected={props.setDemandSelected}
                                                demandSelected={props.demandSelected}
                                                goBackButton={props.goBackButton}
                                                setShowEditUsers={props.setShowEditUsers}
                                                setShowRemoveUserDialogue={setShowRemoveUserDialogue} 
                                                userToRemove={userToRemove}
                                                handleAlertMessage={props.handleAlertMessage}
                                                setIsLoading={props.setIsLoading}
                                                setBlur={props.setBlur}
                                            />}
        
    </>
    )
}
