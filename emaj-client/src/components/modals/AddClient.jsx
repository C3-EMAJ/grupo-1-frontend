import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { addNewClient } from '../../data/axios/apiCalls';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { getAllUsers } from "../../data/axios/apiCalls";
import Select from "react-select";
import { useEffect, useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DeleteIcon from '@mui/icons-material/Delete';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
  };

export default function AddClient(props) {
    // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
    const [formData, setFormData] = useState({
        name: "",
        representative: "",
        rg: "",
        birthDate: "",
        cpf: "",
        firstCellphone: "",
        secondCellphone: "",
        profession: "",
        familyIncome: "",
        address: "",
        dependents: "",
        email: "",
        familiar: "",
    });

    const [usersData, setUsers] = useState({});

    const [formErrors, setFormErrors] = useState({representative: ""});
    const [loading, setLoading] = useState(false);

    const [openAlert, setOpen] = useState(true);
    
    const handleClose = () => {
        setFormData({
            name: "",
            representative: "",
            rg: "",
            birthDate: "",
            cpf: "",
            firstCellphone: "",
            secondCellphone: "",
            profession: "",
            familyIncome: "",
            email: "",
            familiar: "",
            cep: "",
            street: "",
            number: "",
            complement: ""
        });
        setOpen(false);
        props.setOpenAddModal(false);
    }
    const handleSubmit = async (e) => {
        // Validation logic
        e.preventDefault();
        formData.representative = representativeState
        formData.dependents = dependents
        console.log(formData)
        const errors = {}
        if (!formData.firstCellphone && !formData.email) {
            errors.contact = "Preencha pelo menos um meio de contato (telefone ou e-mail)";
        }
        if (formData.cpf.length !== 11) {
            errors.cpf = "CPF deve conter 11 dígitos";
        } 
        
        if (formData.rg.length !== 10) {
            errors.rg = "RG deve conter 10 dígitos";
        }
        if (formData.firstCellphone.length < 10 & formData.firstCellphone != "") {
            console.log("entrei")
            errors.firstCellphone = "Telefone inválido";
        }
        
        if (formData.secondCellphone.length < 10 & formData.secondCellphone != "") {
            errors.secondCellphone = "Telefone 2 inválido";
        }
        if (formData.email && !isEmailValid(formData.email)) {
            errors.email = "E-mail inválido";
        }
    
        if (!formData.name || !formData.birthDate || !formData.cpf || !formData.rg) {
            errors.requiredFields = "Preencha todos os campos obrigatórios";
        }
    
        if (new Date().getFullYear() - new Date(formData.birthDate).getFullYear() < 18) {
            if (!formData.representative) {
                errors.representative = "Campo obrigatório para menores de idade";
                console.log(formData.representative)
            }
        }
        const birthDateObject = new Date(formData.birthDate);
        const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const daysInMonth = [31, isLeapYear(birthDateObject.getFullYear()) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (
            isNaN(birthDateObject.getTime()) ||
            birthDateObject.getFullYear() < 1900 || birthDateObject.getFullYear() > new Date().getFullYear() ||
            birthDateObject.getMonth() < 0 || birthDateObject.getMonth() > 11 ||
            birthDateObject.getDate() < 1 || birthDateObject.getDate() > daysInMonth[birthDateObject.getMonth()]
        ) {
            errors.birthDate = "Data de Nascimento inválida";
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        } else {
            setFormErrors({})
            setModalPosition(1)
            if (modalPosition == 1) {
                try {
                    if (formData.cep.length < 8) {
                        setCepError(true)

                    } else {
                        setCepError(false)
                        setModalPosition(2)
                    }
                } catch (err) {
                    console.log(err)                 
                }
            } else
            if (modalPosition == 2){
                try {
                    setLoading(true);
                    addNewClient(formData)
                    handleClose()
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        }
    }
    const [cepError, setCepError] = useState(false)

    const MAX_CPF_LENGTH = 14; // 999.999.999-99
    const MAX_PHONE_LENGTH = 14; // 5399999-9999
    const MAX_DATE_LENGTH = 10; // 04/06/2004
    const MAX_RG_LENGTH = 13; // 51.309.999-99
    
    // Formatting and Validating functions

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const formatPhone = (value) => {
        const phone = value.replace(/\D/g, '').slice(0, MAX_PHONE_LENGTH);
    
        if (phone.length <= 10) {
            return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1)$2-$3');
        } else {
            return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
        }
    };

    const formatRG = (value) => {
        const numericString = value.replace(/\D/g, ''); // Remove non-numeric characters
        const length = numericString.length;
      
        if (length <= 2) {
          return numericString;
        } else if (length <= 5) {
          return `${numericString.slice(0, 2)}.${numericString.slice(2)}`;
        } else if (length <= 8) {
          return `${numericString.slice(0, 2)}.${numericString.slice(2, 5)}.${numericString.slice(5)}`;
        } else if (length > 8) {
          return `${numericString.slice(0, 2)}.${numericString.slice(2, 5)}.${numericString.slice(5, 8)}-${numericString.slice(8)}`;
        }
        // Add more conditions as needed for longer strings
        return numericString; // Default case
    };

    const formatCEP = (value) => {
        const numericString = value.replace(/\D/g, ''); // Remove non-numeric characters
        const length = numericString.length;
        if (length <= 2) {
          return numericString;
        } else if (length <= 5) {
          return `${numericString.slice(0, 2)}${numericString.slice(2)}`;
        } else if (length <= 8) {
          return `${numericString.slice(0, 2)}${numericString.slice(2, 5)}-${numericString.slice(5)}`;
        }
        // Add more conditions as needed for longer strings
        return numericString; // Default case
    };

    const formatBirthDate = (birthdateString) => {
        const numericString = birthdateString.replace(/\D/g, ''); // Remove non-numeric characters
        const length = numericString.length;
      
        if (length <= 2) {
          return numericString;
        } else if (length <= 4) {
          return `${numericString.slice(0, 2)}/${numericString.slice(2)}`;
        } else if (length > 4) {
          return `${numericString.slice(0, 2)}/${numericString.slice(2, 4)}/${numericString.slice(4)}`;
        }
        // Add more conditions as needed for longer strings
      
        return numericString; // Default case
    };

    const addDotsToCPFNumber = (numericString) => {
        const length = numericString.length;
        if (length <= 3) {
          return numericString;
        } else if (length <= 6) {
          return `${numericString.slice(0, 3)}.${numericString.slice(3)}`;
        } else if (length <= 9) {
          return `${numericString.slice(0, 3)}.${numericString.slice(3, 6)}.${numericString.slice(6)}`;
        } else if (length > 9) {
            return `${numericString.slice(0, 3)}.${numericString.slice(3, 6)}.${numericString.slice(6, 9)}-${numericString.slice(9)}`;
        }
        // Add more conditions as needed for longer strings
      
        return numericString; // Default case
    };

    const [formattedCPF, setFormattedCPF] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");
    const [formattedSecondPhone, setFormattedSecondPhone] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedRG, setFormattedRG] = useState("");
    
    // Form data
    const handleCPFChange = (e) => {
        e.preventDefault()
        const rawCPF = e.target.value.replace(/\D/g, '');
        const formattedCPF = addDotsToCPFNumber(rawCPF);
        setFormattedCPF(formattedCPF);
        setFormData((prevData) => ({
          ...prevData,
          cpf: rawCPF,
        }));
    };
      
    const handlePhoneChange = (e) => {
        e.preventDefault()
        const rawPhone = e.target.value.replace(/\D/g, "")
        const formattedPhone = formatPhone(rawPhone);
        setFormattedPhone(formattedPhone)
        setFormData((prevData) => ({
          ...prevData,
          firstCellphone: rawPhone,
        }));
    };

    const handleSecondPhoneChange = (e) => {
        e.preventDefault()
        const rawPhone = e.target.value.replace(/\D/g, "")
        const formattedPhone = formatPhone(rawPhone);
        setFormattedSecondPhone(formattedPhone)
        setFormData((prevData) => ({
          ...prevData,
          secondCellphone: rawPhone,
        }));
    };

    const handleDateChange = (e) => {
        e.preventDefault()
        const rawDate = e.target.value.replace(/\D/g, '');
        const formattedDate = formatBirthDate(rawDate);
        setFormattedDate(formattedDate)
        setFormData((prevData) => ({
          ...prevData,
          birthDate: formattedDate,
        }));
    };

    const handleRGChange = (e) => {
        e.preventDefault()
        const rawRG = e.target.value.replace(/\D/g, '');
        const formattedRG = formatRG(rawRG);
        setFormattedRG(formattedRG)
        setFormData((prevData) => ({
          ...prevData,
          rg: rawRG,
        }));
    };

    const handleNameChange = (e) => {
        e.preventDefault()
        setFormData((prevData) => ({
          ...prevData,
          name: e.target.value,
        }));
      };
    
    const handleProfessionChange = (e) => {
        e.preventDefault()
        setFormData((prevData) => ({
          ...prevData,
          profession: e.target.value,
        }));
      };

    const handleFamilyIncomeChange = (e) => {
        e.preventDefault()
        setFormData((prevData) => ({
          ...prevData,
          familyIncome: e.target.value,
        }));
      };
    
    const handleEmailChange = (e) => {
        e.preventDefault()
        setFormData((prevData) => ({
          ...prevData,
          email: e.target.value,
        }));
      };
    
    const handleFamiliarChange = (e) => {
        e.preventDefault()
        setFormData((prevData) => ({
          ...prevData,
          familiar: e.target.value,
        }));
    };
    const [formattedCEP, setFormattedCEP] = useState("")

    const handleCepChange = (e) => {
        e.preventDefault()
        const rawCEP = e.target.value.replace(/\D/g, '');
        const formattedCEP = formatCEP(rawCEP);
        setFormattedCEP(formattedCEP)
        setFormData((prevData) => ({
          ...prevData,
          cep: rawCEP,
        }));
    };
      
    const handleStreetChange = (e) => {
        e.preventDefault();
        setFormData((prevData) => ({
          ...prevData,
          street: e.target.value,
        }));
    };
      
    const handleNumberChange = (e) => {
        e.preventDefault();
        setFormData((prevData) => ({
          ...prevData,
          number: e.target.value,
        }));
    };
      
    const handleComplementChange = (e) => {
        e.preventDefault();
        setFormData((prevData) => ({
          ...prevData,
          complement: e.target.value,
    })); }

    const [formedArray, setFormedArray] = useState({})
    
    useEffect(() => {
        const req = getAllUsers();
        req.then(response => {
        console.log(response)
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
            console.log(formedArray)
        }
        }).catch(error => {
            console.log(error)
        });
    }, [])

    useEffect(() => {
    }, [usersData])

    // const cpfExists = await checkExistingData('cpf', formData.cpf);
    // const rgExists = await checkExistingData('rg', formData.rg);

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
    const [dependents, setDependents] = useState([]);
    const [newDependent, setNewDependent] = useState({ name: '', age: '' });
    
    const handleDependentsAgeChange = (e) => {
        e.preventDefault()
        setNewDependent((prevDependent) => ({ ...prevDependent, age: e.target.value }));
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
            // Cria um noo dependente na lista de dependentes
            setDependents((prevDependents) => [...prevDependents, newDependent]);
            setNewDependent({ name: '', age: '' });
        }
    };
    // Função para deletar os dependentes
    const deleteDependent = (index) => {
        const updatedDependents = dependents.filter((_, i) => i !== index);
        setDependents(updatedDependents);
    };
  
    const [modalPosition, setModalPosition] = useState(0)
    const handleModalPosition = () => {
        setModalPosition(0)
    }
    const handleModalPosition2 = () => {
        setModalPosition(2)
        handleSubmit()
    }
    const [representativeState, setRepresentative] = useState(0)
    return(
            <Modal
                open={openAlert}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                {modalPosition === 0 && (
                    <div className="relative">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Adicionar Assistido
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover-bg-gray-600 dark:hover-text-white"
                                    onClick={handleClose}
                                >
                                    <CloseIcon/>
                                </button>
                            </div>
                        
                            <form onSubmit={handleSubmit}>
                                {formErrors.contact && <p className="text-red-500">{formErrors.contact}</p>}
                                {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
                                {formErrors.requiredFields && <p className="text-red-500">{formErrors.requiredFields}</p>}
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleNameChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                            // placeholder="Nome do assistido"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            RG
                                            {formErrors.rg && <p className="text-red-500">{formErrors.rg}</p>}
                                        </label>
                                        <input
                                            type="text"
                                            name="rg"
                                            id="rg"
                                            value={formattedRG}
                                            onChange={handleRGChange}
                                            maxLength={MAX_RG_LENGTH}
                                            className="formatted-input-rg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Data de Nascimento
                                            {formErrors.birthDate && <p className="text-red-500">{formErrors.birthDate}</p>}
                                        </label>
                                        <input
                                            type="text"
                                            name="birthDate"
                                            id="birthDate"
                                            value={formattedDate}
                                            onChange={handleDateChange}
                                            maxLength={MAX_DATE_LENGTH}
                                            className="formatted-input-date bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            CPF
                                            {formErrors.cpf && <p className="text-red-500">{formErrors.cpf}</p>}
                                        </label>
                                        <input
                                            type="text"
                                            name="cpf"
                                            id="cpf"
                                            value={formattedCPF}
                                            onChange={handleCPFChange}
                                            maxLength={MAX_CPF_LENGTH}
                                            className="formatted-input-cpf bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Telefone
                                            {formErrors.firstCellphone && <p className="text-red-500">{formErrors.firstCellphone}</p>}
                                        </label>
                                        <input
                                            type="text"
                                            name="firstCellphone"
                                            id="firstCellphone"
                                            value={formattedPhone}
                                            onChange={handlePhoneChange}
                                            maxLength={MAX_PHONE_LENGTH}
                                            className="formatted-input-phone bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Telefone 2
                                            {formErrors.secondCellphone && <p className="text-red-500">{formErrors.secondCellphone}</p>}
                                        </label>
                                        <input
                                            type="text"
                                            name="secondCellphone"
                                            id="secondCellphone"
                                            value={formattedSecondPhone}
                                            onChange={handleSecondPhoneChange}
                                            maxLength={MAX_PHONE_LENGTH}
                                            className="formatted-input-phone bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            E-mail
                                        </label>
                                        <input
                                            onChange={handleEmailChange}
                                            value={formData.email}
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                        />
                                    </div>
                                    <span></span>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Profissão
                                        </label>
                                        <input
                                            type="text"
                                            name="profession"
                                            id="profession"
                                            value={formData.profession}
                                            onChange={handleProfessionChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                            // placeholder="Profissão do assistido"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Renda Familiar
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.familyIncome}
                                            onChange={handleFamilyIncomeChange}
                                            name="secondCellphone"
                                            id="secondCellphone"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                            required
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
                                            onChange={opt =>setRepresentative(opt.value)}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Conhecido
                                        </label>
                                        <input
                                            value={formData.familiar}
                                            onChange={handleFamiliarChange}
                                            type="text"
                                            name="familiar"
                                            id="familiar"
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
                                                    placeholder='Nome'
                                                    type="text"
                                                    name="dependentName"
                                                    value={newDependent.name}
                                                    onChange={handleDependentsNameChange}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-2/4 p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                                />
                                                <input
                                                    type="number"
                                                    name="dependentAge"
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
                                            {}
                                            <AddIcon/>
                                            Adicionar Dependentes
                                        </div>
                                    </div>
                                    {dependents.length > 0 && (
                                            <div>
                                            <div
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Seus de Dependentes
                                            </div>
                                            {dependents.map((dependent, index) => (
                                                <div className="flex gap-2" key={index} style={{marginTop:"10px"}}>
                                                    <p
                                                        type="text"
                                                        name="dependentName"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-2/4 p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                                        required
                                                    >
                                                        {dependent.name}
                                                    </p> 
                                                    <p
                                                        type="number"
                                                        name="dependentAge"
                                                        placeholder={dependent.name}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-1/3 p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                                        required
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
                                        )}
                                </div>
                                <button
                                    type="submit"
                                    className="text-white inline-flex mt- items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
                                    style={{marginLeft: "75%"}}
                                >
                                    <NavigateNextIcon/>
                                    Proximo Passo
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {modalPosition === 1 && (
                <div className="relative">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Endereço
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover-bg-gray-600 dark:hover-text-white"
                                onClick={handleClose}
                            >
                                <CloseIcon/>
                            </button>
                        </div>
                    
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        CEP
                                        {cepError && <p className="text-red-500">Insira o CEP da forma correta</p>}
                                    </label>
                                    <input
                                        type="text"
                                        name="cep"
                                        id="cep"
                                        maxLength={9}
                                        value={formattedCEP}
                                        onChange={handleCepChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                        // placeholder="Nome do assistido"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Rua
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.street}
                                        onChange={handleStreetChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                        // placeholder="Nome do assistido"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Número
                                    </label>
                                    <input
                                        type="number"
                                        name="number"
                                        id="number"
                                        maxLength={20}
                                        value={formData.number}
                                        onChange={handleNumberChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                        // placeholder="Nome do assistido"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Complemento
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.complement}
                                        onChange={handleComplementChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                                        // placeholder="Nome do assistido"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                style={{marginRight: "55%"}} className="text-white inline-flex mt- items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
                                onClick={handleModalPosition}
                            >
                                <ArrowBackIosIcon/>
                                Voltar
                            </button>
                            <button
                                type="submit"
                                className="text-white inline-flex mt- items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
                                onClick={handleModalPosition2}
                            >
                                <AddIcon/>
                                Adicionar Assistido
                            </button>
                        </form>
                    </div>
                </div>
                )}
                </Box>      
            </Modal>
    );
}