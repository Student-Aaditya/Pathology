import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar/PathologySideBar";


export default function Home() {
  return (
    
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 h-full overflow-y-auto">

        <Outlet />
      </div>
    </div>
  );
}