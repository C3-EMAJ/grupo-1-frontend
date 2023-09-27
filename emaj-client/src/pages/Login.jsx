import React, { useState } from "react";

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Home() {
  // exibir loading (o círculo que fica rodando):
  const [isLoading, setIsLoading] = useState(false);
  
  // deixar a senha visível (se for true: password, se for false: text):
  const [showPassword, setShowPassword] = useState(true);

  const [password, setPassword] = useState(""); // email
  const [email, setEmail] = useState(""); // senha

  // mensagens de alerta que são mostradas na parte superior:
  const [alertMessage, setAlertMessage] = useState(""); // mensagem
  const [showAlertMessage, setShowAlertMessage] = useState(false); // exibir ou não
  const [typeAlertMessage, setTypeAlertMessage] = useState(''); // tipo da mensagem: success, error, warning ou info

  const handleAlert = (type, message) => {
    setShowAlertMessage(true);
    setAlertMessage(message);
    setTypeAlertMessage(type);

    setTimeout(() => { setShowAlertMessage(false) }, 7000);
  };

  return (
  
    <>
      <Snackbar
        open={showAlertMessage}
        severity="success"
        TransitionComponent={SlideTransition}
        anchorOrigin={{
          vertical: "botom",
          horizontal: "center"
        }}>
          <Alert  severity={typeAlertMessage} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>

        </Snackbar>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
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
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300" 
                type="email" aria-label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}/>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Senha
                </label>
              </div>

              <label htmlFor="password" className="relative text-gray-400 focus-within:text-gray-600 block">
                <input
                  className="flex w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-yellow-400 dark:focus:border-yellow-300 focus:ring-opacity-30 focus:outline-none focus:ring focus:ring-yellow-300"
                  type={showPassword ? "password" : "text"}
                  aria-label="Password"
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
                type="submit"
                className="flex items-center w-full h-11 justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Entrar
              </button>
            </div>
          </form>
          <br/>
          <div className="flex w-full justify-center">
            <div className="text-sm">
                <a href="#" className="font-semibold text-gray-500 hover:text-gray-900">
                  Esqueceu sua senha?
                </a>
            </div>
          </div>

          <React.Fragment>
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <CircularProgress color="primary" />
              </Box>
            )}
          </React.Fragment>

          
        </div>
      </div>
    </>
  );
};

// <button onClick={() => {handleAlert("error", "Erro!")}}>CLIQUE AQUI</button>
