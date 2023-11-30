import React, { useEffect, useState } from "react";

import { filesize } from "filesize";

import Dropzone from 'react-dropzone';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WestIcon from '@mui/icons-material/West';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import { useSelector } from 'react-redux';

import CircularProgress from '@mui/material/CircularProgress';
import { updateUserImage } from "../data/axios/apiCalls";
import RemoveUserImageDialogue from "./dialogues/RemoveUserImageDialogue";

export default function EditUserImage(props) {
    const [isLoading, setIsLoading] = useState(false);

    // Pegando o usuário logado, para pegar as informações:
    const user = useSelector((state) => state.user.currentUser);
    //

    // Imagem que será carregada pelo usuário::
    const [uploadedImage, setUploadedImage] = useState(false);
    //

    // Imagem que será mostrada ao lado do input:
    const [imageDisplayed, setImageDisplayed] = useState(props.selectedUser.UserImage.url);
    //

    // Dialogo para remover imagem do usuário:
    const [showRemoveUserImageDialogue, setShowRemoveUserImageDialogue] = useState(false);
    //

    // O que será mostrado para o usuário na parte do input:
    const renderDragMessage = (isDragActive, isDragReject) => {
        if (!isDragActive) {
            return (  
                <div className="flex flex-col items-center justify-center">
                    <CloudUploadOutlinedIcon style={{ fontSize: "1.8rem"}}/>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique aqui para fazer upload</span> ou arraste a nova imagem</p>
                    <p className="text-xs text-gray-500">.PNG</p>
                </div>
            );
        };
    
        if (isDragReject) {
            return (  
                <div className="flex flex-col text-red-500 items-center justify-center">
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "1.8rem"}}/>
                    <p className="text-sm font-semibold">Arraste apenas um único arquivo .PNG</p>
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

    // Quando a imagem é inserida pelo usuário, tratamos ela (mudando o nome, mudando o size e adicionando preview)::
    const setImage = (files) => {
        if (files[0].size > 5000000) {
            props.handleAlertMessage("error", "Imagem muito pesada (máximo 5 MB).")
        }

        var nameUser = props.selectedUser.name.split(" ")

        const uploadedFiles = files.map(file => ({
            file,
            id: 1,
            name: props.selectedUser.id + "-" + nameUser[0] + ".png",
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
        }));

        setUploadedImage(uploadedFiles[0])
    }
    //

    // Remover a imagem adicionada:
    const handleRemove = () => {
        setUploadedImage(false)
    }
    //

    // Quando o botão "Carregar nova imagem" é clicado:
    const handleUploadImage = (e) => {
        e.preventDefault();
        if (uploadedImage == false) {
            props.handleAlertMessage("error", "Insira uma imagem.")
            return false
        }

        setIsLoading(true);

        const data = new FormData();
        data.append("file", uploadedImage.file, uploadedImage.name);

        updateUserImage(props.selectedUser.id, data)
        .then(response => {
            // Se der certo:
            if (response.status == 200) {
                setIsLoading(false);
                props.handleAlertMessage("success", "Imagem alterada com sucesso.");
                setImageDisplayed(uploadedImage.preview);
                setUploadedImage(false);
                setTimeout(() => { window.location.reload() }, 500);
            }
            // Se não der certo:
            else {
                setIsLoading(false);
                setUploadedImage(false);
                props.handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa editar a imagem do usuário.");
            }
        })
        // Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            setIsLoading(false);
            setUploadedImage(false);
            props.handleAlertMessage("error", "Erro interno no servidor, tente novamente mais tarde.");
        });

    };
    //

    // Quando o botão "Remover imagem atual" é clicado::
    const handleDeleteImage = (e) => {
        e.preventDefault();
        
        props.setBlur(true)
        setShowRemoveUserImageDialogue(true);
    };
    //
    
    return (
    <>
        <div className="bg-white rounded-lg">

            <div className="flex">
                <div className="flex-none">
                    <label className="flex flex-col h-36 items-center justify-center h-32 w-32 rounded-lg cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                            <img
                            src={imageDisplayed} className="w-28 h-28 border-4 border-white rounded-full"
                            alt="Profile"
                            />
                        </div>
                        <input type="file" className="hidden" />
                    </label>
                    
                </div>
                <div className="flex-1 ...">
                
                <div className="flex items-center justify-center">
                    {(uploadedImage == false) ? (

                        <Dropzone accept={{'image/png': ['.png'],}} multiple={false} onDropAccepted={setImage}>
                        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (  
                            <div
                                {...getRootProps()}
                                className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50
                                            ${(!isDragReject && !isDragActive) && "border-gray-300"} 
                                            ${isDragActive  && "border-green-600"} 
                                            ${isDragReject && "border-red-600"}`}
                            > 

                                {renderDragMessage(isDragActive, isDragReject)}
                                
                                <input {...getInputProps()} disabled={uploadedImage !== false} />
                                
                            </div>
                        )}
                        </Dropzone>

                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50">
                        <div className="flex items-center">
                            <img
                                className="w-12 mr-3 cover h-12 rounded-lg"
                                src={uploadedImage.preview}
                                
                            />
                            <div className="flex flex-col">
                            <strong>{uploadedImage.name}</strong>
                            <span className="text-xs text-gray-500 mt-2">
                                {uploadedImage.readableSize}
                                <button onClick={handleRemove} className="border-0 bg-transparent text-red-500 ml-1 cursor-pointer">Excluir</button>
                            </span>
                            </div>
                        </div>
                        </div>
                    )}
                    
                </div>
                </div>
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
                        Carregar nova imagem
                        </>
                    ) : (

                        <>
                        <CircularProgress size={20} style={{marginRight: "10px", fontSize: "2px"}} color="secondary" />
                        Carregar nova imagem
                        </>
                    )}
                    
            </button>

            {(props.selectedUser.UserImage.url !== "https://i.imgur.com/oYEFKb1.png" && uploadedImage == false) ? (
                <button 
                onClick={handleDeleteImage}
                className="flex items-center h-11 py-2 px-2 ml-3 text-sm font-medium text-center text-red-700 bg-white rounded-lg border-2 border-red-700 hover:bg-red-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300">
                    <DeleteOutlineOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                    Remover imagem atual
                </button> 
            ) : (
                <button
                disabled 
                className="flex items-center h-11 py-2 px-2 ml-3 text-sm font-medium text-center text-gray-400 bg-gray-100 rounded-lg border-2 border-gray-400">
                    <DeleteOutlineOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                    Remover imagem atual
                </button> 
            )}
             
        </div>
        {showRemoveUserImageDialogue && <RemoveUserImageDialogue  
                                            setShowRemoveUserImageDialogue={setShowRemoveUserImageDialogue} 
                                            selectedUser={props.selectedUser} 
                                            handleAlertMessage={props.handleAlertMessage}
                                            setImageDisplayed={setImageDisplayed}
                                            setIsLoading={props.setIsLoading}
                                            setBlur={props.setBlur}
                                            />}
    </>
    )
}
