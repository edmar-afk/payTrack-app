import { useEffect, useState } from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Tooltip from "@mui/material/Tooltip";
import api from "../../assets/api";

function Stats() {
  const [payments, setPayments] = useState([
    { title: "PTA" },
    { title: "QAA" },
    { title: "LAC" },
    { title: "CF" },
    { title: "RHC" },
  ]);

  useEffect(() => {
    const fetchTotals = async () => {
      const updatedPayments = await Promise.all(
        payments.map(async (item) => {
          try {
            console.log("Fetching for committee:", item.title);
            const res = await api.get(`/api/total-amount/${item.title}/`);
            console.log("API response for", item.title, ":", res.data);

            const total = parseFloat(res.data.total_amount || 0);
            const count = res.data.count || 0;

            console.log(`Parsed total for ${item.title}:`, total);

            return {
              ...item,
              amount: total,
              count: count,
            };
          } catch (err) {
            console.error("Error fetching total for", item.title, err);
            return { ...item, amount: 0, count: 0 };
          }
        })
      );

      console.log("Updated payments:", updatedPayments);
      setPayments(updatedPayments);
    };

    fetchTotals();
  }, []);

  const totalAmount = payments.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );
  console.log("Total amount:", totalAmount);

  return (
    <div className="flex flex-col bg-gradient-to-tr from-green-900 to-green-500 p-4 rounded-xl text-white">
      <div className="flex flex-row items-center justify-between mb-4">
        <p className="text-lg">Payment Informations</p>
        <p>As of Aug. 20, 2025</p>
      </div>

      <p className="text-4xl font-bold">
        ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
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
                <p className="pt-2">
                  ₱
                  {(item.amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
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
