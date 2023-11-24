import { useEffect, useState } from 'react';

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MUIDataTable from "mui-datatables";
import { Avatar, Box, Typography } from '@mui/material'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ProfileModal from '../modals/ProfileModal';
import DeleteUserDialogue from '../dialogues/DeleteUserDialogue';
import ActivateUserDialogue from '../dialogues/ActivateUserDialogue';

import { useSelector } from 'react-redux';

export default function DisabledUsersTable(props) { 
    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
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
                const user = props.disabledUsers[tableMeta.rowIndex]; // Acesse o objeto de usuário com base no índice da linha
                return (
                    <img
                        className="object-cover w-8 h-8 rounded-full"
                        src={user.img || "https://i.imgur.com/oYEFKb1.png"}
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

                    {(user.isAdmin && user.type == "Administrador") && (
                        <button className="mx-1">
                            <DeleteOutlineOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => deleteUser(tableMeta.rowData[0])} />
                        </button>
                    )}
                    
                    <button className="mx-1">
                        <RemoveRedEyeOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => seeUser(tableMeta.rowData[0])} />
                    </button>

                    <button className="mx-1">
                        <CloudSyncOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => activateUser(tableMeta.rowData[0])} />
                    </button>

              
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
    const [openDeleteUserDialogue, setDeleteUserDialogue] = useState(false);
    //

    // Abrir o diálogo para reativar um usuário:
    const [openActivateUserDialogue, setActivateUserDialogue] = useState(false);
    //

    // Abrir o perfil do usuário:
    const [openProfileModal, setProfileModal] = useState(false);
    //

    //Funções que são chamadas quando clicamos nos botões que estão na coluna "Ações" da tabela:
    const seeUser = (userId) => {
        setProfileModal(true)
        setSelectedUser(props.disabledUsers.find(user => user.id === userId))
    }
    
    const deleteUser = (userId) => {
        setDeleteUserDialogue(true)
        setSelectedUser(props.disabledUsers.find(user => user.id === userId))
    }

    const activateUser = (userId) => {
        setActivateUserDialogue(true)
        setSelectedUser(props.disabledUsers.find(user => user.id === userId))
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
            data={props.disabledUsers}
            options={options}
            />
            
        </ThemeProvider>

        {openActivateUserDialogue && <ActivateUserDialogue setDeleteUserDialogue={setDeleteUserDialogue} selectedUser={selectedUser} />}
        {openDeleteUserDialogue && <DeleteUserDialogue setDeleteUserDialogue={setDeleteUserDialogue} selectedUser={selectedUser} />}
        {openProfileModal && <ProfileModal setProfileModal={setProfileModal} selectedUser={selectedUser} />}

    </Box>
    );
}
