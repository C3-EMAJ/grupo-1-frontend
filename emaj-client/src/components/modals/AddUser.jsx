import React, { useEffect, useState } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import { addUser } from '../../data/axios/apiCalls';

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

// Gerando uma senha aleatória:
function generateRandomPassword() {
    let password = "";
    const possibleDigits = "0123456789";
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * 10);
        const randomDigit = possibleDigits[randomIndex];
        password += randomDigit;
    }
    return password;
};
//

export default function AddUser(props) {
    const [isLoading, setIsLoading] = useState(false);

    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setOpenAddModal(false);
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
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    
    const [userFunction, setUserFunction] = useState("");
    const getSelectedValue = (e) => {
      setUserFunction(e.target.value);
    }
    //

    function validateForm() {
        if (userName.length <= 3) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um nome válido.")

            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|furg\.br)$/
        if (!emailRegex.test(userEmail)) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um email válido (@gmail.com ou @furg.br).")

            return false;
        }

        if (userFunction.length == "") {
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

        const randomPassword = generateRandomPassword();
        const isAdmin = userFunction === "Professor" || userFunction === "Secretário" || userFunction === "Administrador";

        // Faazendo a "apiCall":
        addUser({ "name": userName, "email": userEmail, "type": userFunction, "password": randomPassword, "isAdmin": isAdmin })
        .then(response => {
            // Se der certo:
            if (response.status === 200) {
                console.log("Sucesso");
                setIsLoading(false);
                handleAlertMessage("success", "Usuário criado com sucesso.");
                resetInputs();
            }
            // Se o email já estiver sendo usado, mas a solicitação for processada:
            else if (response.status === 204) {
                setIsLoading(false);
                handleAlertMessage("error", "Este email já está sendo usado.");
            }
            // Se ocorrer um erro no processamento:
            else if (response.status === 500) {
                setIsLoading(false);
                handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa de adicionar um usuário.");
            }
        })
        // Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            console.log(error)
            setIsLoading(false);
            handleAlertMessage("error", "Erro interno no servidor, tente novamente mais tarde.");
        });
        
    }

    function resetInputs() {
        setUserName("");
        setUserEmail("");
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
                    Adicionar Usuário
                </h3>
                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover-bg-gray-600 dark:hover-text-white"
                    onClick={handleClose}
                >
                    <CloseIcon/>
                </button>
            </div>

            <form>
            <div className="grid gap-4 mb-4 sm:grid-cols-3">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nome
                </label>
                <input
                    type="text"
                    name="name"
                    
                    value={userName} onChange={(e) => setUserName(e.target.value)}

                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                    placeholder="Nome do usuário"
                    required
                />
            </div>
            
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Email
                </label>
                <input
                    type="email"
                    name="email"

                    value={userEmail} onChange={(e) => setUserEmail(e.target.value)}

                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                    placeholder="Email do usuário"
                    required
                />
              </div>
             
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Função
                </label>
                <select onChange={getSelectedValue} value={userFunction} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300">
                    <option></option>
                    <option>Estagiário</option>
                    <option>Residente</option>
                    <option>Secretário</option>

                    {(user.type == "Administrador" || user.type == "Professor") && (
                        <option>Professor</option>
                    )}

                    {(user.type == "Administrador") && (
                        <option>Administrador</option>
                    )}

                </select>
            </div>

            </div>

            <div className="p-4 mb-4  border border-yellow-300 rounded-lg bg-yellow-50">
                <div className="flex items-center items-center">
                    <InfoIcon style={{fontSize: 22, color: "#FDAE17"}}/>
                    <h3 className="text-lg ml-2 font-medium">Informação</h3>
                </div>
                <div>
                    <div className="mt-2 mb-2 text-sm">
                    Certifique-se que o email inserido seja válido, pois será necessário para o usuário adicionado redefinir a senha antes de efetuar o login no sistema.
                    </div>
                    <ul className="text-sm list-disc list-inside">
                        <li>São aceitos emails <b>@furg.br</b> e <b>@gmail.com</b></li>
                    </ul>
                </div>
            </div>

            <button
                className="text-white inline-flex items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                disabled={isLoading}
                onClick={handleSubmit}
                type="submit"
            >
                <AddIcon/>
                Adicionar Usuário
            </button>
        </form>
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