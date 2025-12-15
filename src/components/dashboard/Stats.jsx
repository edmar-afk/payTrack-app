import { useEffect, useState } from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Tooltip from "@mui/material/Tooltip";
import api from "../../assets/api";
import PaymentDetailsModal from "../PaymentDetailsModal";

function Stats() {
  const [payments, setPayments] = useState([
    { title: "PTA", subtitle:'Parents Teacher Association', key: "pta" },
    { title: "QAA", subtitle:'Quality Assurance Accredatation', key: "qaa" },
    { title: "LAC", subtitle:'Library Advisory Commity', key: "lac" },
    { title: "CF", subtitle:'Contendency fund', key: "cf" },
    { title: "RHC", subtitle:'Regestral Clinic', key: "rhc" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const fetchTotals = async () => {
      const res = await api.get("/api/committee-totals/");
      const totals = res.data;

      const updatedPayments = payments.map((item) => ({
        ...item,
        amount: totals[item.key] || 0,
        count: totals[`${item.key}_count`] || 0,
      }));

      setPayments(updatedPayments);
    };

    fetchTotals();
  }, []);

  const totalAmount = payments.reduce(
    (acc, item) => acc + (item.amount || 0),
    0
  );

  const handleOpenModal = (item) => {
    setSelectedPayment(item);
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col bg-gradient-to-tr from-green-900 to-green-500 p-4 rounded-xl text-white">
        <div className="flex flex-row items-center justify-between mb-4">
          <p className="text-lg">Payment Informations</p>
          <p>As of {currentDate}</p>
        </div>

        <p className="text-4xl font-bold">
          ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm opacity-80">Total Amount</p>

        <div className="flex flex-row mt-8 flex-wrap justify-evenly gap-4">
          {payments.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-green-950 border-2 border-green-700 w-[230px] mb-4"
            >
              <div className="flex flex-row items-end justify-between">
                <div>
                  <p className="text-lg font-extrabold">{item.title}</p>
                  <p className="text-xs font-extralight">{item.subtitle}</p>
                  <p className="pt-2">
                    ₱
                    {(item.amount || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <Tooltip
                  title={`${item.count || 0} students paid`}
                  arrow
                  placement="top"
                >
                  <div
                    onClick={() => handleOpenModal(item)}
                    className="bg-green-200 hover:bg-green-400 duration-300 hover:scale-110 text-gray-900 px-3 py-1 rounded-lg text-sm flex flex-row items-center cursor-pointer"
                  >
                    <PeopleOutlineIcon fontSize="small" />
                    <p className="ml-1 mt-0.5">{item.count || 0}</p>
                  </div>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPayment && (
        <PaymentDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedPayment.title}
          count={selectedPayment.count}
        />
      )}
    </>
  );
}

export default Stats;
