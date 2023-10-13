import { useState } from 'react';

import Sidebar from '../ui/components/Sidebar';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
    return (
    <div>
        <div className="flex h-screen w-sreen overflow-hidden">
        <Sidebar/>

        <main className="w-10/12">
            <div className="mx-auto p-4 md:p-4 2xl:p-5">
                <Outlet />
            </div>
        </main>


        </div>
    </div>
  );
};

export default DefaultLayout;
