import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MUIDataTable from "mui-datatables";
import { Avatar, Box, Typography } from '@mui/material'; 

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';


export default function UsersTable(props) {
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
                const user = props.users[tableMeta.rowIndex]; // Acesse o objeto de usuário com base no índice da linha
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
                    <button className="mx-1">
                        <RemoveRedEyeOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => seeUser(tableMeta.rowData)} />
                    </button>

                    <button className="mx-1">
                        <EditOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => updateUser(tableMeta.rowData)} />
                    </button>

                    <button className="mx-1">
                        <DeleteOutlineOutlinedIcon style={{ color: "#FDAE17" }} onClick={() => deleteUser(tableMeta.rowData)} />
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

    //Funções que são chamadas quando clicamos nos botões que estão na coluna "Ações" da tabela:
    const seeUser = (userData) => {
        console.log(userData)
    }

    const updateUser = (userData) => {
        console.log(userData)
    }
    
    const deleteUser = (userData) => {
        console.log(userData)
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

    </Box>
    );
}
