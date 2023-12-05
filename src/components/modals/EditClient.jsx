import React, { useEffect, useState } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';

import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import EditClientAddress from "../EditClientAddress";
import EditClientInformation from "../EditClientInformation";

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

export default function EditClient(props) {
    const [isLoading, setIsLoading] = useState(false);

    // O "blur" quando o diálogo de exlusão de imagem aparece:
    const [isBlur, setBlur] = useState(false);
    //

    // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setEditClientModal(false);
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

    // Qual parte exibir no modal (botões, editar informações ou editar imagem):
    const [showEditInformation, setShowEditInformation] = useState(false);
    const [showEditAddress, setShowEditAddress] = useState(false);

    const goBackButton = (e) => {
        e.preventDefault();

        setShowEditInformation(false);
        setShowEditAddress(false);
    }
    

    return(
        <Modal
            open={openAlert}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <>
        <Box sx={style} className={`${isBlur && "blur-xl"}`}>
        <div className="relative">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Editar Assistido
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
                {(showEditInformation == true && showEditAddress === false) ? (
                    
                    <EditClientInformation   
                        selectedClient={props.selectedClient} 
                        goBackButton={goBackButton}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        handleAlertMessage={handleAlertMessage}
                    />

                ) : (showEditAddress == true && showEditInformation === false) ? (
                
                    <EditClientAddress  
                        selectedClient={props.selectedClient}
                        goBackButton={goBackButton}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        handleAlertMessage={handleAlertMessage}
                        setBlur={setBlur}
                    />

                ) : (

                <>
                    <p className="text-gray-600 mb-4 dark:text-white">
                        Selecione o que você deseja alterar:
                    </p>
                    <ul className="space-y-4 mb-4">
                    <li>
                        <button className="w-full" onClick={() => setShowEditInformation(true)}>
                            <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 cursor-pointer">
                            <div className="block">
                                <div className="w-full text-lg font-semibold text-left">Informações</div>
                                <div className="w-full text-gray-500">
                                    Nome, E-mail, RG, CPF...
                                </div>
                            </div>
                            <EastIcon style={{fontSize: 20}}/>
                            </label>
                        </button>
                    </li>
                    <li>
                        <button className="w-full" onClick={() => setShowEditAddress(true)}>
                            <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 cursor-pointer">
                            <div className="block">
                                <div className="w-full text-lg font-semibold text-left">Endereço</div>
                                <div className="w-full text-gray-500">
                                    CEP, Rua, Complemento e Número.
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
