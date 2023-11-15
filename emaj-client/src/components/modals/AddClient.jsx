import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
  
  };

export default function AddClient(props) {
    // Para fechar o modal e mudar o estado do openLogouAlert (definido na SideBar e passado pelo props):
    const [openAlert, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        props.setOpenAddModal(false);
    }
    const MAX_CPF_LENGTH = 14; // 999.999.999-99
    const MAX_PHONE_LENGTH = 12; // 5399999-9999
    const MAX_DATE_LENGTH = 10; // 04/06/2004
    const MAX_RG_LENGTH = 12; // 51.309.999-99

    // Formatting functions
    const formatCPF = (value) => {
        const cpf = value.replace(/\D/g, '').slice(0, MAX_CPF_LENGTH);
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatPhone = (value) => {
        const phone = value.replace(/\D/g, '').slice(0, MAX_PHONE_LENGTH);
        return phone.replace(/(\d{5})(\d{4})/, '$1-$2');
    };

    const formatDate = (value) => {
        const date = value.replace(/\D/g, '').slice(0, MAX_DATE_LENGTH);
        return date.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    };

    const formatRG = (value) => {
        const rg = value.replace(/\D/g, '').slice(0, MAX_RG_LENGTH);
        return rg.replace(/(\d{2})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const [formattedCPF, setFormattedCPF] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");
    const [formattedSecondPhone, setFormattedSecondPhone] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedRG, setFormattedRG] = useState("");

    const handleCPFChange = (e) => {
        setFormattedCPF(formatCPF(e.target.value));
    };

    const handlePhoneChange = (e) => {
        setFormattedPhone(formatPhone(e.target.value));
    };

    const handleSecondPhoneChange = (e) => {
        setFormattedSecondPhone(formatPhone(e.target.value));
    };

    const handleDateChange = (e) => {
        setFormattedDate(formatDate(e.target.value));
    };

    const handleRGChange = (e) => {
        setFormattedRG(formatRG(e.target.value));
    };
    
    return(
        <Modal
            open={openAlert}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
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

            <form>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Nome
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            // placeholder="Nome do assistido"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Representante
                        </label>
                        <input
                            type="text"
                            name="representative"
                            id="representative"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            // placeholder="Representante do assistido"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            RG
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
                    <div></div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Telefone
                        </label>
                        <input
                            type="text"
                            name="firstCellphone"
                            id="firstCellphone"
                            value={formattedPhone}
                            onChange={handlePhoneChange}
                            maxLength={MAX_PHONE_LENGTH}
                            className="formatted-input-phone bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Profissão
                        </label>
                        <input
                            type="text"
                            name="profission"
                            id="profission"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            // placeholder="Profissão do assistido"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Telefone 2
                        </label>
                        <input
                            type="text"
                            name="secondCellphone"
                            id="secondCellphone"
                            value={formattedSecondPhone}
                            onChange={handleSecondPhoneChange}
                            maxLength={MAX_PHONE_LENGTH}
                            className="formatted-input-phone bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
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
                            Endereço
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Dependentes
                        </label>
                        <input
                            type="text"
                            name="dependents"
                            id="dependents"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            E-mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            required
                        />
                    </div>
                    <div></div>
                    <div>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Conhecido
                        </label>
                        <input
                            type="text"
                            name="familiar"
                            id="familiar"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            required
                        />
                    </div>
                </div>
            <button
                type="submit"
                className="text-white inline-flex mt- items-center bg-yellow-500 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
            >
                <AddIcon/>
                Adicionar Assistido
            </button>
        </form>
        </div>
      </div>
        </Box>      
      </Modal>
    );
}