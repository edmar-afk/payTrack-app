/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditModal from "../EditModal";
import api from "../../assets/api";
import Swal from "sweetalert2";

function Table({ type }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get(`/api/payment-type/${type}/`);
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        Swal.fire("Error", "Failed to fetch payments", "error");
      } finally {
        setLoading(false);
      }
    };

    if (type) fetchPayments();
  }, [type]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 whitespace-nowrap">
          <tr>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Student
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Comittee
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Amount
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Semester
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Status
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Feedback
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Payment
            </th>
            <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
              Date Issued
            </th>
            {type !== "Dashboard" && (
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="whitespace-nowrap">
          {payments.length === 0 ? (
            <tr>
              <td
                colSpan={type !== "Dashboard" ? 9 : 8}
                className="p-6 text-center text-slate-500 text-sm"
              >
                No data available
              </td>
            </tr>
          ) : (
            payments.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 text-[15px] text-slate-900 font-medium">
                  {item.student?.first_name || "N/A"}
                </td>
                <td className="p-4 text-[15px] text-slate-600 font-medium">
                  {item.comittee_name || "N/A"}
                </td>
                <td className="p-4 text-[15px] text-slate-600 font-medium">
                  ₱{parseInt(item.amount || 0).toLocaleString()}
                </td>
                <td className="p-4 text-[15px] text-slate-600 font-medium">
                  {item.semester || "N/A"}
                </td>
                <td className="p-4 text-[15px] text-slate-600 font-medium">
                  {item.status || "Pending"}
                </td>
                <td className="p-4 text-[15px] text-slate-600 font-medium">
                  {item.feedback || "N/A"}
                </td>
                <td className="p-4 text-[15px] text-slate-600 font-medium">
                  {item.payment || "N/A"}
                </td>
                <td className="p-4 text-[15px] text-slate-600 font-medium">
                  {item.date_issued
                    ? new Date(item.date_issued).toLocaleDateString()
                    : "N/A"}
                </td>
                {type !== "Dashboard" && (
                  <td className="p-4 text-[15px] text-slate-600 font-medium flex gap-2">
                    <EditModal
                      paymentId={item.id}
                      onFeedbackSaved={fetchPayments}
                    />
                    <DeleteOutlineIcon
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, delete it!",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            try {
                              await api.delete(`/payments/delete/${item.id}/`);
                              setPayments(
                                payments.filter((p) => p.id !== item.id)
                              );
                              Swal.fire(
                                "Deleted!",
                                "Payment has been deleted.",
                                "success"
                              );
                            } catch (error) {
                              Swal.fire(
                                "Error",
                                "Failed to delete payment",
                                "error"
                              );
                            }
                          }
                        });
                      }}
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
