import React, { useEffect, useState } from "react";

import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import MUIDataTable from "mui-datatables";
import { Box } from '@mui/material'; 

import { createTheme, ThemeProvider } from '@mui/material/styles';

import ProfileModal from '../modals/ProfileModal';
import DeleteDemandDialogue from "../dialogues/DeleteDemandDialogue";
import EditDemand from "../modals/EditDemand"

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

export default function DemandsTable(props) { 
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
        { name: 'id', label: 'ID', options: {filter: false} },
        { name: 'number', label: "Número"  , options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {      
            const demand = props.demands[tableMeta.rowIndex]
            var number = ""
            if (demand.number === null) {
                number = "Não Informado";
            } else {
                number = demand.number;
            };

            return (
                <p>
                  {number} 
                </p>
            ); }}},
        { name: 'date', label: 'Inserido', options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {      
                const demand = props.demands[tableMeta.rowIndex]
                const createdAtDate = new Date(demand.createdAt)
                const formattedDate = createdAtDate.toLocaleDateString("pt-BR");

                return (
                    <p>
                      {formattedDate} 
                    </p>
                );}
        } },
        { name: 'office', label: 'Escritório', options: {filter: false} },
        { name: 'subject', label: 'Assunto', options: {filter: false} },
        { name: 'status', label: 'Status', options: {filter: true} },
        { name: "Ações", 
        options: {
            filter: false,
            customBodyRender: (value, tableMeta, updateValue) => {
            return (
                <div className="flex w-full justify-between">
                    <button className="mx-1">
                        <RemoveRedEyeOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => seeDemand(tableMeta.rowData[0])} />
                    </button>

                    {user.isAdmin && (
                        <button className="mx-1">
                            <EditOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => updateDemand(tableMeta.rowData[0])} />
                        </button>
                    )}

                    {user.isAdmin && (
                        <button className="mx-1">
                            <DeleteOutlineOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => deleteDemand(tableMeta.rowData[0])} />
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

    // Demanda que é selecionada para alguma ação:
    const [selectedDemand, setSelectedDemand] = useState(false);
    //

    // Abrir o diálogo para excluir uma demanda:
    const [openDeleteDemandDialogue, setDeleteDemandDialogue] = useState(false);
    //

    // Abrir o modal para edição da demanda:
    const [openEditDemandModal, setEditDemandModal] = useState(false);
    //

    // Abrir o modal da demanda para ver as informações:
    const [openDemandModal, setDemandModal] = useState(false);
    //

    //Funções que são chamadas quando clicamos nos botões que estão na coluna "Ações" da tabela:
    const seeDemand = (demandId) => {
        setProfileModal(true)
        setSelectedDemand(props.demands.find(demand => demand.id === demandId));
    }

    const updateDemand = (demandId) => {
        const demandFound = props.demands.find(demand => demand.id === demandId);
        setSelectedDemand(demandFound)
        setEditDemandModal(true)
    }
    
    const deleteDemand = (demandId) => {
        const demandFound = props.demands.find(demand => demand.id === demandId);
        setSelectedDemand(demandFound)
        setDeleteDemandDialogue(true)
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
            data={props.demands}
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

        {openDeleteDemandDialogue && <DeleteDemandDialogue setDeleteDemandDialogue={setDeleteDemandDialogue} selectedDemand={selectedDemand}/>}
        {openEditDemandModal && <EditDemand setEditDemandModal={setEditDemandModal} selectedDemand={selectedDemand} />}
        {openDemandModal && <ProfileModal setDemandModal={setDemandModal} selectedDemand={selectedDemand} />}

    </Box>
    );
}
