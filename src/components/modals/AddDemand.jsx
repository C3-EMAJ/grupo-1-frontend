import React, { useEffect, useState } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import { addDemand } from '../../data/axios/apiCalls';

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

export default function AddDemand(props) {
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

    // Informações da demanda:
    const [demandNumber, setDemandNumber] = useState("");
    const [demandOffice, setDemandOffice] = useState("");
    const [demandSubject, setDemandSubject] = useState("");
    const [demandSummary, setDemandSummary] = useState("");
    
    const [demandStatus, setDemandStatus] = useState("");
    const getSelectedValue = (e) => {
        setDemandStatus(e.target.value);
    }
    //

    function validateForm() {
        const numberRegex = /^(\d{4})\.(\d{2})\.(\d{4})-(\d{1,2})\.(\d{4})\.(\d{4})$/
        if (demandNumber) {
            if (numberRegex.test(demandNumber))
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um número de processo válido, seguindo o padrão.")
            return false;
        }
        if (demandStatus === "") {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um status para a demanda.")
            return false;
        }
        if (demandOffice.length < 4) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um escritório válido.")
            return false;
        }
        if (demandSubject.length < 5) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um assunto válido.")
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

        const isActive = demandStatus === "Em Julgamento" || demandStatus === "Ação Pendente";

        // Faazendo a "apiCall":
        addDemand({"office": demandOffice, "subject": demandSubject, "status": demandStatus, "summary": demandSummary, "isActive": isActive })
        .then(response => {
            // Se der certo:
            if (response.status === 200) {
                setIsLoading(false);
                handleAlertMessage("success", "Demanda criada com sucesso.");
                resetInputs();
            }
            // Se o número de processo já estiver sendo usado, mas a solicitação for processada:
            else if (response.status === 204) {
                setIsLoading(false);
                handleAlertMessage("error", "Já existe uma demanda com esse número de processo.");
            }
            // Se ocorrer um erro no processamento:
            else if (response.status === 500) {
                setIsLoading(false);
                handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa de adicionar uma nova demanda.");
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
        setDemandNumber("");
        setDemandOffice("");
        setDemandSubject("");
        setDemandSummary("");
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
            <div className="relative bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                <h3 className="text-lg font-semibold text-gray-900">
                    Adicionar Demanda
                </h3>
                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    onClick={handleClose}
                >
                    <CloseIcon/>
                </button>
            </div>

            <div className="scroll-stylized max-h-96 overflow-y">
            <form>
            <div className="h-400 mr-2 ml-2 scroll-stylized overflow-auto grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Número do processo
                    </label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                    value={demandNumber} onChange={(e) => setDemandNumber(e.target.value)}
                    required 
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Escritório*
                    </label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                    value={demandOffice} onChange={(e) => setDemandOffice(e.target.value)}
                    required 
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                    Assunto*
                    </label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                    value={demandSubject} onChange={(e) => setDemandSubject(e.target.value)}
                    required 
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                    Status*
                    </label>
                    <select onChange={getSelectedValue} value={demandStatus} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300">
                    <option></option>
                    <option>Ação Pendente</option>
                    <option>Em Julgamento</option>
                    <option>Concluído</option>
                    </select>
                </div>

                <div rows="4" className="sm:col-span-2 p-4 block mb- border border-yellow-300 rounded-lg bg-yellow-50">
                    <div className="flex items-center items-center">
                        <InfoIcon style={{fontSize: 22, color: "#FDAE17"}}/>
                        <h3 className="text-lg ml-2 font-medium">Informação</h3>
                    </div>
                    <div>
                        <ul className="text-sm mt-2 list-disc list-inside">
                            <li> Os campos marcados com asterisco (<strong>*</strong>) são necessários para a criação de uma nova demanda.</li>
                            <li>O número do processo deve seguir o padrão <strong>NNNNNNN-DD.AAAA.J.TR.OOOO</strong></li>

                        </ul>
                    </div>
                </div>
                

                <div className="sm:col-span-2">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                        Resumo
                    </label>
                    <textarea rows="5" value={demandSummary} onChange={(e) => setDemandSummary(e.target.value)} className="scroll-stylized block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300">
                    </textarea>
                </div>
            
  
                </div>    

                <button
                    className="text-white inline-flex items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={isLoading}
                    onClick={handleSubmit}
                    type="submit"
                >
                    {(isLoading == false) ? (
                        <>
                        <AddIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                        Adicionar Demanda
                        </>
                    ) : (
                        <>
                        <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                        Adicionar Demanda
                        </>
                    )}
                </button>
            </form>
            </div>
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