import React, { useEffect, useState } from "react";
import ActivityLog from "../components/ActivityLog";
import { useSelector } from 'react-redux';
import { getActivities } from "../data/axios/apiCalls";
import moment from "moment";
import 'moment/dist/locale/pt-br'
moment.locale('pt-br');

export default function Perfil() {
    const user = useSelector((state) => state.user.currentUser);
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        const req = getActivities(user.id);
        req.then(response => {
            if (response.status === 200) {
               setActivities(response.data);
            }
        }).catch(err => {
            console.log(err);
        });
    }, []);
    
    useEffect(() => {
        console.log(activities);
    }, [activities]); 
    

    return (
        <div className="flex flex-col min-h-screen rounded-md border screen rounded-lg bg-white px-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="mt-10 h-full bg-white p-8 ">
                <div className="bg-white rounded-lg shadow-md pb-8">
                    <div className="w-full h-[250px]">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8j18z7o-rhfY7wEUVcEcDiqmYRUqc1hoBiA&usqp=CAU"
                        className="w-full h-full rounded-tl-lg rounded-tr-lg"
                        alt="Profile Background"
                    />
                    </div>
                    <div className="flex flex-col items-center -mt-20">
                    <img
                        src={user.img || "https://i.imgur.com/oYEFKb1.png"}                        className="w-40 border-4 border-white rounded-full"
                        alt="Profile"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                        <p className="text-2xl">{user.name}</p>
                        <span className="bg-blue-500 rounded-full p-1" title="Verified">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-100 h-2.5 w-2.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </span>
                    </div>
                    <p className="text-gray-700">{user.type}</p>
                    <p className="text-sm text-gray-500">Rio Grande, RS</p>
                    </div>
                </div>

                <div className="my-4 flex justify-center items-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full flex flex-col sm:flex-row">
                        <div className="flex-1 bg-white rounded-lg shadow-md p-8 mb-4 sm:mb-0">
                        <h4 className="text-xl text-gray-900 font-bold">Informações Pessoais</h4>
                        <ul className="mt-2 text-gray-700">
                            <li className="flex border-y py-2">
                            <span className="font-bold w-24">Nome completo:</span>
                            <span className="text-gray-700">{user.name}</span>
                            </li>
                            {/* ... outras informações pessoais */}
                        </ul>
                        </div>
                        <div className="flex-1 ml-0 sm:ml-10 bg-white rounded-lg shadow-md p-8">
                        <h4 className="text-xl text-gray-900 font-bold">Registro de Atividades</h4>
                        <div className="relative px-4">
                            <div className="absolute h-full border border-dashed border-opacity-20 border-secondary"></div>
                            {activities.map((item, index) => (
                                <ActivityLog action={item.action} changeTime={moment(item.createdAt).fromNow()} />
                            ))}
                            <ActivityLog action="Conta criada" changeTime={moment(user.createdAt).fromNow()} />
                            {/* ... itens do log de atividades */}
                        </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    )
}