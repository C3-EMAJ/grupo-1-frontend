import Sidebar from '../ui/components/Sidebar';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
    return (
    <div className="overflow-hidden h-full min-h-full">
        <div className="flex mx-auto">
        <Sidebar/>

        <main className="w-full">
            <div className="mx-autop-4 md:p-4 2xl:p-5 overflow-auto">
                <Outlet />
            </div>
        </main>


        </div>
    </div>
  );
};

export default DefaultLayout;
