import React, { useEffect, useState } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import ActivityLog from "../ActivityLog";
import { getUser } from "../../data/axios/apiCalls";

import moment from "moment";
import 'moment/dist/locale/pt-br'
moment.locale('pt-br');

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '100%',
};

export default function ProfileModal(props) {
    // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setProfileModal(false);
    }
    //

    // Pegar o "log" de atividades do usuário:
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        const req = getUser(props.selectedUser.id);
        req.then(response => {
            if (response.status === 200) {
               setActivities(response.data.UserActivities);
            }
        }).catch(err => {
            console.log(err);
        });
    }, []);
    //
    
    return(
        <Modal
            open={openAlert}
            onClose={handleClose}
        >
        <Box className="scroll-stylized" sx={style}>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8  overflow-auto scroll-stylized">
            <div className="mt-2 mb-2 bg-white p-8">
                <div className="flex mb-8 items-center justify-between pb-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Perfil de Usuário
                    </h3>

                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover-bg-gray-600 dark:hover-text-white"
                        onClick={handleClose}
                    >
                        <CloseOutlinedIcon/>
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-xl pb-8">
                    <div className="flex flex-col items-center">
                        <img
                            src={props.selectedUser.UserImage.url || "https://i.imgur.com/oYEFKb1.png"}                        className="w-40 border-4 border-white rounded-full"
                            alt="Profile"
                        />
                        <div className="flex items-center space-x-2 mt-2">
                            <p className="text-2xl">{props.selectedUser.name}</p>
                        </div>
                        <p className="text-gray-600 mb-3">{props.selectedUser.type}</p>
                        <p className="text-sm text-gray-500">{props.selectedUser.email}</p>
                    </div>
                </div>

                

                <div className="my-4 justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <h4 className="text-xl mb-2 text-gray-900 font-bold">Registro de Atividades</h4>
                        <div className="relative px-4 max-h-40 overflow-auto scroll-stylized">
                        {activities.reverse().map((item, index) => (
                            <div key={index}>
                                <div className="absolute h-20 border border-dashed border-opacity-20 border-secondary"></div>
                                <ActivityLog action={item.action} changeTime={moment(item.createdAt).fromNow()} />
                            </div>
                            ))}
                                <ActivityLog action="Conta criada" changeTime={moment(props.selectedUser.createdAt).fromNow()} />
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </Box>      
      </Modal>
    );
}