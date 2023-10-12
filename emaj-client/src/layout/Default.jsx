import { useState } from 'react';

import Sidebar from '../ui/components/Sidebar';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
    return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
        <Sidebar/>
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

            <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-4 2xl:p-5">
                    <Outlet />
                </div>
            </main>
            
        </div> 
        </div>
    </div>
  );
};

export default DefaultLayout;
