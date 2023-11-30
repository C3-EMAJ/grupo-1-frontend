import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,

};

export default function DeleteClientDialogue(props) {
  // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
  const [openAlert, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setDeleteClientDialogue(false);
  }
  //

  // Para apagar o assistido:
  const handleDeleteClient = (e) => {
    console.log("oi")
  }
  //

  return (
    <Modal
      open={openAlert}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="bg-white sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between pb-4 border-b rounded-t dark:border-gray-600">
                

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Exclusão de Assitido
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
                        Você deseja excluir o usuário <span style={{ color: 'red', fontWeight: '700' }}>{props.selectedUser.name}</span>? Ao excluir você irá apagar permanentemente os registros dele(a).
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-gray-50 py-4 px-4 text-center sm:flex sm:flex-row-reverse">
            <button
                type="button"
                className="inline-flex rounded-md bg-red-600 px-3 ml-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                onClick={handleDeleteClient}
            >
                Excluir Assistido
            </button>
        </div>
      </div>
      </Box>      
    </Modal>
  )
}
