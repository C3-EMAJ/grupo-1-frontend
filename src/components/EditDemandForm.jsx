import React, { useEffect, useState } from "react";

import WestIcon from '@mui/icons-material/West';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { updateDemand } from '../data/axios/apiCalls';

import { useSelector } from 'react-redux';

import CircularProgress from '@mui/material/CircularProgress';

export default function EditDemandForm(props) {
    const [isLoading, setIsLoading] = useState(false);

    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Informações da demanda:
    const [newDemandNumber, setNewDemandNumber] = useState(props.selectedDemand.number);
    const [newDemandOffice, setNewDemandOffice] = useState(props.selectedDemand.office);
    const [newDemandSubject, setNewDemandSubject] = useState(props.selectedDemand.subject);
    const [newDemandSummary, setNewDemandSummary] = useState(props.selectedDemand.summary);
    
    const [newDemandStatus, setNewDemandStatus] = useState(props.selectedDemand.status);
    const getSelectedValue = (e) => {
      setNewDemandStatus(e.target.value);
    }
    //
    
    
    // Lógica para o formulário de alteração de informações:
    function validateForm() {
        const numberRegex = /^(\d{4})\.(\d{2})\.(\d{4})-(\d{1,2})\.(\d{4})\.(\d{4})$/
        if (newDemandNumber) {
            if (numberRegex.test(demandNumber))
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um número de processo válido, seguindo o padrão.")
            return false;
        }
        if (newDemandStatus === "") {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um status para a demanda.")
            return false;
        }
        if (newDemandOffice.length < 4) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um escritório válido.")
            return false;
        }
        if (newDemandSubject.length < 5) {
            setIsLoading(false)
            handleAlertMessage("warning", "Insira um assunto válido.")
            return false;
        }

        return true
    }
    //

    // Botão do formulário para alterar informações:
    const  handleSubmit = (e) => {
        e.preventDefault();
        if (props.isLoading) {
            return false;
        }

        if (!validateForm()) {
            return false;
        }
        
        props.setIsLoading(true);

        const newDemandActive = newDemandStatus === "Ação Pendente" || newDemandStatus === "Em Julgamento";

        // Faazendo a "apiCall": 
        updateDemand(props.selectedDemand.id, {"office": newDemandOffice, "subject": newDemandSubject, "status": newDemandStatus, "summary": newDemandSummary, "isActive": newDemandActive })
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                props.setIsLoading(false);
                props.handleAlertMessage("success", "Demanda alterada com sucesso.");
                setTimeout(() => { window.location.reload() }, 500);
            }
            // Se não der certo:
            else {
                props.setIsLoading(false);
                props.handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa editar a demanda.");
            }
        })
        // Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            props.setIsLoading(false);
            props.handleAlertMessage("error", "Erro interno no servidor, tente novamente mais tarde.");
        });
        
    }
    //

    // Resetar os inputs da parte de editar informações:
    function resetInputs() {
        setNewDemandNumber("");
        setNewDemandOffice("");
        setNewDemandSubject("");
        setNewDemandSummary("");
    }
    //
    
    return (
    <>
        <div className="scroll-stylized max-h-96 overflow-y">
            <form>
            <div className="h-400 mr-2 ml-2 scroll-stylized overflow-auto grid gap-4 mb-4 sm:grid-cols-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Número do processo
                    </label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                    value={newDemandNumber} onChange={(e) => setNewDemandNumber(e.target.value)}
                    required 
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                        Escritório*
                    </label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                    value={newDemandOffice} onChange={(e) => setNewDemandOffice(e.target.value)}
                    required 
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                    Assunto*
                    </label>
                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                    value={newDemandSubject} onChange={(e) => setNewDemandSubject(e.target.value)}
                    required 
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                    Status*
                    </label>
                    <select onChange={getSelectedValue} value={newDemandStatus} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300">
                    <option></option>
                    <option>Ação Pendente</option>
                    <option>Em Julgamento</option>
                    <option>Concluído</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                        Resumo
                    </label>
                    <textarea rows="5" value={newDemandSummary} onChange={(e) => setNewDemandSummary(e.target.value)} className="scroll-stylized block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300">
                    </textarea>
                </div>
            
  
                </div>    
            </form>
            </div>

            <div className="mt-4 flex flex-row">
            <button 
                onClick={props.goBackButton}
                className="flex items-center h-11 py-2 px-2 mr-3 text-sm font-medium text-center text-black border border-yellow-300 bg-white-400 hover:bg-yellow-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                <WestIcon style={{marginRight: "5px", fontSize: "20px"}}/>
                Voltar
            </button> 

            <button
                    className="text-white inline-flex items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={isLoading}
                    onClick={handleSubmit}
                    type="submit"
                >
                    {(isLoading == false) ? (
                        <>
                        <EditOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                        Editar Demanda
                        </>
                    ) : (
                        <>
                        <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                        Editar Demanda
                        </>
                    )}
                </button>  
        </div>

    </>
    )
}
