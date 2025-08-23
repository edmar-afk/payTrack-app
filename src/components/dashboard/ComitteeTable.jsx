import { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditModal from "../EditModal";
import { useParams } from "react-router-dom";
import api from "../../assets/api";
import ViewProof from "./ViewProof";
import { Tooltip } from "@mui/material";

function ComitteeTable() {
  const { id, name } = useParams();
  const [payments, setPayments] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});

  useEffect(() => {
    api
      .get(`/api/committee/${id}/${name}/payments/`)
      .then((res) => {
        setPayments(res.data.payments);

        // Fetch latest feedback for each payment
        res.data.payments.forEach((p) => {
          api
            .get(`/api/payments/${p.id}/latest-feedback/`)
            .then((res2) => {
              setFeedbacks((prev) => ({
                ...prev,
                [p.id]: res2.data,
              }));
            })
            .catch(() => {
              setFeedbacks((prev) => ({
                ...prev,
                [p.id]: null,
              }));
            });
        });
      })
      .catch(() => setPayments([]));
  }, [id, name]);

  return (
    <>
      <p className="mt-12 font-bold mb-6">
        List of Students who submitted credentials for {name} Payment
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Student
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Year Level
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Course
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Payment
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Receipt
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Status
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Date Issued
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="whitespace-nowrap">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-slate-500">
                  No payments submitted yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 text-[15px] text-slate-900 font-medium">
                    {p.student.last_name}, {p.student.first_name}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {p.student.year_lvl}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {p.student.course}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {p.payment}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    <ViewProof
                      student={{
                        first_name: p.student.first_name,
                        last_name: p.student.last_name,
                      }}
                      imageUrl={p.proof}
                    />
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium cursor-pointer">
                    {feedbacks[p.id] ? (
                      <Tooltip
                        title={feedbacks[p.id].feedback || ""}
                        arrow
                        placement="top"
                      >
                        <span>{feedbacks[p.id].status}</span>
                      </Tooltip>
                    ) : (
                      "No feedback yet"
                    )}
                  </td>

                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {p.date_issued
                      ? new Date(p.date_issued)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          .replace(/,/g, "") // removes the comma after month
                      : ""}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="mr-3 cursor-pointer" title="Edit">
                        <EditModal
                          paymentId={p.id}
                          onFeedbackSaved={(newFeedback) => {
                            setFeedbacks((prev) => ({
                              ...prev,
                              [p.id]: newFeedback, // instantly update latest feedback for this payment
                            }));
                          }}
                        />
                      </div>
                      <div
                        className="cursor-pointer text-red-500"
                        title="Delete"
                      >
                        <DeleteOutlineIcon />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ComitteeTable;
