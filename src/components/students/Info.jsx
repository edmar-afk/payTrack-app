import { useEffect, useState } from "react";
import walletImg from "../../assets/images/wallet.png";
import api from "../../assets/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import acceptedStamp from "../../assets/images/stamps/accepted.png";
import declinedStamp from "../../assets/images/stamps/declined.png";
import pendingStamp from "../../assets/images/stamps/pending.jpg";
import FilterPayment from "./FilterPayment";
import RemainingPaymentModal from "./RemainingPaymentModal";
import ProofsModal from "./ProofsModal";
function Info({ user }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [semester, setSemester] = useState("First Semester");
  const [schoolYear, setSchoolYear] = useState("2025-2026");

  const fetchPayments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/api/payment_filter/${user.id}/?semester=${semester}&school_year=${schoolYear}`
      );

      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user, semester, schoolYear]);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  const getStatusIcon = (status) => {
    console.log("Payment status:", status);
    if (!status) status = "pending";
    const lowerStatus = status.toLowerCase();

    if (lowerStatus === "accepted") {
      return <img src={acceptedStamp} alt="accepted" className="w-20 h-12" />;
    }
    if (lowerStatus === "pending") {
      return <img src={pendingStamp} alt="Pending" className="w-20 h-12" />;
    }
    if (lowerStatus === "declined") {
      return <img src={declinedStamp} alt="declined" className="w-20 h-12" />;
    }
    return <img src={pendingStamp} alt="Pending" className="w-20 h-12" />; // default fallback
  };

  console.log(payments);


  
  return (
    <div className="bg-white lg:bg-gray-100 p-0 lg:p-6 rounded-md w-[350px] lg:w-[600px] mb-8 lg:mb-0">
      <div>
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            Payment History
          </h2>
          <RefreshIcon
            className={`cursor-pointer transition-transform duration-500 ${
              refreshing ? "rotate-180" : ""
            }`}
            fontSize="large"
            onClick={handleRefresh}
          />
        </div>

        <FilterPayment
          semester={semester}
          setSemester={setSemester}
          schoolYear={schoolYear}
          setSchoolYear={setSchoolYear}
        />

        {loading ? (
          <p className="text-center text-slate-500 mt-10">Loading...</p>
        ) : payments.length === 0 ? (
          <>
            <img src={walletImg} className="w-72 mx-auto pt-24" alt="" />
            <p className="text-center">No payments found</p>{" "}
            <p className="text-center">
              in School Year {schoolYear} - {semester}
            </p>
          </>
        ) : (
          <ul className="mt-6 space-y-4">
            {payments.map((p) => (
              <li
                key={p.id}
                className="bg-white p-4 rounded-md shadow-md relative"
              >
                {p.comittee_name && (
                  <>
                    <p className="text-lg font-semibold">{p.comittee_name}</p>
                    <p>
                      <span className="font-semibold">Committee Amount:</span> ₱
                      {parseInt(p.amount || 0).toLocaleString()}
                    </p>
                    {p.semester && (
                      <p>
                        <span className="font-semibold">Semester:</span>{" "}
                        {p.semester}
                      </p>
                    )}
                    <hr className="my-3" />
                  </>
                )}

                <div className="flex flex-row justify-between items-center">
                  <p>
                    <span className="font-semibold mr-1">Payment Method:</span>
                    {p.payment}
                  </p>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(p.status || "pending")}
                  </div>
                </div>
                <p>
                  <span className="font-semibold mr-1">School Year:</span>
                  {p.school_year} - {p.semester}
                </p>
                <div className="flex flex-row gap-4 flex-wrap mt-3 justify-between lg:justify-start">
                  {[
                    { label: "CF", value: p.cf, max: 100 },
                    { label: "LAC", value: p.lac, max: 100 },
                    { label: "PTA", value: p.pta, max: 150 },
                    { label: "QAA", value: p.qaa, max: 100 },
                    { label: "RHC", value: p.rhc, max: 100 },
                  ].map((item) => {
                    const paid = parseFloat(item.value) || 0;
                    const missing = Math.max(item.max - paid, 0).toFixed(2);

                    return (
                      <div
                        key={item.label}
                        className="w-[140px] lg:w-[200px] p-5 mb-3 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-500 font-bold"
                      >
                        {item.label}
                        <div>
                          <h5 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                            ₱{paid.toLocaleString()}
                          </h5>
                          <p className="text-xs text-red-400">
                            {Number(missing) === 0 ? (
                              <p className="text-green-600">Fully Paid</p>
                            ) : (
                              `Remaining Pay ₱${Number(
                                missing
                              ).toLocaleString()} Left`
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t-2 pt-4 mt-3 border-dashed border-gray-300 flex flex-row justify-between items-center">
                  <p>
                    <span className="font-semibold">Date Issued:</span>{" "}
                    {new Date(p.date_issued).toLocaleDateString()}
                  </p>{" "}
                  {p.proof && (
                    <ProofsModal paymentId={p.id}/>
                  )}
                </div>

                <RemainingPaymentModal
                  payment={p}
                  schoolyear={schoolYear}
                  semesters={semester}
                />

                {p.feedback && (
                  <div className="mt-3">
                    <h4 className="font-semibold">Feedback:</h4>
                    <p>{p.feedback}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Info;
