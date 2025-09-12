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
function Info({ user }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/payments/user/${user.id}/`);
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

  return (
    <div className="bg-gray-100 p-6 rounded-md w-[600px]">
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

      {loading ? (
        <p className="text-center text-slate-500 mt-10">Loading...</p>
      ) : payments.length === 0 ? (
        <>
          <img src={walletImg} className="w-72 mx-auto pt-24" alt="" />
          <p className="text-center">No payments found</p>
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
                <span className="font-semibold">Date Issued:</span>{" "}
                {new Date(p.date_issued).toLocaleDateString()}
              </p>

              {p.proof && (
                <a
                  href={p.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Proof
                </a>
              )}

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
  );
}

export default Info;
