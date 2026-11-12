import { Outlet } from "react-router-dom";
import SideBar from "../home/Sidebar";
import HeaderStandard from "../HeaderStandard";

export default function AppLayout() {
    return (
        <div className="app-layout">
            <SideBar />
            <div className="main-wrapper">
                <HeaderStandard />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
