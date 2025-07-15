import { useState, useEffect } from "react";
import {
  fetchDashboardSummary,
  fetchBusDetails,
  fetchDriverDetails,
} from "@/api/dashboardAPI";

interface Buses {
  id: string;
  bus_number: string;
  bus_plate: string;
  bus_type_name: string;
  bus_type_capacity: number;
  driver_id: string;
}

interface Drivers {
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_status: string;
}

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalBuses: 0,
    totalDrivers: 0,
    totalLostItems: 0,
  });
  const [buses, setBuses] = useState<Buses[]>([]);
  const [drivers, setDrivers] = useState<Drivers[]>([]);

  useEffect(() => {
    document.title = "Dashboard | Bus Locator";
    loadData();
  }, []);

  const loadData = async () => {
    const summaryData = await fetchDashboardSummary();
    const busesData = await fetchBusDetails();
    const driversData = await fetchDriverDetails();

    setSummary(summaryData);
    setBuses(busesData);
    setDrivers(driversData);
  };

  return (
    <div className="max-w-7xl mx-auto p-1 space-y-8">
      {/* Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card title="ຈຳນວນລົດເມທັງໝົດ" count={`${summary.totalBuses} ຄັນ`} />
        <Card title="ຈຳນວນຄົນຂັບທັງໝົດ" count={`${summary.totalDrivers} ຄົນ`} />
        <Card
          title="ຈຳນວນລາຍງານເຄື່ອງເສຍ"
          count={`${summary.totalLostItems} ລາຍການ`}
        />
      </div>

      {/* Bus Details */}
      <div className="overflow-x-auto">
        <div className="flex space-x-6 py-4">
          {buses.map((bus) => (
            <div
              key={`${bus.bus_type_name}-${bus.bus_plate}`}
              className="min-w-[200px] bg-white rounded-2xl shadow-lg p-6 flex-shrink-0 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-200"
            >
              <p className="text-sm text-gray-500">
                {bus.bus_type_name} - {bus.bus_type_capacity} ບ່ອນນັ່ງ
              </p>
              <p className="text-base font-medium text-gray-700">
                {bus.bus_plate}
              </p>
              <p className="text-base text-gray-600">{bus.driver_id}</p>
              <p className="mt-2 text-sm text-gray-500">
                ເບີລົດ {bus.bus_number}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Drivers Table */}
      <div>
        <div
          className="bg-white rounded-2xl shadow-lg overflow-auto"
          style={{ maxHeight: "320px" }}
        >
          <table className="min-w-full text-sm text-center">
            <thead className="bg-[#fff8eb] sticky top-0 z-10 font-bold">
              <tr>
                <th className="py-3 px-5 font-semibold text-gray-600 align-middle">
                  ລະຫັດຄົນຂັບ
                </th>
                <th className="py-3 px-5 font-semibold text-gray-600 align-middle">
                  ຊື່ຄົນຂັບ
                </th>
                <th className="py-3 px-5 font-semibold text-gray-600 align-middle">
                  ເບີໂທຕິດຕໍ່
                </th>
                <th className="py-3 px-5 font-semibold text-gray-600 align-middle">
                  ສະຖານະ
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {drivers.map((item) => (
                <tr
                  key={item.driver_id}
                  className="border-b last:border-none hover:bg-gray-50"
                >
                  <td className="py-3 px-5 align-middle">{item.driver_id}</td>
                  <td className="py-3 px-5 align-middle">{item.driver_name}</td>
                  <td className="py-3 px-5 align-middle">
                    {item.driver_phone}
                  </td>
                  <td className="py-3 px-5 align-middle">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.driver_status === "ເຮັດວຽກ"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.driver_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, count }: { title: string; count: string }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center">
    <h3 className="text-gray-600 text-lg font-medium">{title}</h3>
    <p className="text-3xl font-bold text-black mt-2">{count}</p>
  </div>
);

export default Dashboard;
