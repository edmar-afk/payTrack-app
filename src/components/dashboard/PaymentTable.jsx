/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditModal from "../EditModal";
import api from "../../assets/api";
import ViewProof from "./ViewProof";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";

function PaymentTable() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/api/payments/");
      setPayments(res.data);
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch payments.", "error");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = (paymentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/api/payments/delete/${paymentId}/`) // ✅ meaningful URL
          .then(() => {
            setPayments((prev) => prev.filter((p) => p.id !== paymentId));
            Swal.fire("Deleted!", "The payment has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire(
              "Error!",
              "There was an error deleting the payment.",
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      <p className="mt-12 font-bold mb-6">
        List of Students who submitted their Payments
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
                Payment Type
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Amount
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
                <td colSpan="9" className="p-4 text-center text-slate-500">
                  No payments submitted yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4 text-[15px] text-slate-900 font-medium">
                      {p.student?.first_name}
                    </td>
                    <td className="p-4 text-[15px] text-slate-600 font-medium">
                      {p.student?.profile?.year_lvl || "N/A"}
                    </td>
                    <td className="p-4 text-[15px] text-slate-600 font-medium">
                      {p.student?.profile?.course || "N/A"}
                    </td>
                    <td className="p-4 text-[15px] text-slate-600 font-medium">
                      {p.comittee_name || "No status yet"}
                    </td>

                    <td className="p-4 text-[15px] text-slate-600 font-medium">
                      {p.amount && !isNaN(Number(p.amount))
                        ? Number(p.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "N/A"}
                    </td>
                    <td className="p-4 text-[15px] text-slate-600 font-medium">
                      <ViewProof
                        student={p.student?.first_name}
                        imageUrl={p.proof}
                      />
                    </td>
                    <td className="p-4 text-[15px] text-slate-600 font-medium cursor-pointer">
                      {p.feedback ? (
                        <Tooltip title={p.feedback} arrow placement="top">
                          <span>{p.status || "No status yet"}</span>
                        </Tooltip>
                      ) : (
                        "No feedback yet"
                      )}
                    </td>

                    <td className="p-4 text-[15px] text-slate-600 font-medium">
                      {p.date_issued
                        ? new Date(p.date_issued).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="mr-3 cursor-pointer" title="Edit">
                          <EditModal
                            paymentId={p.id}
                            onFeedbackSaved={fetchPayments}
                          />
                        </div>
                        <div
                          className="cursor-pointer text-red-500"
                          title="Delete"
                          onClick={() => handleDelete(p.id)}
                        >
                          <DeleteOutlineIcon />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PaymentTable;
