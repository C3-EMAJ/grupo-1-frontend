import React, { useState } from "react";

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import ResetPassword from "../components/ResetPassword";

import { loginRequest } from "../data/axios/apiCalls";
import { reducerUserLogin } from "../redux/userRedux";
import { useDispatch } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

/*
    Importante salientar:
    
    1º: Todos os trechos de código, antes da parte visual, estão com comentários acima e // abaixo para delimitar;
    
    2º: São feitas requisições para a API e a resposta pode devolver três códigos de erro:
        - 400 (bad request): quando faltar e-mail ou senha no envio de req.body (requisição mal formatada);
        - 204 (no Content): solicitação foi processada, mas não o usuário não é válido e não foi retornado conteúdo (não existe usuário com esse email ou a senha é inválida);
        - 200 (OK): solicitação foi bem-sucedida (retorna informações do usuário);
    
    3º As mesagens têm quatro tipos: success, error, warning ou info;
*/

export default function Home() {
  // Abrir o modal para resetar a senha:
  const [openResetPassword, setOpenResetPassword] = useState(false);

  // Exibir loading (o círculo que fica rodando):
  const [isLoading, setIsLoading] = useState(false);
  //

  // Dispatch para o Login:
  const dispatchLogin = useDispatch();
  //

  // Deixar a senha visível (se for true: password, se for false: text):
  const [showPassword, setShowPassword] = useState(true);
  //

  // Senha e email, que são alterados quando valores são adicionados no input:
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); 
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

  // Acão quando o botão de Login é clicado:
  const submitLoginCheck = (e) => {
    e.preventDefault();

    if (isLoading === false) {
      setIsLoading(true);
    }

    if (password.length == 0 || email.length <= 10 ) {
      setIsLoading(false)
      handleAlertMessage("warning", "Preencha as informações corretamente.")
      
      return false;
    }

    // Fazendo requisição para API:
    loginRequest({ "email": email, "password": password })
    .then(response => {
      // Se der certo:
      if (response.status === 200) { 
        setIsLoading(false)
        dispatchLogin(reducerUserLogin(response.data));
      }
      // Se as informações forem erradas, mas a solicitação for processada:
      if (response.status === 204) {
        setIsLoading(false)
        handleAlertMessage("error", "Credenciais inválidas.");
        return false
      }
      // Se ocorrer um erro no processamento: 
      if (response.status === 500) {
        setIsLoading(false)
        handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa de login, tente novamente mais tarde.");
        return false
      }
    })
    // Se ocorrer um erro aqui, na hora de me comunicar com a API:
    .catch(error => {
      setIsLoading(false)
      handleAlertMessage("error", "Algo deu errado, tente novamente mais tarde.");
      return false
    });
  };

  return (
  
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

      <div className="flex h-full flex-col mt-5 justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="../../public/logo-login.png"
            alt="Escritório Modelo de Acessoria Jurídica - FURG"
            style={{ width: "25rem", height: "10rem" }}
          />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg focus:border-yellow-400 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Senha
                </label>
              </div>

              <label className="relative text-gray-400 focus-within:text-gray-600 block">
                <input
                  className="flex w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg focus:border-yellow-400 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                  type={showPassword ? "password" : "text"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
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

            <div>
              <button
                onClick={submitLoginCheck}
                disabled={isLoading}
                type="submit"
                className="flex items-center w-full h-11 justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Entrar
              </button>
            </div>
          </form>
          <br/>
          <div className="flex w-full justify-center">
            <button 
            className="text-sm"
            onClick={() => setOpenResetPassword(true)}
            >
                <a className="font-semibold text-gray-500 hover:text-gray-900">
                  Esqueceu sua senha?
                </a>
            </button>
          </div>

          <React.Fragment>
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <CircularProgress color="primary" />
              </Box>
            )}
          </React.Fragment>

          {openResetPassword && <ResetPassword setOpenResetPassword={setOpenResetPassword}/>}

        </div>
      </div>


    </>
  );
};
