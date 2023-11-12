import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { useDispatch } from "react-redux";
import { reducerUserLogout } from "../../../redux/userRedux";
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,

};

export default function LogoutDialogue(props) {
  // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
  const [openAlert, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setOpenLogoutAlert(false);
  }
  //

  // Para deslogar:
  const dispatchLogout = useDispatch();
  const handleLogout = (e) => {
    dispatchLogout(reducerUserLogout());
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
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className=" flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ErrorOutlineOutlinedIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>

            <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
              <p className="text-sm text-gray-500 justify">
                Se prosseguir, você será direcionado(a) para o Login. Você realmente deseja sair da sua conta? 
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleLogout}
          >
            Sair
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
