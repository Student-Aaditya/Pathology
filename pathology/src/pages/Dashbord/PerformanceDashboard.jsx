import DashboardCard from "../../components/PerformanceCard";

const PerformanceDashboard = () => {
  return (
  

      <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <div className="bg-white px-12 py-6 shadow-lg rounded-xl m-4 ml-7 border-b border-violet-500">
        <h1 className="text-3xl font-bold text-gray-800">
         Doctor  <span className="text-violet-500"> Performance Dashboard</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back to Trego Doctor Management
        </p>
      </div> 
      
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ml-7 mr-4">
        <DashboardCard title="Today " boxName="Sample Received" value="1200" icon="👤" />
        <DashboardCard title="Sample " boxName="Damage / leak" value="50" icon="" />
        <DashboardCard title="Today" boxName=" Pending To Process" value="320" icon="📦" />
        <DashboardCard title="Total" boxName="Pending" value="1000" icon="📊" />
         <DashboardCard title="Today" boxName="Ready To Print " value="1000" icon="📊" />
          <DashboardCard title="Total" boxName="Tests Completed" value="1000" icon="📊" />
      </div>
      
         </div>
    
   
  );
};

export default PerformanceDashboard;
