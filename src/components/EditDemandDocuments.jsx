import React, { useEffect, useState } from "react";

import { uniqueId } from "lodash";
import { filesize } from "filesize";

import Dropzone from 'react-dropzone';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WestIcon from '@mui/icons-material/West';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

import { useSelector } from 'react-redux';

import CircularProgress from '@mui/material/CircularProgress';
import { addDemandDocument, updateUserImage } from "../data/axios/apiCalls";
import RemoveUserImageDialogue from "./dialogues/RemoveUserImageDialogue";
import RemoveDemandDocumentDialogue from "./dialogues/RemoveDemandDocumentDialogue";

export default function EditDemandDocuments(props) {
    const [isLoading, setIsLoading] = useState(false);

    // Documentos que pertencem a essa demanda:
    const [demandDocuments, setDemandDocuments] = useState(props.demandSelected.DemandDocuments);
    //

    // Documento para remover:
    const [documentToDelete, setdocumentToDelete] = useState(false);
    //

    // Dialogo para remover o documento da demanda:
    const [showRemoveDemandDocumentDialogue, setShowRemoveDemandDocumentDialogue] = useState(false);
    //

    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Documentos que serão carregados pelo usuário::
    const [uploadedDocument, setUploadedDocument] = useState(false);
    //

    // O que será mostrado para o usuário na parte do input:
    const renderDragMessage = (isDragActive, isDragReject) => {
        if (!isDragActive) {
            return (  
                <div className="flex flex-col items-center justify-center">
                    <CloudUploadOutlinedIcon style={{ fontSize: "1.8rem"}}/>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique aqui para fazer upload</span> ou arraste os novos documentos</p>
                    <p className="text-xs text-gray-500">.PDF</p>
                </div>
            );
        };
    
        if (isDragReject) {
            return (  
                <div className="flex flex-col text-red-500 items-center justify-center">
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "1.8rem"}}/>
                    <p className="text-sm font-semibold">Arraste apenas um arquivo .PDF</p>
                </div>
            );
        };
    
        return (
            <div className="flex flex-col text-green-500 items-center justify-center">
                <CheckCircleOutlineOutlinedIcon style={{ fontSize: "1.8rem"}}/>
                <p className="text-sm font-semibold">Solte o arquivo.</p>
            </div>
        );
    };
    //

    // Quando os documentos são inseridos pelo usuário, tratamos eles:
    const setDocuments = (files) => {

        console.log("entrei")
        if (files[0].size > 15000000) {
            props.handleAlertMessage("error", "Documento muito pesado (máximo 15 MB).")
        }

        const uploadedFiles = files.map(file => ({
            file,
            id: uniqueId(),
            name: file.name,
            readableSize: filesize(file.size),
        }));

        setUploadedDocument(uploadedFiles[0])
    }
    //

    // Remover o documento adicionado:
    const handleRemove = () => {
        setUploadedDocument(false);
    }
    //

    // Quando o botão "Carregar documentos" é clicado:
    const handleUploadImage = (e) => {
        e.preventDefault();
        if (uploadedDocument === false || uploadedDocument.length < 1) {
            props.handleAlertMessage("error", "Insira pelo menos um documento.")
            return false
        }
        setIsLoading(true);

        const data = new FormData();
        data.append("file", uploadedDocument.file, uploadedDocument.name);
    
        addDemandDocument(props.demandSelected.id, data)
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                setIsLoading(false);
                props.handleAlertMessage("success", "Documento deletado com sucesso.");
                props.setDemandSelected(false)
                props.setShowEditDocuments(false);

            }
            // Se não der certo:
            else {
                setIsLoading(false);
                props.handleAlertMessage("error", "Erro ao adicionar esse documento.");
                handleRemove()
            }
        })
        // Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            setIsLoading(false);
            props.handleAlertMessage("error", "Erro interno no servidor.");
            handleRemove()
        });

    };
    //

    // Quando o botão para remover um documento é clicado::
    const handleDeleteDocument = (file) => {
        setdocumentToDelete(file);
        setShowRemoveDemandDocumentDialogue(true);
        props.setBlur(true)
    };
    //
    
    return (
    <>
        <div className="bg-white max-h-100 scroll-stylized">

            <div className="mr-2">
                {demandDocuments.length > 0 && (
                    <>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Documentos dessa demanda
            </label>

            <div className="w-full align-center mb-8 max-h-40 p-1 block mb- border border-yellow-300 rounded-lg scroll-stylized">

                    <div className="grid grid-cols-3">
                    {demandDocuments.map((item, index) => (
                      <div key={index} className="inline-flex items-center mb-3 max-w-xs">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <div 
                            style={{ 
                              width: '160px',
                              height: '50px',
                              overflow: 'hidden',
                            }}
                            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            <ArticleOutlinedIcon style={{ marginRight: '4px'}} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                          </div>
                        </a>
                  
                        <button
                          style={{ 
                            width: '50px',
                            height: '50px',
                          }}
                          onClick={() => handleDeleteDocument(item)}
                          className="text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <DeleteOutlineOutlinedIcon />
                        </button>
                      </div>
                    ))}
                  </div>


            </div>
            </>
                )}
            </div>
            
            <div className="flex flex-col mr-2">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                    Adicionar novos documentos
                </label>
                {(uploadedDocument == false) ? (
                    <Dropzone accept={{'application/pdf': ['.pdf'],}} multiple={false} onDropAccepted={setDocuments}>
                    {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (  
                        <div
                            {...getRootProps()}
                            className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50
                                        ${(!isDragReject && !isDragActive) && "border-gray-300"} 
                                        ${isDragActive  && "border-green-600"} 
                                        ${isDragReject && "border-red-600"}`}
                        > 

                            {renderDragMessage(isDragActive, isDragReject)}
                            
                            <input {...getInputProps()} disabled={uploadedDocument !== false} />
                            
                        </div>
                    )}
                    </Dropzone>

                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg bg-gray-50">
                        <div className="flex items-center">

                            <InsertDriveFileOutlinedIcon style={{ fontSize: '40px', marginRight: '5px' }} />

                            <div className="flex flex-col">
                                <strong style={{ maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                {uploadedDocument.name}
                                </strong>
                                <span className="text-xs text-gray-500 mt-2">
                                {uploadedDocument.readableSize}
                                <button onClick={handleRemove} className="border-0 bg-transparent text-red-500 ml-1 cursor-pointer">
                                    Remover
                                </button>
                                </span>
                            </div>
                            </div>
                       
                    </div>
                )}
                
            </div>
        </div>

        <div className="mt-4 ml-2 flex flex-row">
            <button 
                onClick={props.goBackButton}
                className="flex items-center h-11 py-2 px-2 mr-3 text-sm font-medium text-center text-black border border-yellow-300 bg-white-400 hover:bg-yellow-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                <WestIcon style={{marginRight: "5px", fontSize: "20px"}}/>
                Voltar
            </button>

            <button 
                onClick={handleUploadImage}
                className="flex items-center h-11 py-2 px-2 text-sm font-medium text-center text-white text-white bg-yellow-500 border border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200 rounded-lg">
                    {(isLoading == false) ? (
                        <>
                        <FileUploadOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                        Carregar documento
                        </>
                    ) : (

                        <>
                        <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                        Carregar documento
                        </>
                    )}
                    
            </button>
             
        </div>
        {showRemoveDemandDocumentDialogue && <RemoveDemandDocumentDialogue
                                                setDemandSelected={props.setDemandSelected}
                                                demandSelected={props.demandSelected}
                                                goBackButton={props.goBackButton}
                                                setShowEditDocuments={props.setShowEditDocuments}
                                                setShowRemoveDemandDocumentDialogue={setShowRemoveDemandDocumentDialogue} 
                                                documentToDelete={documentToDelete}
                                                handleAlertMessage={props.handleAlertMessage}
                                                setIsLoading={props.setIsLoading}
                                                setBlur={props.setBlur}
                                            />}
    </>
    )
}
