import { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import EditModal from "../EditModal";
import AddPayment from "./AddPayment";
import api from "../../assets/api";
import EditComittee from "./EditComittee";
import Swal from "sweetalert2";

function Table({ type }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    if (type !== "Dashboard") {
      try {
        setLoading(true);
        const res = await api.get(`/api/payments/list/${type}/`);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const getDeadlineStatus = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return <span className="text-red-600 font-semibold">Deadline Ended</span>;
    if (diffDays === 0)
      return (
        <span className="text-yellow-600 font-semibold">Deadline Today</span>
      );
    return (
      <span className="text-green-600 font-medium">
        {diffDays} day{diffDays > 1 ? "s" : ""} left
      </span>
    );
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Deleting this committee will also remove all related payments.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/committee/delete/${id}/`);
          fetchPayments();
          Swal.fire(
            "Deleted!",
            "Committee and payments have been removed.",
            "success"
          );
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <>
      <div className="flex flex-row items-center justify-between mt-12 mb-6">
        <p className="font-bold">
          {type === "Dashboard"
            ? "Recent Payment Info"
            : `${type} Payment Info`}
        </p>
        <AddPayment name={type} onSaved={fetchPayments} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900"></th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Details
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Amount
              </th>
              <th className="p-4 text-left text-[13px] font-semibold text-slate-900">
                Deadline
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
                  colSpan={type !== "Dashboard" ? 5 : 4}
                  className="p-6 text-center text-slate-500 text-sm"
                >
                  No data available
                </td>
              </tr>
            ) : (
              payments.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 text-[15px] text-slate-900 font-medium">
                    <Link to={`/comittee/${item.id}/${type}`}> View</Link>
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {item.details || "-"}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    ₱{Number(item.amount).toLocaleString()}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    <div className="flex-col">
                      <p> {item.deadline}</p>
                      <p className="text-xs"> {getDeadlineStatus(item.deadline)}</p>
                    </div>
                  </td>
                  {type !== "Dashboard" && (
                    <td className="p-4">
                      <div className="flex items-center">
                        <div
                          className="mr-3 cursor-pointer"
                          title="Edit Committee"
                        >
                          <EditComittee
                            committee={item}
                            onUpdated={fetchPayments}
                          />
                        </div>
                        <button
                          title="Delete"
                          className="cursor-pointer"
                          onClick={() => handleDelete(item.id)}
                        >
                          <DeleteOutlineIcon className="text-red-600 hover:scale-110 duration-300" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
