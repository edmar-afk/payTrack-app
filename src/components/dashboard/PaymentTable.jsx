/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditModal from "../EditModal";
import api from "../../assets/api";
import Swal from "sweetalert2";
import CommitteesModal from "./CommitteesModal";
import ProofsModal from "../students/ProofsModal";
import Search from "../Search";
import PrintSummaryModal from "./PrintSummaryModal";

function PaymentTable() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");

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
          .delete(`/api/payments/delete/${paymentId}/`)
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

  const filteredPayments = payments.filter((p) => {
    const student = p.student?.first_name?.toLowerCase() || "";
    const year = p.student?.profile?.year_lvl?.toLowerCase() || "";
    const course = p.student?.profile?.course?.toLowerCase() || "";
    const status = p.status?.toLowerCase() || "";
    const sem = p.semester?.toLowerCase() || "";
    const sy = p.school_year?.toLowerCase() || "";

    const matchesSearch =
      student.includes(searchTerm.toLowerCase()) ||
      year.includes(searchTerm.toLowerCase()) ||
      course.includes(searchTerm.toLowerCase()) ||
      status.includes(searchTerm.toLowerCase()) ||
      sem.includes(searchTerm.toLowerCase()) ||
      sy.includes(searchTerm.toLowerCase());

    const matchesSemester = selectedSemester
      ? sem === selectedSemester.toLowerCase()
      : true;
    const matchesSchoolYear = selectedSchoolYear
      ? sy === selectedSchoolYear.toLowerCase()
      : true;

    return matchesSearch && matchesSemester && matchesSchoolYear;
  });

  const schoolYears = [
    ...new Set(payments.map((p) => p.school_year).filter(Boolean)),
  ];

  return (
    <>
      <p className="mt-12 font-bold mb-6">
        List of Students who submitted their Payments
      </p>
      <div className="flex flex-row items-center justify-between mb-4 space-x-2">
        <Search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">All Semesters</option>
          <option value="First Semester">First Semester</option>
          <option value="2026-2027">Second Semester</option>
        </select>

        <select
          value={selectedSchoolYear}
          onChange={(e) => setSelectedSchoolYear(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">All School Years</option>
          <option value="2025-2026">2025-2026</option>
          <option value="2026-2027">2026-2027</option>
          <option value="2027-2028">2027-2028</option>
        </select>

        <PrintSummaryModal />
      </div>

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
                School Year - Semester
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
            {filteredPayments.length === 0 && searchTerm !== "" ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-slate-500">
                  No results found for '{searchTerm}'
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-slate-500">
                  No payments submitted yet.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
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
                    {p.school_year || "N/A"} - {p.semester || "N/A"}
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    <CommitteesModal paymentId={p.id} />
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    <ProofsModal paymentId={p.id} />
                  </td>
                  <td className="p-4 text-[15px] text-slate-600 font-medium">
                    {p.status}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PaymentTable;
