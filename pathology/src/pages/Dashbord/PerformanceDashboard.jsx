import DashboardCard from "../../components/PerformanceCard";

const PerformanceDashboard = () => {
  return (
    <div className="p-4 space-y-6">

      <div className="flex justify-center">
        <h1 className="h-20 mt-10  mb-2 text-5xl ">Performance Dashboard</h1>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
