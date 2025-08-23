import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Tooltip from "@mui/material/Tooltip";

function Stats() {
  const payments = [
    { title: "PTA", amount: "₱123,456.00", subtitle: "Total Paid", count: 12 },
    { title: "QAA", amount: "₱78,900.00", subtitle: "Total Paid", count: 8 },
    { title: "LAC", amount: "₱45,600.00", subtitle: "Total Paid", count: 15 },
    { title: "CF", amount: "₱67,800.00", subtitle: "Total Paid", count: 20 },
    { title: "RHC", amount: "₱12,345.00", subtitle: "Total Paid", count: 5 },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-tr from-green-900 to-green-500 p-4 rounded-xl text-white">
      <div className="flex flex-row items-center justify-between mb-4">
        <p className="text-lg">Payment Informations</p>
        <p>As of Aug. 20, 2025</p>
      </div>
      <p className="text-4xl font-bold">₱999,999.00</p>
      <p className="text-sm opacity-80">Total Amount</p>

      <div className="flex flex-row mt-8 flex-wrap justify-start gap-4">
        {payments.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-xl bg-green-950 border-2 border-green-700 w-[250px] mb-4"
          >
            <div className="flex flex-row items-end justify-between">
              <div>
                <p className="text-lg font-extrabold">{item.title}</p>
                <p className="pt-2">{item.amount}</p>
                <p className="text-xs">{item.subtitle}</p>
              </div>

              <Tooltip
                title={`${item.count} students paid`}
                arrow
                placement="top"
              >
                <div className="bg-green-200 hover:bg-green-400 duration-300 hover:scale-110 text-gray-900 px-3 py-1 rounded-lg text-sm flex flex-row items-center cursor-pointer">
                  <PeopleOutlineIcon fontSize="small" />
                  <p className="ml-1 mt-0.5">{item.count}</p>
                </div>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
