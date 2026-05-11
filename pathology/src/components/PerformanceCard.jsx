//  Reusable Card Component
const PerformanceCard = ({ title,boxName, value, icon, color }) => {
  return (
    <div className={`flex items-center justify-between p-5 rounded-2xl shadow-md bg-white hover:shadow-xl transition-all duration-300`}>
      <div>
        <p className="text-gray-500 text-[14px]">{title}</p>
        <p className="text-gray-500 text-[14px]">{boxName}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>
      <div className={`text-3xl p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default PerformanceCard;