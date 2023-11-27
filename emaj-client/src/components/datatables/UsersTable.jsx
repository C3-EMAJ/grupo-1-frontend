import React, { useEffect, useState } from "react";

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';

import MUIDataTable from "mui-datatables";
import { Box } from '@mui/material'; 

import { createTheme, ThemeProvider } from '@mui/material/styles';

import ProfileModal from '../modals/ProfileModal';
import DeactivateUserDialogue from '../dialogues/DeactivateUserDialogue';
import EditUser from '../modals/EditUser';

import { useSelector } from 'react-redux';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function UsersTable(props) { 
    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
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

    // Personalizando o estilo da tabela:
    const tableTheme = createTheme({
        palette: {
            primary:{
              main:'#FDAE17',
            }
        },
        overrides: {
            MUIDataTable: {
                paper: {
                    height: 'inherit',
                },
                responsiveScroll: {
                    maxHeight: 'none',
                    height: 'calc(100% - 128px)'
                }
            },
        },
        components: {
            MUIDataTable: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        borderRadius: '0px',
                        border: '1px solid #e2e2e2',
                        borderBottom: 'none',
                        boxShadowBottom: 'none',
                    },
                },
            },
        },
    });
    //

    // Criando as colunas da tabela (informando o que cada coluna irá pegar do "user"):
    const columns = [
        { name: 'id', label: "ID"  , options: {filter: false} },
        { name: 'img', label: 'Foto', options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {      
                const user = props.users[tableMeta.rowIndex]
                return (
                    <img
                        className="object-cover w-8 h-8 rounded-full"
                        src={user.UserImage.url}
                    />
                );}
        } },
        { name: 'name', label: 'Nome', options: {filter: false} },
        { name: 'email', label: 'E-mail', options: {filter: false} },
        { name: 'type', label: 'Função', options: {filter: true} },
        { name: "Ações", 
        options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <div className="flex w-full justify-between">
                    <button className="mx-1">
                        <RemoveRedEyeOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => seeUser(tableMeta.rowData[0])} />
                    </button>

                    {user.isAdmin && (
                        <button className="mx-1">
                            <EditOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => updateUser(tableMeta.rowData[0])} />
                        </button>
                    )}

                    {user.isAdmin && (
                        <button className="mx-1">
                            <BedtimeOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => deactivateUser(tableMeta.rowData[0])} />
                        </button>
                    )}
                </div>
            );}
        }
        }
    ];
    //

    // Definindo as opções da minha tabela:
    const options = {
        filter: true,
        filterType: "dropdown",
        selectableRows: "none",
        responsive: "vertical"
        
    };
    //

    // Usuário que é selecionado para alguma ação (editar ou excluir):
    const [selectedUser, setSelectedUser] = useState(false);
    //

    // Abrir o diálogo para excluir um usuário:
    const [openDeactivateUserDialogue, setDeactivateUserDialogue] = useState(false);
    //

    // Abrir o modal para ediçaõ do usuário:
    const [openEditUserModal, setEditUserModal] = useState(false);
    //

    // Abrir o perfil do usuário:
    const [openProfileModal, setProfileModal] = useState(false);
    //

    //Funções que são chamadas quando clicamos nos botões que estão na coluna "Ações" da tabela:
    const seeUser = (userId) => {
        setProfileModal(true)
        setSelectedUser(props.users.find(user => user.id === userId))
    }

    const updateUser = (userId) => {
        const userFound = props.users.find(user => user.id === userId);

        // Não deixando alterar as informações do primeiro usuário e não deixando alterar as próprias informações:
        if (userFound.id == 1 && user.id != 1) {
            handleAlertMessage("warning", "Você não pode editar essa conta.")
            return false
        } else if (user.id == userFound.id) {
            handleAlertMessage("warning", "Altere suas informações através da página do seu perfil.")
            return false
        }
        //

        // Definindo "níveis de permissão":
        if (user.type == "Administrador") {
            setSelectedUser(userFound)
            setEditUserModal(true)
        } else if (user.type == "Professor" && userFound.type != "Administrador") {
            setSelectedUser(userFound)
            setEditUserModal(true)
        } else if (user.type == "Secretário" && (userFound.type != "Administrador" && userFound.type != "Professor" )) {
            setSelectedUser(userFound)
            setEditUserModal(true)
        } else {
            handleAlertMessage("error", "Você não tem permissão para alterar as informações deste usuário.")
            return false
        }
        //
    }
    
    const deactivateUser = (userId) => {
        const userFound = props.users.find(user => user.id === userId);

        // Não deixando desativar o primeiro usuário e desativar o próprio perfil:
        if (user.userFound == 1) {
            handleAlertMessage("warning", "Essa conta não pode ser desativada.")
            return false
        } else if (user.id == userFound.id) {
            handleAlertMessage("warning", "Desative sua conta através da página do seu perfil.")
            return false
        }
        //

        // Definindo "níveis de permissão":
        if (user.type == "Administrador") {
            setSelectedUser(userFound)
            setDeactivateUserDialogue(true)
        } else if (user.type == "Professor" && userFound.type != "Administrador") {
            setSelectedUser(userFound)
            setDeactivateUserDialogue(true)
        } else if (user.type == "Secretário" && (userFound.type != "Administrador" && userFound.type != "Professor" )) {
            setSelectedUser(userFound)
            setDeactivateUserDialogue(true)
        } else {
            handleAlertMessage("error", "Você não tem permissão para desativar esse usuário.")
            return false
        }
        //
    }
    //

    return (
        <Box
        sx={{
          height: '90%',
          width: '100%',
          borderColor: 'none',
        }}
      >
        
        <ThemeProvider theme={tableTheme}>
                        
            <MUIDataTable className="border-none shadow-none"
            columns={columns}
            data={props.users}
            options={options}
            />
            
        </ThemeProvider>

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

        {openDeactivateUserDialogue && <DeactivateUserDialogue setDeactivateUserDialogue={setDeactivateUserDialogue} selectedUser={selectedUser} handleAlert={handleAlertMessage}/>}
        {openEditUserModal && <EditUser setEditUserModal={setEditUserModal} selectedUser={selectedUser} />}
        {openProfileModal && <ProfileModal setProfileModal={setProfileModal} selectedUser={selectedUser} />}

    </Box>
    );
}
