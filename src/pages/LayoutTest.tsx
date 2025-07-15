import MainLayout2 from "@/layouts/MainLayout";

export default function LayoutTest() {
  return (
    <MainLayout2>
      <div className="grid gap-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Bus Status Overview</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500">
                จำนวนรถออนไลน์ทั้งหมด
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#0088a9]">6 คัน</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500">
                จำนวนรถออฟไลน์ทั้งหมด
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#0088a9]">6 คัน</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500">
                Lost & Found
              </h3>
              <p className="mt-2 text-3xl font-bold text-[#0088a9]">1 รายการ</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">รถเมล์</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((bus) => (
              <div
                key={bus}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
              >
                <div className="h-32 bg-green-500">
                  {/* Bus image would go here */}
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-medium">โซน 45 ปทุมฯ</p>
                  <p className="text-xs text-gray-500">สายตะวันออก - ตะวันตก</p>
                  <p className="text-xs text-gray-500">บส 0778</p>
                  <p className="text-xs text-gray-500">เที่ยว 171</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Bus Status Table</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">รหัสรถเมล์</th>
                  <th className="px-4 py-2 text-left">ชื่อคนขับ</th>
                  <th className="px-4 py-2 text-left">เบอร์โทรศัพท์</th>
                  <th className="px-4 py-2 text-left">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row} className="border-b">
                    <td className="px-4 py-2">DV001</td>
                    <td className="px-4 py-2">เก่ง แผนสมเด็จ รักเรียน</td>
                    <td className="px-4 py-2">020 93382814</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          row % 2 === 0
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {row % 2 === 0 ? "ขับอยู่" : "กำลังขับรถ"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout2>
  );
}
