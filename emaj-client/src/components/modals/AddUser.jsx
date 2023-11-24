import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
  
  };

export default function AddUser(props) {
    // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setOpenAddModal(false);
    }
    //

    // Informações do usuário:
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    
    const [userFunction, setUserFunction] = useState("");
    const getSelectedValue = (e) => {
      setUserFunction(e.target.value);
    }
    //
    
    return(
        <Modal
            open={openAlert}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
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
                    id="name"
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
                    type="text"
                    name="name"
                    id="name"
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
                    <option>Aluno</option>
                    <option>Administrador</option>
                    <option>Professor</option>
                    <option>Advogado</option>
                </select>
            </div>

            </div>
            <button
                type="submit"
                className="text-white inline-flex mt- items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
            >
                <AddIcon/>
                Adicionar Usuário
            </button>
        </form>
        </div>
      </div>
        </Box>      
      </Modal>
    );
}