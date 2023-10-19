import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import { useState } from 'react';

export default function AddUser(props) {
    // Informações do usuário:
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userFunction, setUserFunction] = useState("");
    //
    

    return(
    <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-75 flex items-center justify-center">
        <div className="relative w-full max-w-2xl md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Adicionar Usuário
                </h3>
                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover-bg-gray-600 dark:hover-text-white"
                    onClick={() => props.setOpenAddModal(false)}
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
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Email do usuário"
                    required
                />
              </div>
             
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Função
                </label>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <option>Selecione a função</option>
                    <option value="TV">Administrador</option>
                    <option value="GA">Professor</option>
                    <option value="PC">Advogado</option>
                    <option value="PH">Aluno</option>
                </select>
            </div>
            <div className="sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Foto
                </label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center">
                        <CloudUploadOutlinedIcon style={{ fontSize: "3rem"}}/>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Clique aqui para fazer upload</span> ou arraste a imagem</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">.PNG ou .JPG</p>
                        </div>
                        <input type="file" className="hidden" />
                    </label>
                </div>
            </div>
            </div>
            <button
                type="submit"
                className="text-white inline-flex items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
            >
                <AddIcon/>
                Adicionar Usuário
            </button>
        </form>
        </div>
      </div>
    </div>    

    );
}