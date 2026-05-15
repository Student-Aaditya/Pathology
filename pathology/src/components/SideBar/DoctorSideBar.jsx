import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  TestTube,
  Menu,
  Settings,
  User,
  LogOut,
  CreditCard,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFinance, setShowFinance] = useState(location.pathname.includes("/home/finance"));
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Sample", icon: <FileText size={18} /> },
    { name: "Reporting", icon: <ClipboardList size={18} /> },
    
    {
      name: "Print",
      icon: <User size={18} />,
      subItems: [
        { name: "Pending", icon: <FileText size={16} />, path: "/home/print/pending" },
        { name: "Complete", icon: <CreditCard size={16} />, path: "/home/print/complete" },
       
      ],
    },
     {
      name: "Finance",
      icon: <User size={18} />,
      subItems: [
        { name: "Payments", icon: <FileText size={16} />, path: "/home/finance/payments" },
        
       
      ],
    },
   
  ];

  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/doctor/home" || path === "/doctor/home/dashboard") return "Dashboard";
   
    if (path.includes("/doctor/home/sample")) return "Sample";
    if (path.includes("/doctor/home/reporting")) return "Reporting";
    if (path.includes("/doctor/home/print/pending")) return "Pending";
    if (path.includes("/doctor/home/print/complete")) return "Complete";
    if (path.includes("/doctor/home/finance/finance")) return "Finance";
   
    return "Dashboard";
  };

  const active = getActiveItem();
  return (
    <div
      className={`h-screen ${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r md:m-4 font-sans border-gray-200 text-gray-800 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-5 flex items-center justify-between  border-gray-700">
        {!collapsed && <span className="text-lg text-violet-700 font-sans font-semibold">Trego</span>}
        <Menu
          size={20}
          className="cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => {
                if (item.subItems) {
                  setShowFinance(!showFinance);
                } else if (item.name === "Dashboard") {
                  navigate("/doctor/home");
                } else if (item.name === "Sample") {
                  navigate("/doctor/home/sample");
                } else if (item.name === "Reporting") {
                  navigate("/doctor/home/reporting");
                } else if (item.name === "Pending") {
                  navigate("/doctor/home/print/pending");
                } else if (item.name === "Finance") {
                  navigate("/doctor/home/finance/finance");
                }  else if (item.name === "Complete") {
                  navigate("/doctor/home/print/complete");
                } 
              }}
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } px-4 py-2 rounded-lg cursor-pointer transition
            ${
              active === item.name
                ? "bg-violet-500 text-gray-700"
                : "hover:bg-violet-500 text-gray-700"
            }`}
            >
              {item.icon}
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-slate-600 font-semibold">{item.name}</span>
                  {item.subItems && (
                    showFinance ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </div>
              )}
            </div>

            {/* Sub-items */}
            {!collapsed && item.subItems && showFinance && (
              <div className="ml-6 mt-1 space-y-1">
                {item.subItems.map((sub, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(sub.path)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-violet-400 hover:text-white transition text-gray-600 ${
                      location.pathname === sub.path ? "bg-violet-400" : ""
                    }`}
                  >
                    {sub.icon}
                    <span className="text-sm text-gray-700 hover:text-white font-semibold">{sub.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-gray-700">
        <div
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          } px-4 py-2 rounded-lg cursor-pointer hover:bg-violet-400`}
        >
          <Settings size={18} />
          {!collapsed && <span className="text-sm">Settings</span>}
        </div>

        {/* Dropdown */}
        {showSettings && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-violet-400">
              <User size={16} />
              {!collapsed && <span className="text-sm">Profile</span>}
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-400 hotext-gray-300">
              <LogOut size={16} onClick={() => navigate("/")} />
              {!collapsed && <span className="text-sm">Logout</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
