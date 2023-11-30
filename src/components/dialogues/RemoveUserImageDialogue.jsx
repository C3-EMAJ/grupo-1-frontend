import { useState } from 'react';

import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { deleteUserImage } from '../../data/axios/apiCalls';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
};

export default function RemoveUserImageDialogue(props) {
  // Para fechar o modal e mudar o estado do showRemoveUserImageDialogue:
  const [openAlert, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setBlur(false);
    props.setShowRemoveUserImageDialogue(false);
  }
  //

  // Para excluir a imagem do usuário:
  const handleDeleteUserImage = (e) => {
    e.preventDefault();

    deleteUserImage(props.selectedUser.id)
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                props.setImageDisplayed("https://i.imgur.com/oYEFKb1.png")

                props.setIsLoading(false);
                props.handleAlertMessage("success", "Imagem deletada com sucesso.");
                handleClose();
                setTimeout(() => { window.location.reload() }, 500);
            }
            else {
                props.setIsLoading(false);
                props.handleAlertMessage("error", "Erro ao deletar a imagem.");
                setTimeout(() => { window.location.reload() }, 500);
            }
        }).catch(error => {
            setIsLoading(false);
            handleAlertMessage("error", "Aconteceu um erro no processo, tente novamente mais tarde.");
            setTimeout(() => { window.location.reload() }, 500);
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
      <Box sx={style} >
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4 border-b rounded-t dark:border-gray-600">
                

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Excluir Imagem
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
                        Você deseja excluir a foto do <span style={{ color: 'red', fontWeight: '700' }}>{props.selectedUser.name}</span>? Ao excluir você irá apagar permanentemente essa imagem.
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-gray-50 py-4 px-4 text-center sm:flex sm:flex-row-reverse">
            <button
                type="button"
                className="inline-flex rounded-md bg-red-600 px-3 ml-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                onClick={handleDeleteUserImage}
            >
                Excluir Imagem
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
    </Modal>
  )
}
