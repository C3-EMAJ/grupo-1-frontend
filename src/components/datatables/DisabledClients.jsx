import { useEffect, useState } from 'react';

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MUIDataTable from "mui-datatables";
import { Avatar, Box, Typography } from '@mui/material'; 
import { createTheme, ThemeProvider } from '@mui/material/styles';

import DeleteClientDialogue from '../dialogues/DeleteClientDialogue';
import ActivateClientDialogue from '../dialogues/ActivateClientDialogue';

import { useSelector } from 'react-redux';

export default function DisabledClientsTable(props) { 
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
        { name: 'name', label: 'Nome', options: {filter: false} },
        { name: 'email', label: 'E-mail', options: {filter: false} },
        { name: 'phone', label: 'Telefone', options: {filter: false} },
        { name: 'cpf', label: 'CPF', options: {filter: false} },
        { name: 'birthday', label: 'DATA DE NASCIMENTO', options: {filter: false} },
        { name: "Ações", 
        options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <div className="flex w-full justify-between">

                    {(user.isAdmin) && (
                        <button className="mx-1">
                            <DeleteOutlineOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => deleteClient(tableMeta.rowData[0])} />
                        </button>
                    )}

                    <button className="mx-1">
                        <CloudSyncOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => activateClient(tableMeta.rowData[0])} />
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
    useEffect(()=> {
        props.disabledClients
    })

    // Usuário que é selecionado para alguma ação (editar ou excluir):
    const [selectedClient, setSelectedClient] = useState(false);
    //

    // Abrir o diálogo para excluir um usuário:
    const [openDeleteClientDialogue, setDeleteClientDialogue] = useState(false);
    //

    // Abrir o diálogo para reativar um usuário:
    const [openActivateClientDialogue, setActivateClientDialogue] = useState(false);
    //

    const deleteClient = (clientId) => {
        setDeleteClientDialogue(true)
        setSelectedClient(props.disabledClients.find(client => client.id === clientId))
    }

    const activateClient = (clientId) => {
        setActivateClientDialogue(true)
        setSelectedClient(props.disabledClients.find(client => client.id === clientId))
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
            data={props.disabledClients}
            options={options}
            />
            
        </ThemeProvider>

        {openActivateClientDialogue && <ActivateClientDialogue setActivateClientDialogue={setActivateClientDialogue} selectedClient={selectedClient} />}
        {openDeleteClientDialogue && <DeleteClientDialogue 
                                                        setDeleteClientDialogue={setDeleteClientDialogue} 
                                                        selectedClient={selectedClient} 
                                                    />}

    </Box>
    );
}
