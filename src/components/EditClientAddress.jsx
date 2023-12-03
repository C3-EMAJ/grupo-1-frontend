import React, { useCallback, useEffect, useState } from "react";

import {useForm} from "react-hook-form"
import {number, z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod" // npm install @hookform/resolvers

import WestIcon from '@mui/icons-material/West';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { updateClient } from '../data/axios/apiCalls';

const schemaForma = z.object({
    address: z.object({
        cep: z.string().min(9, "Por favor, informe um cep válido"),
        street: z.string().min(1, "Por favor, informe uma rua válida"),
        number: z.string().min(1, "Por favor, informe um número válido"),
        complement: z.string()
    }).transform(data => {
        return {
            ...data,
            cep: data.cep.replace(/-/g, ""),
            number: parseInt(data.number)
        }
    })
})

const zipCodeMask = (zipCode) => {
    return zipCode.replace(/^(\d{5})(\d{3})$/, "$1-$2")
}

export default function EditClientAddress(props) {
    const {handleSubmit, register, watch, formState: {errors}, setValue } = useForm({
        mode: "all", // validar antes de dar submit
        criteriaMode: "all", // Mostrar todos os erros de uma vez 
        resolver: zodResolver(schemaForma),
        defaultValues: {
            address: {
                cep: props.selectedClient.cep,
                complement: props.selectedClient.complement,
                number: (props.selectedClient.number).toString(),
                street: props.selectedClient.street
            }
        }, // Schema que estou utilizadno para validar
    })

    const cep = watch("address.cep")
    useEffect(() => {
        setValue("address.cep", zipCodeMask(cep))
        if(cep != undefined && cep.length != 9) return;
    }, [cep])
    
    const handleSubmitForm = (data) => {
        if (props.isLoading) {
            return false;
        }
        // console.log(props.selectedClient)
        // console.log(data)
        props.setIsLoading(true);
        updateClient(props.selectedClient.id, "address", data)
        .then(response => {
            //Se der certo:
            if (response.status == 200) {
                props.setIsLoading(false);
                props.handleAlertMessage("success", "Assistido alterado com sucesso.");
            }
            //Se não der certo:
            else {
                props.setIsLoading(false);
                props.handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa editar o assistido.");
            }
        })
        //Se ocorrer um erro na comunicação com a API:
        .catch(error => {
            props.setIsLoading(false);
            props.handleAlertMessage("error", "Erro interno no servidor, tente novamente mais tarde.");
        });
    }
     
    return (
    <>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    CEP
                </label>
                <input
                    {...register("address.cep")}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                    placeholder="CEP"
                    maxLength={9}
                />
                {errors.address?.cep && (
                    <p>{errors.address?.cep?.message}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Rua
                </label>
                <input
                    {...register("address.street")}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                    placeholder="Nome da Rua"
                />
                {errors.address?.street && (
                    <p>{errors.address?.street?.message}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Número
                </label>
                <input
                    {...register("address.number")}
                    type="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                    placeholder="Número"
                />
                {errors.address?.number && (
                    <p>{errors.address?.number?.message}</p>
                )}
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Complemento
                </label>
                <input
                    {...register("address.complement")}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                    placeholder="Complemento"
                />
                {errors.address?.complement && (
                    <p>{errors.address?.complement?.message}</p>
                )}
            </div>
            <div className="mt-4 flex flex-row">
                <div 
                    onClick={props.goBackButton}
                    className="cursor-pointer flex items-center h-11 py-2 px-2 mr-3 text-sm font-medium text-center text-black border border-yellow-300 bg-white-400 hover:bg-yellow-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <WestIcon style={{marginRight: "5px", fontSize: "20px"}}/>
                    Voltar
                </div> 
                <button 
                    type="submit"
                    className="flex items-center h-11 py-2 px-2 text-sm font-medium text-center text-white text-white bg-yellow-500 border border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200 rounded-lg">
                        <EditOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                        Editar Assistido
                </button>     
            </div>
        </form>
    </>
    )
}
