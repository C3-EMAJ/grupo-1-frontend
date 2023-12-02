import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MUIDataTable from "mui-datatables";
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import { Avatar, Box, Typography } from '@mui/material'; 

import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import DeactivateClientDialogue from '../dialogues/DeactivateClientDialogue';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function ClientTable(props) {
    // Personalizando o estilo da tabela:
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

    const user = useSelector((state) => state.user.currentUser);
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
        { name: 'birthday', label: 'Data de nascimento', options: {filter: false} },
        { name: "Ações", 
        options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <div className="flex w-full justify-between">


                    <button className="mx-1">
                        <EditOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => updateClient(tableMeta.rowData[0])} />
                    </button>

                    <button className="mx-1">
                        <BedtimeOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => deactivateClient(tableMeta.rowData[0])} />
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

    // Assistido que é selecionado para alguma ação (editar ou excluir):
    const [selectedClient, setSelectedClient] = useState(false);
    //

    // Abrir o diálogo para excluir um assistido:
    const [openDeactivateClientDialogue, setDeactivateClientDialogue] = useState(false);

    //Funções que são chamadas quando clicamos nos botões que estão na coluna "Ações" da tabela:

    const updateClient = (clientId) => {
        console.log(clientId)
    }
    
    const deactivateClient = (clientId) => {
        const clientFound = props.clients.find(client => client.id === clientId)
        if (user.type !== "Aluno") {
            setSelectedClient(clientFound)
            setDeactivateClientDialogue(true)
        } else {
            handleAlertMessage("error", "Você não tem permissão para desativar esse assistido.")
            return false
        }
        // setDeleteClientDialogue(true)
        // setSelectedClient(props.clients.find(client => client.id === clientId))
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
                data={props.clients}
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

        {openDeactivateClientDialogue && <DeactivateClientDialogue setDeactivateClientDialogue={setDeactivateClientDialogue} selectedClient={selectedClient} />}
        
    </Box>
    );
}
