import React, { useEffect, useState } from "react";

import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { deactivateClient } from '../../data/axios/apiCalls';

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
  width: 500,

};

export default function DeactivateClientDialogue(props) {
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
  
  const [isLoading, setIsLoading] = useState(false);

  // Pegando o usuário logado, para pegar as informações:
  const user = useSelector((state) => state.user.currentUser);
  //

  // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
  const [openAlert, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setDeactivateClientDialogue(false);
  }
  //


  // Para desativar o assistido:
  const handleDeactivateClient = async (e) => {
      e.preventDefault()

      setIsLoading(true)

      deactivateClient(props.selectedClient.id)
      .then(response => {
        if (response.status === 200) {
          handleAlertMessage("success", "O assistido foi desativado com sucesso.")
          setIsLoading(false)
          setTimeout(() => { window.location.reload() }, 500);
        } else {
            handleAlertMessage("error", "Algo deu errado na tentativa de desativar esse assistido.")
            setIsLoading(false)
        }
        }).catch(error => {
          handleAlertMessage("error", "Aconteceu um erro interno no servidor, tente novamente mais tarde.")
          setIsLoading(false)
        });
  }
  //

  return (
    <Modal
      open={openAlert}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
    <>
      <Box sx={style}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4 border-b rounded-t dark:border-gray-600">
            
                <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                    Desativação de Assistido
                </h3>

                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover-bg-gray-600 dark:hover-text-white"
                    onClick={handleClose}
                >
                    <CloseOutlinedIcon/>
                    <span className="sr-only">Fechar modal</span>
                </button>
            </div>
          
            <div className=" flex sm:items-start mt-5">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ErrorOutlineOutlinedIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                </div>

                <div className="text-left">
                    <p style={{marginTop: "10px" }} className="text-sm ml-3 text-gray-500 text-justify">
                        Você realmente deseja desativar o assistido <span style={{ color: 'purple', fontWeight: '700', marginTop: "30px" }}>{props.selectedClient.name}</span>?
                    </p>
                </div>
                
            </div>
        </div>

        <div className="bg-gray-50 py-4 px-4 text-center sm:flex sm:flex-row-reverse">
            <button
                type="button"
                className="inline-flex rounded-md bg-purple-600 px-3 ml-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                onClick={handleDeactivateClient}
                disabled={isLoading || showAlertMessage}
            >
                Desativar Assistido
            </button>
        </div>
      </div>
      <React.Fragment>
        {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <CircularProgress color="primary" />
            </Box>
        )}
      </React.Fragment>

      
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
  )
}
