
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function SideBar() {

    return(
      <div className="scroll-sidebar flex flex-col w-1/4 max-w-sm min-w-sm h-screen px-4 py-8 overflow-y-auto bg-gray-200 border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 m-0">
          <div className="logo-emaj">
              <div className="barra"></div>
              <div className="nome-emaj">EMAJ</div>
          </div>
    
          <div className="flex flex-col items-center mb-6 mt-6 -mx-2 h-2/6">
            <img className="object-cover w-40 h-40 mx-2 rounded-full" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="avatar" />
            <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">Pedro</h4>
            <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Aluno</p>
          </div>
    
          <div className="flex flex-col justify-between mt-5 ">
            <nav>
              <a className="flex items-center h-12 px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-700 hover:bg-yellow-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white" href="#">
                <BusinessCenterOutlinedIcon/>
                <span className="mx-4 font-medium">Processos</span>
              </a>
    
              <a className="flex items-center h-12 px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-700 hover:bg-yellow-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white" href="#">
                <PeopleAltOutlinedIcon/>
                <span className="mx-4 font-medium">Usuários</span>
              </a>

              <a className="flex items-center h-12 px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-700 hover:bg-yellow-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white" href="#">
                <SupportAgentOutlinedIcon/>
                <span className="mx-4 font-medium">Assistidos</span>
              </a>

              <a className="flex items-center h-12 px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-700 hover:bg-yellow-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white" href="#">
                <CalendarMonthOutlinedIcon/>
                <span className="mx-4 font-medium">Agendamentos</span>
              </a>

              <a className="flex items-center h-12 px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-700 hover:bg-yellow-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white" href="#">
                <FolderCopyOutlinedIcon/>
                <span className="mx-4 font-medium">Pastas</span>
              </a>

              <a className="flex items-center h-12 px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-white" href="#">
                <SettingsOutlinedIcon/>
                <span className="mx-4 font-medium">Configurações</span>
              </a>

              <a className="flex bottom-0 items-center h-12 px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-400 hover:bg-red-800 dark:hover:bg-gray-800 dark:hover:text-blue-200 hover:text-white" href="#">
                <LogoutOutlinedIcon/>
                <span className="mx-4 font-medium">Sair</span>
              </a>
            </nav>
          </div>

      </div>
    )
}