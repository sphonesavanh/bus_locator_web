const DashboardContent = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "จับรวมผิดบ่าฝ่ามืด", count: "6 ถืม" },
          { title: "จับรวมยึดบ่าฝ่ามืด", count: "6 ถืม" },
          { title: "Lost & Found", count: "1 ลายยาม" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-gray-600 text-lg font-medium">{item.title}</h3>
            <p className="text-3xl font-bold text-black mt-2">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Bus images cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
            >
              <img
                src="/bus.jpg" // Replace this with the correct image path
                alt="Bus"
                className="rounded-md w-full object-cover"
              />
              <div className="mt-3 text-center text-sm text-gray-700 space-y-1">
                <p>Isuzu 45 ບ່ອນນັ່ງ</p>
                <p>ສາຍຕະຫຼາດໃຫ່ຍ - ດົງໂດກ</p>
                <p>ບข 0778</p>
                <p>ເບີລົດ 171</p>
              </div>
            </div>
          ))}
      </div>

      {/* Lost items table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-600 font-semibold border-b">
            <tr>
              <th className="py-2 px-4">ລະຫັດສິນຄ້າ</th>
              <th className="py-2 px-4">ຜູ້ຄົ້ນພົບ</th>
              <th className="py-2 px-4">ເບີໂທຕິດຕໍ່</th>
              <th className="py-2 px-4">ສະຖານະ</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {[
              {
                id: "DV001",
                finder: "ນາງ ເພຊະຫານວັນ ຈັນສີພູ",
                phone: "020 93382814",
                status: "ทำสําเร็จຮອບທີ",
              },
              {
                id: "DV001",
                finder: "ນາງ ແດ່ວິດ ພັນວິລ",
                phone: "020 93382814",
                status: "ພັກພາຍ",
              },
              {
                id: "DV001",
                finder: "ນາງ ສີມ່ວງ ລິດກະວິນ",
                phone: "020 93382814",
                status: "ເລິກຮອບທີ",
              },
              {
                id: "DV001",
                finder: "ນາງ ທີປຸ້ມ ສາຍຍາວ",
                phone: "020 93382814",
                status: "ทำสําเร็จຮອບທີ",
              },
            ].map((item, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="py-2 px-4">{item.id}</td>
                <td className="py-2 px-4">{item.finder}</td>
                <td className="py-2 px-4">{item.phone}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status.includes("ทำสําเร็จ")
                        ? "bg-green-100 text-green-700"
                        : item.status.includes("ພັກພາຍ")
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardContent;
