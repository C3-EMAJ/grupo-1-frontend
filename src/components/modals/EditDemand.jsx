import React, { useEffect, useState } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';

import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import EditDemandForm from "../EditDemandForm";
import EditDemandDocuments from "../EditDemandDocuments";
import EditDemandClients from "../EditDemandClients";
import { getOneDemand } from "../../data/axios/apiCalls";
import EditDemandUsers from "../EditDemandUsers";

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

export default function EditDemand(props) {
    const [isLoading, setIsLoading] = useState(false);

    // O "blur" quando o diálogo de exlusão de imagem aparece:
    const [isBlur, setBlur] = useState(false);
    //

    // Demanda que vai ser atualizada:
    const [demandSelected, setDemandSelected] = useState(false)
    //

    // Pegando uma demanda que pode estar desatualizada:
    useEffect(() => {
    if (demandSelected === false){ 
      fetchDemand();
    }

    }, [demandSelected]);
    
    const fetchDemand = async () => {
        try {
        if (isLoading === false) {
            setIsLoading(true)
        }

        const req = getOneDemand(props.selectedDemand.id);
        req.then(response => {
            if (response.status === 200) {
            setDemandSelected(response.data);
            setIsLoading(false)
            }

            else {
                setIsLoading(false);
                handleAlertMessage("error", "Erro ao pegar a demanda para ser atualizada.")
                setTimeout(() => { window.location.reload() }, 500);
            }

            }).catch(error => {
                setIsLoading(false);
                handleAlertMessage("error", "Erro ao pegar a demanda para ser atualizada.")
                setTimeout(() => { window.location.reload() }, 500);
            });
        } catch (error) {
            setIsLoading(false);
            handleAlertMessage("error", "Erro ao pegar a demanda para ser atualizada.")
            setTimeout(() => { window.location.reload() }, 500);
        }
    };
    //


    // Para fechar o modal:
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setEditDemandModal(false);
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

    // Qual parte exibir no modal:
    const [showEditInformations, setShowEditInformations] = useState(false);
    const [showEditDocuments, setShowEditDocuments] = useState(false);
    const [showEditClients, setShowEditClients] = useState(false);
    const [showEditUsers, setShowEditUsers] = useState(false);

    const goBackButton = (e) => {
        e.preventDefault();

        setShowEditInformations(false);
        setShowEditDocuments(false);
        setShowEditClients(false);
        setShowEditUsers(false);
    }
    //

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
                    Editar Demanda
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
                {showEditInformations ? (
                    
                    <EditDemandForm   
                        demandSelected={demandSelected} 
                        setDemandSelected={setDemandSelected}
                        setShowEditInformations={setShowEditInformations}
                        goBackButton={goBackButton}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        handleAlertMessage={handleAlertMessage}
                    />

                ) : showEditDocuments ? (
                
                    <EditDemandDocuments 
                        demandSelected={demandSelected}
                        setDemandSelected={setDemandSelected} 
                        goBackButton={goBackButton}
                        setShowEditDocuments={setShowEditDocuments}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        handleAlertMessage={handleAlertMessage}
                        setBlur={setBlur}
                    />

                ) : showEditClients  ? (
                
                    <EditDemandClients  
                        demandSelected={demandSelected}
                        setDemandSelected={setDemandSelected} 
                        goBackButton={goBackButton}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        handleAlertMessage={handleAlertMessage}
                        setBlur={setBlur}
                    />

                ) : showEditUsers  ? (
            
                    <EditDemandUsers  
                        demandSelected={demandSelected}
                        setDemandSelected={setDemandSelected} 
                        goBackButton={goBackButton}
                        setShowEditUsers={setShowEditUsers}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        handleAlertMessage={handleAlertMessage}
                        setBlur={setBlur}
                    />
                
                ) :  isLoading  ? (

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: '15px', height: '300px'}}>
                        <CircularProgress color="primary" />
                    </Box>

                ) : (
                    <div className="max-h-100 scroll-stylized">
                    <div className="mr-2">   
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
                                Número do processo, escritório, assunto, status...
                                </div>
                            </div>
                            <EastIcon style={{fontSize: 20}}/>
                            </label>
                        </button>
                    </li>
                    <li>
                        <button className="w-full" onClick={() => setShowEditDocuments(true)}>
                            <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 cursor-pointer">
                            <div className="block">
                                <div className="w-full text-lg font-semibold text-left">Documentos</div>
                                <div className="w-full text-gray-500">
                                Adicionar ou remover documentos
                                </div>
                            </div>
                            <EastIcon style={{fontSize: 20}}/>
                            </label>
                        </button>
                    </li>
                    <li>
                        <button className="w-full" onClick={() => setShowEditClients(true)}>
                            <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 cursor-pointer">
                            <div className="block">
                                <div className="w-full text-lg font-semibold text-left">Assistidos</div>
                                <div className="w-full text-gray-500">
                                Adicionar ou remover assistidos
                                </div>
                            </div>
                            <EastIcon style={{fontSize: 20}}/>
                            </label>
                        </button>
                    </li>
                    <li>
                        <button className="w-full" onClick={() => setShowEditUsers(true)}>
                            <label className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-yellow-300 rounded-lg hover:bg-yellow-50 cursor-pointer">
                            <div className="block">
                                <div className="w-full text-lg font-semibold text-left">Usuários</div>
                                <div className="w-full text-gray-500">
                                Adicionar ou remover e usuários a essa demanda
                                </div>
                            </div>
                            <EastIcon style={{fontSize: 20}}/>
                            </label>
                        </button>
                    </li>
                    </ul>
                    </div>   
                    </div>
                )}
            </React.Fragment>
            </>
            
            

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
    );
}
