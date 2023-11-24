import React, { useEffect, useState } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { updateUser, getUser } from '../../data/axios/apiCalls';

import { useSelector } from 'react-redux';

import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
};

export default function EditUser(props) {
    const [isLoading, setIsLoading] = useState(false);

    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setEditUserModal(false);
    }
    //

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

    // Informações do usuário:
    const oldUserFunction = props.selectedUser.type;
    const [newUserName, setNewUserName] = useState(props.selectedUser.name);
    const [newUserEmail, setNewUserEmail] = useState(props.selectedUser.email);
    
    const [newUserFunction, setNewUserFunction] = useState(props.selectedUser.type);
    const getSelectedValue = (e) => {
      setNewUserFunction(e.target.value);
    }
    //

    // Qual parte exibir no modal (botões, editar informações ou editar imagem):
    const [showEditInformations, setShowEditInformations] = useState(false);
    const [showEditImage, setShowEditImage] = useState(false);

    const goBackButton = (e) => {
        e.preventDefault();

        setShowEditInformations(false);
        setShowEditImage(false);

        resetInputs();
    }

    //

    function validateForm() {
        if (newUserName.length <= 3) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um nome válido.")

            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|furg\.br)$/
        if (!emailRegex.test(newUserEmail)) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um email válido (@gmail.com ou @furg.br).")

            return false;
        }

        if (newUserFunction.length == "") {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira uma função para o usuário.")

            return false;
        }

        return true
    }

    const  handleSubmit = (e) => {
        e.preventDefault();
        if (isLoading) {
            return false;
        }

        if (!validateForm()) {
            return false;
        }
        
        setIsLoading(true);

        const isAdmin = newUserFunction === "Professor" || newUserFunction === "Secretário" || newUserFunction === "Administrador";

        // Faazendo a "apiCall":
        updateUser(props.selectedUser.id, { "name": newUserName, "email": newUserEmail, "type": newUserFunction, "isAdmin": isAdmin })
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                setIsLoading(false);
                handleAlertMessage("success", "Usuário alterado com sucesso.");
                setTimeout(() => { window.location.reload() }, 500);
            }
            // Se não der certo:
            else {
                setIsLoading(false);
                handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa editar o usuário.");
            }
        })
        // Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            setIsLoading(false);
            handleAlertMessage("error", "Erro interno no servidor, tente novamente mais tarde.");
        });
        
    }

    function resetInputs() {
        setNewUserName(props.selectedUser.name);
        setNewUserEmail(props.selectedUser.email);
    }
    
    return(
        <Modal
            open={openAlert}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <>
        <Box sx={style}>
        <div className="relative">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Editar Usuário
                </h3>
                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover-bg-gray-600 dark:hover-text-white"
                    onClick={handleClose}
                >
                    <CloseIcon/>
                </button>
            </div>

            <>
            <React.Fragment>
                {(showEditInformations == true && showEditImage === false) ? (
                    
                <>
                    <form>

                        <div className="mb-4">

                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="name"
                                
                                value={newUserName} onChange={(e) => setNewUserName(e.target.value)}

                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                placeholder="Nome do usuário"
                                required
                            />
                        </div>
            
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"

                                value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)}

                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                placeholder="Email do usuário"
                                required
                            />
                        </div>
             
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Função
                            </label>

                            {(oldUserFunction == "Administrador") ? (

                                <select onChange={getSelectedValue} value={newUserFunction} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300">
                                    <option>{props.selectedUser.type}</option>
                                </select>
                            ) : (
                            
                            <select onChange={getSelectedValue} value={newUserFunction} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300">
                                <option>{props.selectedUser.type}</option>

                                {(oldUserFunction != "Estagiário") && (
                                    <option>Estagiário</option>
                                )}
                                {(oldUserFunction != "Residente") && (
                                    <option>Residente</option>
                                )}
                                {(oldUserFunction != "Secretário") && (
                                    <option>Secretário</option>
                                )}

                                {((user.type == "Administrador" || user.type == "Professor") && oldUserFunction != "Professor") && (
                                    <option>Professor</option>
                                )}

                                {(user.type == "Administrador" && oldUserFunction != "Administrador") && (
                                    <option>Administrador</option>
                                )}

                            </select>) }

                        </div>
                    </form>
                    
                    <div className="mt-4 flex flex-row">
                        <button 
                            onClick={goBackButton}
                            className="flex items-center h-11 py-2 px-2 mr-3 text-sm font-medium text-center text-black border border-yellow-300 bg-white-400 hover:bg-yellow-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            <WestIcon style={{marginRight: "5px", fontSize: "20px"}}/>
                            Voltar
                        </button> 

                        <button 
                            onClick={handleSubmit}
                            className="flex items-center h-11 py-2 px-2 text-sm font-medium text-center text-white text-white bg-yellow-500 border border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200 rounded-lg">
                                <EditOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                                Editar Usuário
                        </button>     
                    </div>

                </>

                ) : (showEditImage == true && showEditInformations === false) ? (
                <>
                <div className="bg-white rounded-lg">

                    <div className="flex">
                        <div className="flex-none">
                            <label className="flex flex-col h-36 items-center justify-center h-32 w-32 rounded-lg cursor-pointer">
                                <div className="flex flex-col items-center justify-center">
                                    <img
                                    src={props.selectedUser.img || "https://i.imgur.com/oYEFKb1.png"} className="w-28 h-28 border-4 border-white rounded-full"
                                    alt="Profile"
                                    />
                                </div>
                                <input type="file" className="hidden" />
                            </label>
                            
                        </div>
                        <div className="flex-1 w-64 ...">
                        
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                <div className="flex flex-col items-center justify-center">
                                    <CloudUploadOutlinedIcon style={{ fontSize: "1.8rem"}}/>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique aqui para fazer upload</span> ou arraste a nova imagem</p>
                                    <p className="text-xs text-gray-500">.PNG</p>
                                </div>
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                        </div>
                    </div> 
                </div>

                <div className="mt-4 ml-2 flex flex-row">
                    <button 
                        onClick={goBackButton}
                        className="flex items-center h-11 py-2 px-2 mr-3 text-sm font-medium text-center text-black border border-yellow-300 bg-white-400 hover:bg-yellow-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        <WestIcon style={{marginRight: "5px", fontSize: "20px"}}/>
                        Voltar
                    </button>

                    <button 
                        onClick={goBackButton}
                        className="flex items-center h-11 py-2 px-2 text-sm font-medium text-center text-white text-white bg-yellow-500 border border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200 rounded-lg">
                            <FileUploadOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                            Carregar nova imagem
                    </button>


                    <button 
                        onClick={goBackButton}
                        className="flex items-center h-11 py-2 px-2 ml-3 text-sm font-medium text-center text-red-700 bg-white rounded-lg border border-red-700 hover:bg-red-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300">
                            <DeleteOutlineOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                            Remover imagem atual
                    </button>    
                </div>
                </>

                ) : (

                <>
                    <p className="text-gray-600 mb-4">
                    Selecione o que você deseja alterar:
                    </p>
                    <ul className="space-y-4 mb-4">
                    <li>
                        <button className="w-full" onClick={() => setShowEditInformations(true)}>
                            <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 cursor-pointer">
                            <div className="block">
                                <div className="w-full text-lg font-semibold text-left">Informações</div>
                                <div className="w-full text-gray-500">
                                Nome, email ou função
                                </div>
                            </div>
                            <EastIcon style={{fontSize: 20}}/>
                            </label>
                        </button>
                    </li>
                    <li>
                        <button className="w-full" onClick={() => setShowEditImage(true)}>
                            <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 cursor-pointer">
                            <div className="block">
                                <div className="w-full text-lg font-semibold text-left">Imagem</div>
                                <div className="w-full text-gray-500">
                                Foto do usuário
                                </div>
                            </div>
                            <EastIcon style={{fontSize: 20}}/>
                            </label>
                        </button>
                    </li>
                    </ul>
                </>
                )}
            </React.Fragment>
            </>
            
            

        </div>

        <React.Fragment>
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <CircularProgress color="primary" />
                </Box>
            )}
        </React.Fragment>

      </div>
        </Box>      
      
      <Snackbar
            open={showAlertMessage}
            severity="success"
            TransitionComponent={SlideTransition}
            anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
            }}>
            <Alert  severity={typeAlertMessage} sx={{ width: '100%' }}>
            {alertMessage}
            </Alert>
        </Snackbar>
    </>
      </Modal>
    );
}
