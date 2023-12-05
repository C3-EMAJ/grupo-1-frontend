import React, { useEffect, useState } from "react";

import WestIcon from '@mui/icons-material/West';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import {useForm} from "react-hook-form"
import {number, z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod" // npm install @hookform/resolvers

import Select from "react-select";

import { getAllUsers } from "../data/axios/apiCalls";
import { updateClient } from '../data/axios/apiCalls';

const MAX_CPF_LENGTH = 14;
const MAX_PHONE_LENGTH = 16; 
const MAX_DATE_LENGTH = 10; 
const MAX_RG_LENGTH = 13; 

const schemaForma = z.object({
    information: z.object({
        name: z.string().min(2, "Por favor informe um nome válido"),
        cpf: z.string().min(14, "Por favor, informe um CPF válido"),
        rg: z.string().min(13, "Por favor, informe um RG."),
        birthday: z.string().min(10, "Por favor, informe sua data de nascimento."),
        phone: z.string()
                .min(MAX_PHONE_LENGTH, "Por favor, informe um telefone correto.")
                .optional().or(z.literal("")),
        phoneTwo: z.string()
            .min(MAX_PHONE_LENGTH, "Por favor, informe um telefone correto.")
            .optional().or(z.literal("")),
        email: z.string().optional(),
        familyIncome: z.string().min(1, "Por favor, informe sua renda familiar."),
        profession: z.string().min(1, "Por favor, informe sua profissaão."),
    }).transform(data => {
        return {
            ...data,
            cpf: data.cpf.replace(/\D/g, ''),
            rg: data.rg.replace(/\D/g, ''),
            birthday: data.birthday.replace(/\D/g, ''),
            phone: data.phone.replace(/\D/g, ''),
            phoneTwo: data.phoneTwo.replace(/\D/g, ''),
            email: data.email.replace(/\D/g, ''),
        }
    })
})

const cpfMask = (data) => {
    if (data === undefined) {return data}
    return data
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    // 976.199.000-00
}

const rgMask = (data) => {
    if (data === undefined || data === null ) {return data}
    return data
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    // 51.111.111-11
}

const dateMask = (data) => {
    if (data === undefined || data === null ) {return data}
    return data
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})\d+?$/, '$1')
    // 29/07/1980
}


const phoneMask = (data) => {
    if (data === undefined || data === null ) {return data}
    return data
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{1})(\d{4})(\d)/, '$1 $2-$3');
    // (53) 9 9873-3612
}

export default function EditClientForm(props) {
    const {handleSubmit, register, watch, formState: {errors}, setValue } = useForm({
        mode: "all", // validar antes de dar submit
        criteriaMode: "all", // Mostrar todos os erros de uma vez 
        resolver: zodResolver(schemaForma),
        defaultValues: {
            information: {
                name: props.selectedClient.name,
                cpf: cpfMask(props.selectedClient.cpf),
                rg: rgMask(props.selectedClient.rg),
                birthday: props.selectedClient.birthday,
                phone: (props.selectedClient.phone === null || props.selectedClient.phone === undefined) ? "" : props.selectedClient.phone,
                phoneTwo: (props.selectedClient.phoneTwo === null || props.selectedClient.phoneTwo === undefined) ? "" : props.selectedClient.phoneTwo,
                email: (props.selectedClient.email === null || props.selectedClient.email === undefined) ? "" : props.selectedClient.email,
                familyIncome: props.selectedClient.familyIncome,
                acquaintance: props.selectedClient.acquaintance,
                profession: props.selectedClient.profession,
            }
        }, // Schema que estou utilizando para validar
    })

    const cpf = watch("information.cpf")
    const rg = watch("information.rg")
    const date = watch("information.birthday")
    const phone = watch("information.phone")
    const phoneTwo = watch("information.phoneTwo")
    useEffect(() => {
        setValue("information.cpf", cpfMask(cpf))
        setValue("information.rg", rgMask(rg))
        setValue("information.birthday", dateMask(date))
        setValue("information.phone", phoneMask(phone))
        setValue("information.phoneTwo", phoneMask(phoneTwo))
    }, [cpf, rg, date, phone, phoneTwo])

    const [formErrors, setFormErrors] = useState({
        contact: "",
        representative: "",
        birthday: ""
    });

    const handleSubmitForm = () => {
        console.log(errors)
        if (errors.information === undefined) {
            const information = {
                name: watch("information.name"),
                cpf: watch("information.cpf").replace(/\D/g, ''),
                rg: watch("information.rg").replace(/\D/g, ''),
                birthday: watch("information.birthday"),
                phone: watch("information.phone").replace(/\D/g, ''),
                phoneTwo: watch("information.phoneTwo").replace(/\D/g, ''),
                email: watch("information.email"),
                familyIncome: watch("information.familyIncome"),
                acquaintance: watch("information.acquaintance"),
                profession: watch("information.profession"),
                dependents: dependents,
                representativeId: representative
            }
            const errors = {}
            const dateParts = information.birthday.split("/");
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // Mês é zero-indexed
            const year = parseInt(dateParts[2], 10);
            const birthDateObject = new Date(year, month, day);
            if (new Date().getFullYear() - year < 18) {
                if (information.representativeId === null || information.representativeId === undefined) {
                    errors.representative = "Campo obrigatório para menores de idade";
                }
            }
            const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (isNaN(birthDateObject.getTime()) || year < 1900 || year > new Date().getFullYear() || month < 0 || month > 11 || day < 1 || day > daysInMonth[month]){
                errors.birthday = "Data de Nascimento inválida";
            }
            if (!information.email && !information.phone) {
                errors.contact = "Preencha pelo menos um meio de contato (email, telefone)";
            }
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            } else {
                setFormErrors({
                    contact: "",
                    representative: "",
                    birthday: ""
                })
                // console.log(props.selectedClient)
                // console.log(data)
                props.setIsLoading(true);
                console.log(information)
                updateClient(props.selectedClient.id, "information", {information: information})
                .then(response => {
                    //Se der certo:
                    if (response.status == 200) {
                        props.setIsLoading(false);
                        props.handleAlertMessage("success", "Assistido alterado com sucesso.");
                        setTimeout(() => { window.location.reload() }, 500);
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
        }
    }


    const [formedArray, setFormedArray] = useState({})
    const [usersData, setUsers] = useState({});
    useEffect(() => {
        const req = getAllUsers();
        req.then(response => {
        if (response.status === 200) {
            const usersData = response.data;
            setUsers(usersData);
            var data = (response.data.map(user => {
                if (!user.isAdmin) {
                  return {
                    label: user.name,
                    value: user.id.toString()
                  };
                }
                return null;
              }).filter(Boolean));
            setFormedArray(data)
            // console.log(formedArray)
        }
        }).catch(error => {
            console.log(error)
        });
    }, [])

    useEffect(() => {
    }, [usersData])

    // const cpfExists = await checkExistingData('cpf', information.cpf);
    // const rgExists = await checkExistingData('rg', information.rg);

    // if (cpfExists) {
    //   errors.cpf = "CPF já cadastrado";
    // }

    // if (rgExists) {
    //   errors.rg = "RG já cadastrado";
    // }
    
    const [addDependents, setAddDependents] = useState(false);
    // Botão de "+ adicionar dependentes"
    const handleSetAddDependents = () => {
        setDependentsError(false)
        setAddDependents(!addDependents)
        setNewDependent({ name: '', age: '' });
    }
    
    const [dependents, setDependents] = useState(props.selectedClient.dependents === null || props.selectedClient.dependents === undefined ? [] : typeof props.selectedClient.dependents == "object" ? [props.selectedClient.dependents] : props.selectedClient.dependents);
    const [newDependent, setNewDependent] = useState({ name: '', age: '' });
    // console.log(dependents)

    const handleDependentsAgeChange = (e) => {
        e.preventDefault()
        setNewDependent((prevDependent) => ({ ...prevDependent, age: parseInt(e.target.value) }));
    };
  
    const handleDependentsNameChange = (e) => {
        e.preventDefault()
        setNewDependent((prevDependent) => ({ ...prevDependent, name: e.target.value }));
    };
    const [dependentsError, setDependentsError] = useState(false)
    // Adiciona o dependente a lista de dependente caso ele esteja valido
    const handleAddDependent = () => {
        if (newDependent.name.length < 3 || newDependent.age == "" || newDependent.age > 140 || newDependent.age < 0) {
            setDependentsError(true)
        } else {
            setDependentsError(false)
            // Cria um novo dependente na lista de dependentes
            setDependents((prevDependents) => [...prevDependents, newDependent]);
            setNewDependent({ name: '', age: '' });
        }
    };
    // Função para deletar os dependentes
    const deleteDependent = (index) => {
        const updatedDependents = dependents.filter((_, i) => i !== index);
        setDependents(updatedDependents);
    };

    const [representative, setRepresentative] = useState(props.selectedClient.representativeId)
    return (
    <>  
        {formErrors.contact && <p className="text-red-500">{formErrors.contact}</p>}
        <form onSubmit={handleSubmit(handleSubmitForm)} className="grid gap-4 mb-4 sm:grid-cols-2">            
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nome*
                </label>
                <input
                    type="text"
                    {...register("information.name")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
                {errors.information?.name && (
                    <p className="text-red-500 mt-2">{errors.information?.name?.message}</p>
                )}
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    RG*
                </label>
                <input
                    type="text"
                    {...register("information.rg")}
                    maxLength={MAX_RG_LENGTH}
                    className="formatted-input-rg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
                {errors.information?.rg && (
                    <p className="text-red-500 mt-2">{errors.information?.rg?.message}</p>
                )}
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Data de Nascimento*
                    {formErrors.birthday && <p className="text-red-500">{formErrors.birthday}</p>}
                </label>
                <input
                    type="text"
                    {...register("information.birthday")}
                    maxLength={MAX_DATE_LENGTH}
                    className="formatted-input-date bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
                {errors.information?.birthday && (
                    <p className="text-red-500 mt-2">{errors.information?.birthday?.message}</p>
                )}
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    CPF*                                        
                </label>
                <input
                    type="text"
                    {...register("information.cpf")}
                    maxLength={MAX_CPF_LENGTH}
                    className="formatted-input-cpf bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
                {errors.information?.cpf && (
                    <p className="text-red-500 mt-2">{errors.information?.cpf?.message}</p>
                )}
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Telefone*                                   
                </label>
                <input
                    type="text"
                    {...register("information.phone")}
                    maxLength={MAX_PHONE_LENGTH}
                    className="formatted-input-phone bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
                {errors.information?.phone && (
                    <p className="text-red-500 mt-2">{errors.information?.phone?.message}</p>
                )}
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Telefone 2                 
                </label>
                <input
                    type="text"
                    {...register("information.phoneTwo")}
                    maxLength={MAX_PHONE_LENGTH}
                    className="formatted-input-phone bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
                {errors.information?.phoneTwo && (
                    <p className="text-red-500 mt-2">{errors.information?.phoneTwo?.message}</p>
                )}
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    E-mail*
                </label>
                <input
                    type="email"
                    {...register("information.email")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
            </div>
            <span></span>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Profissão*
                </label>
                <input
                    type="text"
                    {...register("information.profession")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Renda Familiar*
                </label>
                <input
                    type="number"
                    {...register("information.familyIncome")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Representante
                    {formErrors.representative && <p className="text-red-500">{formErrors.representative}</p>}
                </label>
                <Select
                    options={formedArray}
                    onChange={opt => setRepresentative(opt.value)}
                />
            </div>
            <div>
                <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Conhecido
                </label>
                <input
                    type="text"
                    {...register("information.acquaintance")}	
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                />
            </div>
            <div>
                <div
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Dependentes
                    {dependentsError && <p className="text-red-500">Insira o nome e/ou a idade corretamente! </p>}
                </div>
                {addDependents && (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newDependent.name}
                            onChange={handleDependentsNameChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-2/4 p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                        />
                        <input
                            type="number"
                            value={newDependent.age}
                            onChange={handleDependentsAgeChange}
                            placeholder='Idade'
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-1/3 p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                        />
                        <div
                            style={{cursor:"pointer"}}
                            className="text-white inline-flex mt- items-center bg-yellow-600 hover:bg-yellow-400 w-2/9 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
                            onClick={handleAddDependent}
                        >
                            <AddIcon/>
                        </div>
                    </div>
                )}
                <div
                    onClick={handleSetAddDependents}
                    style={{cursor:"pointer", marginTop:"10px"}}
                    className="text-white inline-flex mt- items-center bg-yellow-600 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
                >
                    <AddIcon/>
                    Adicionar Dependentes
                </div>
            </div>
            {dependents.length > 0 ? (
                <div>
                    <div
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Seus de Dependentes
                    </div>
                    {dependents.map((dependent, index) => (
                        <div className="flex gap-2" key={index} style={{marginTop:"10px"}}>
                            <p
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-2/4 p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            >
                                {dependent.name}
                            </p> 
                            <p
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-1/3 p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            >
                                {dependent.age}
                            </p>
                            <div
                                style={{cursor:"pointer"}}
                                className="text-white inline-flex mt- items-center bg-yellow-600 hover:bg-yellow-400 w-2/9 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
                                onClick={() => deleteDependent(index)}
                            >
                                <DeleteIcon/>
                            </div>
                        </div>
                    ))}
                </div>
            ): (<span></span>)}
            <div className="mt-4 flex flex-row">
                <div 
                    onClick={props.goBackButton}
                    className="cursor-pointer flex items-center h-11 py-2 px-2 mr-3 text-sm font-medium text-center text-black border border-yellow-300 bg-white-400 hover:bg-yellow-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <WestIcon style={{marginRight: "5px", fontSize: "20px"}}/>
                    Voltar
                </div> 
                <button 
                    onClick={handleSubmitForm}
                    className="flex items-center h-11 py-2 px-2 text-sm font-medium text-center text-white text-white bg-yellow-500 border border-yellow-500 hover:bg-yellow-400 hover:border-yellow-400 focus:ring-4 focus:ring-gray-200 rounded-lg">
                        <EditOutlinedIcon style={{marginRight: "5px", fontSize: "22px"}}/>
                        Editar Assistido
                </button>     
            </div>
        </form>
    </>
    )
}
