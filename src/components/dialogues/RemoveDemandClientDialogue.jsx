import React, { useState } from "react";


import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import { removeClientOnDemand } from '../../data/axios/apiCalls';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
  
function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

export default function RemoveDemandClientDialogue(props) {
  // Para fechar o modal e mudar o estado do showRemoveUserImageDialogue:
  const [openAlert, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setBlur(false);
    props.setShowRemoveClientDialogue(false);
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


  // Para excluir um assistido da demanda da demanda:
  const handleDeleteDemandDocument = (e) => {
    e.preventDefault();

    removeClientOnDemand({"idUser": props.clientToRemove.id, "idDemand": props.demandSelected.id})
        .then(response => {
            // Se der certo:
            if (response.status == 200) {

                props.setBlur(false);
                props.setIsLoading(false);
                props.handleAlertMessage("success", "Assistido removido com sucesso.");
                props.setDemandSelected(false)
                props.setShowEditUsers(false);
            }
            else {
                props.setIsLoading(false);
                handleAlertMessage("error", "Erro ao remover o assistido.");
                
            }
        }).catch(error => {
            setIsLoading(false);
            handleAlertMessage("error", "Aconteceu um erro no processo, tente novamente mais tarde.");
        })
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
      <Box sx={style} >
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4 border-b rounded-t dark:border-gray-600">
                

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Remover Assistido
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
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ErrorOutlineOutlinedIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>

                <div className="text-left">
                    <p className="text-sm ml-3 text-gray-500 text-justify">
                        Você deseja remover o assistido <span style={{ color: 'red', fontWeight: '700' }}>{props.userToRemove.name}</span> dessa demanda? Você pode adicioná-lo em outro momento.
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-gray-50 py-4 px-4 text-center sm:flex sm:flex-row-reverse">
            <button
                type="button"
                className="inline-flex rounded-md bg-red-600 px-3 ml-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                onClick={handleDeleteDemandDocument}
            >
                Remover Assistido
            </button>
            <button
                type="button"
                className="inline-flex rounded-md bg-gray-100 border border-gray-400 px-3 ml-3 py-2 text-sm font-semibold text- shadow-sm hover:bg-gray-200"
                onClick={handleClose}
            >
                Cancelar 
            </button>
        </div>
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
  )
}
