import React, { useEffect, useState } from "react";

import WestIcon from '@mui/icons-material/West';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { updateUser, getUpdatedUser } from '../data/axios/apiCalls';

import { useSelector, useDispatch } from 'react-redux';
import { reducerUserLogin } from "../redux/userRedux";

export default function EditUserForm(props) {
    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Dispatch para o atualizar o usupário logado ():
    const dispatchUpdate = useDispatch();
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
    
    
    // Lógica para o formulário de alteração de informações:
    function validateForm() {
        if (newUserName.length <= 3) {
            props.setIsLoading(false)
            props.handleAlertMessage("warning", "Insira um nome válido.")

            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|furg\.br)$/
        if (!emailRegex.test(newUserEmail)) {
            props.setIsLoading(false)
            props.handleAlertMessage("warning", "Insira um email válido (@gmail.com ou @furg.br).")

            return false;
        }

        if (newUserFunction.length == "") {
            props.setIsLoading(false)
            props.handleAlertMessage("warning", "Insira uma função para o usuário.")

            return false;
        }

        return true
    }

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

        const isAdmin = newUserFunction === "Professor" || newUserFunction === "Secretário" || newUserFunction === "Administrador";

        // Faazendo a "apiCall":
        updateUser(props.selectedUser.id, { "name": newUserName, "email": newUserEmail, "type": newUserFunction, "isAdmin": isAdmin })
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                props.setIsLoading(false);
                props.handleAlertMessage("success", "Usuário alterado com sucesso.");
                setTimeout(() => { window.location.reload() }, 500);
            }
            // Se não der certo:
            else {
                props.setIsLoading(false);
                props.handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa editar o usuário.");
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
        setNewUserName(props.selectedUser.name);
        setNewUserEmail(props.selectedUser.email);
    }
    //
    
    return (
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
                onClick={props.goBackButton}
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
    )
}
