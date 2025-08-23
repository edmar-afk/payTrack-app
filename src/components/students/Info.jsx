import { useEffect, useState } from "react";
import walletImg from "../../assets/images/wallet.png";
import api from "../../assets/api";
import acceptedStamp from "../../assets/images/stamps/accepted.png";
import declinedStamp from "../../assets/images/stamps/declined.png";
import pendingStamp from "../../assets/images/stamps/pending.jpg";

function Info({ selected, user }) {
  const [committee, setCommittee] = useState(null);
  const [payments, setPayments] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [latestFeedbacks, setLatestFeedbacks] = useState({}); // store latest feedback per payment

  useEffect(() => {
    if (selected && user?.id) {
      api
        .get(`/api/committee/latest/${selected}/`)
        .then((res) => setCommittee(res.data))
        .catch(() => setCommittee(null));

      api
        .get(`/api/payments/${user.id}/${selected}/`)
        .then((res) => {
          setPayments(res.data);
          setNotFound(res.data.length === 0);

          // Fetch latest feedback for each payment
          res.data.forEach((p) => {
            api
              .get(`/api/payments/${p.id}/latest-feedback/`)
              .then((fbRes) => {
                setLatestFeedbacks((prev) => ({
                  ...prev,
                  [p.id]: fbRes.data.status,
                }));
              })
              .catch(() => {
                setLatestFeedbacks((prev) => ({
                  ...prev,
                  [p.id]: "Pending", // default if no feedback
                }));
              });
          });
        })
        .catch(() => {
          setPayments([]);
          setNotFound(true);
        });
    } else {
      setCommittee(null);
      setPayments([]);
      setNotFound(false);
    }
  }, [selected, user]);

  const getStamp = (status) => {
    if (status === "Accepted") return acceptedStamp;
    if (status === "Decline") return declinedStamp;
    if (status === "Pending") return pendingStamp;
    return null;
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md w-[600px]">
      {!selected ? (
        <>
          <h2 className="text-2xl font-semibold text-slate-900">
            Committee Info
          </h2>
          <img src={walletImg} className="w-72 mx-auto pt-24" alt="" />
          <p className="text-center">
            Select Which School Committees to display their information
          </p>
        </>
      ) : notFound && !committee ? (
        <p className="text-center text-lg font-medium mt-32">
          Selected committee has no data yet
        </p>
      ) : committee ? (
        <>
          <h2 className="text-2xl font-semibold text-slate-900">
            {committee.name}
          </h2>
          <p className="mt-4 text-slate-700">{committee.details}</p>
          <p className="mt-2">
            <span className="font-semibold">Amount:</span> ₱
            {parseInt(committee.amount).toLocaleString()}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Deadline:</span>{" "}
            {committee.deadline}
          </p>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Your Payments:</h3>
            {payments.length === 0 ? (
              <p className="mt-2 text-slate-500">No payments yet</p>
            ) : (
              <ul className="mt-2 space-y-4">
                {payments.map((p) => {
                  const status = latestFeedbacks[p.id] || "Pending";
                  const stamp = getStamp(status);

                  return (
                    <li
                      key={p.id}
                      className="bg-white p-4 rounded-md shadow relative"
                    >
                      <p>
                        <span className="font-semibold">Amount:</span> ₱
                        {parseInt(p.payment).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span> {status}
                      </p>
                      <p>
                        <span className="font-semibold">Date Issued:</span>{" "}
                        {new Date(p.date_issued).toLocaleDateString()}
                      </p>

                      {stamp && (
                        <img
                          src={stamp}
                          alt={status}
                          className="absolute top-2 right-2 w-20 opacity-80"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-slate-500 mt-32">Loading...</p>
      )}
    </div>
  );
}

export default Info;
