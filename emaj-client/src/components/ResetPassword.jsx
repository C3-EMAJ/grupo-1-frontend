import React, { useState, useEffect } from "react";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import CodeIcon from '@mui/icons-material/Code';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { checkEmail, codeEmail, modifyPassword } from "../data/axios/apiCalls";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,

};

function generateRandomCode() {
  let code = "";
  const possibleDigits = "0123456789";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * 10);
    const randomDigit = possibleDigits[randomIndex];
    code += randomDigit;
  }
  return code;
};

export default function ResetPassword(props) {
  // Para fechar o modal:
  const [openAlert, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    props.setOpenResetPassword(false);
  }
  //

  // Mensagens de alerta que são mostradas na parte superior:
  const [showAlertMessage, setShowAlertMessage] = useState(false); // Exibir ou não;
  const [alertMessage, setAlertMessage] = useState(""); // Mensagem;
  const [typeAlertMessage, setTypeAlertMessage] = useState(''); // Tipo da mensagem: success, error, warning ou info;

  const handleAlertMessage = (type, message) => {
    setShowAlertMessage(true);
    setAlertMessage(message);
    setTypeAlertMessage(type);

    setTimeout(() => { setShowAlertMessage(false) }, 7000); // Fechar a mensagem;
  };
  //

  // Exibir loading (o círculo que fica rodando):
  const [isLoading, setIsLoading] = useState(false);
  //

  // Email que será inserido:
  const [userEmail, setUserEmail] = useState("");
  //

  // Código que será enviado para o email e código que será inserido no input pelo usuário:
  const [code, setCode] = useState(false);
  const [codeEnteredByUser, setCodeEnteredByUser] = useState(""); // Código a ser digitado pelo usuário
  //

  // Caixa de alteração de senha:
  const [showNewPasswordBox, setNewPasswordBox] = useState(false); // Exibir caixa de alteração de senha
  const [newPassword, setNewPassword] = useState(""); // Senha a a ser digitada
  const [showPassword, setShowPassword] = useState(true); // Deixar a senha visível (se for true: password, se for false: text):
  //

  // Quando o botão do formulário é ativado geramos um código:
  const submitReset = (e) => {
    e.preventDefault();

    setIsLoading(true)

    if (code === false) {
      const randomCode = generateRandomCode();
      setCode(randomCode);
    }
  }
  //

  // Se o código for gerado, testamos se o email informado é válido:
  useEffect(() => { // useEffect checa a todo momento se o código foi gerado
    checkEnteredEmail();
  }, [code]);

  const checkEnteredEmail = () => {
    if (code != false && showNewPasswordBox == false){
      const testEmail = checkEmail({ "email": userEmail });
        testEmail.then(response => {
        if (response.status === 200){
          setIsLoading(false);
          codeEmail({"email":userEmail, "code":code});
          setShowPassword(true);

        } else {
          setIsLoading(false);
          handleAlertMessage("error", "Não existe uma conta cadastrada com este e-mail.");
          cancelReset()
        }}
        ).catch(error => {
          console.log(error)
          setIsLoading(false);
          handleAlertMessage("error", "Aconteceu um erro no processo, tente novamente mais tarde.");
          cancelReset()
        })
    }
  }
  //

  // Na caixa para inserir o código enviado ao email:
  const checkResetCode = (e) => {
    e.preventDefault()
    if (code === codeEnteredByUser) {
      setCode(false);
      setCodeEnteredByUser("");
      setNewPasswordBox(true);

    }
    else {
      handleAlertMessage("error","O código informado não é válido!");
    }
  };
  //

  // Checar a nova senha e fazer uma requisição de alteração:
  const checkNewPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword.length < 5) {
      handleAlertMessage("error","A senha precisa ter pelo menos 5 caracteres.");
      setIsLoading(false);
      return false
    }

    const tryReset = modifyPassword({ "email": userEmail, "password":newPassword});
    tryReset.then(response => {
      if (response.status === 200){
        setIsLoading(false);
        cancelReset();
        handleAlertMessage("success","Senha resetada com sucesso!")

        } else {
          setIsLoading(false);
          handleAlertMessage("error","Algo de errado aconteceu com a tentativa de mudança de senha.");
          cancelReset()
        }}
    ).catch(error => {
      console.log(error)
      setIsLoading(false);
      handleAlertMessage("error","Aconteceu um erro, tente novamente mais tarde.");
      cancelReset()
    });

  };
  //

  // Resetar todo o processo de redefinição de senha:
  const cancelReset = () => {
    setCode(false);
    setCodeEnteredByUser("");
    setNewPassword("");
    setUserEmail("");
    setNewPasswordBox(false);
  }
  //

  return (
    <Modal
      open={openAlert}
      onClose={handleClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(7px)',
      }}
    >
      <>

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

      <Box sx={style}>

      <div className="bg-white rounded-xl shadow-lg">
        
        <div className="p-4 sm:p-4">

          <div className="mt-4 mb-4">
            <form>
              <div className="grid gap-y-4">
                
                <React.Fragment>
                  {(code != false && showNewPasswordBox == false) ? (
                    
                    <div className="flex flex-col items-center bg-white text-gray-700 border border-solid border-lightgray rounded-md text-center">
                      <div className="mb-4 mt-4 border-none">Insira o código que foi enviado para o seu e-mail:</div>
 
                      <div className="mb-4 w-60 border border-lightgray rounded-md flex items-center">
                        
                        <CodeIcon style={{ color: "gray"}}/>                      
                        <input className="h-10 p-5" placeholder="Código" value={codeEnteredByUser} onChange={(e) => setCodeEnteredByUser(e.target.value)}/>
                      
                      </div>
                      <div className="flex flex-col justify-between">
                        <button className="border-none h-10 w-60 mb-2 bg-green-400 rounded-md text-white cursor-pointer" onClick={checkResetCode}>Confirmar</button>
                        <button className="border-none h-10 mb-4 bg-red-400 rounded-md text-white cursor-pointer"  onClick={cancelReset}>Cancelar</button>
                      </div>
                    </div>

                  ) : (code == false && showNewPasswordBox == true) ? (

                    <div className="flex flex-col items-center mb-15 bg-white text-gray-700 border border-solid border-lightgray rounded-md text-center">
                      <div className="mb-4 mt-4 text-sm text-gray-800 dark:text-gray-400">Insira a nova senha desejada:</div>
                      
                      <div>
                        <label className="relative w-60 text-gray-400 focus-within:text-gray-600 block mb-4">
                          <input
                            className="flex w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg focus:border-yellow-400 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                            type={showPassword ? "password" : "text"}
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                          />
                          
                          <React.Fragment>
                            {showPassword ? (
                              <VisibilityOutlinedIcon
                                style={{ color: "lightgray", fontSize: "1.5em", cursor: "pointer", zIndex: 100 }}
                                className="w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 z-50"
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            ) : (
                              <VisibilityOffOutlinedIcon
                                style={{ color: "lightgray", fontSize: "1.5em", cursor: "pointer", zIndex: 100}}
                                className="w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3 z-50"
                                onClick={() => setShowPassword(!showPassword)}  
                              />
                            )}
                          </React.Fragment>
                        </label>

                      </div>
                      <div className="flex flex-col justify-between">
                        <button className="border-none h-10 w-60 mb-2 bg-green-400 rounded-md text-white cursor-pointer" onClick={checkNewPassword}>Confirmar</button>
                        <button className="border-none h-10 mb-4 bg-red-400 rounded-md text-white cursor-pointer"  onClick={cancelReset}>Cancelar</button>
                      </div>
                    </div>

                  ) : (
                    <div className="text-center">
                      <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Esqueceu a sua senha?</h1>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Insira o seu email abaixo e siga as instruções para recuperá-la.
                      </p>

                      <div className="mt-2">
                        <input className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-black-300 bg-white border rounded-lg focus:border-yellow-400 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                        type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
                      </div>
                      <button
                        onClick={submitReset}
                        disabled={isLoading}

                        className="flex items-center mt-4 w-full h-11 justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                          Recuperar Senha
                      </button>

                    </div>


                  )}
                </React.Fragment>


              </div>
            </form>
          </div>
        </div>
      </div>
      <React.Fragment>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <CircularProgress color="primary" />
          </Box>
        )}
      </React.Fragment>
      </Box>
      </>      
    </Modal>
  )
}
