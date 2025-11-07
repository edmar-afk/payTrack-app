import React from "react";

function FilterPayment({ semester, setSemester, schoolYear, setSchoolYear }) {
  return (
    <>
      <p className="mt-4">Filter Payments</p>
      <div className="flex gap-3 mt-4 z-50">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border rounded-md p-2 bg-white text-sm"
        >
          <option value="First Semester">First Semester</option>
          <option value="Second Semester">Second Semester</option>
        </select>

        <select
          value={schoolYear}
          onChange={(e) => setSchoolYear(e.target.value)}
          className="border rounded-md p-2 bg-white text-sm"
        >
          <option value="2025-2026">2025-2026</option>
          <option value="2024-2025">2026-2027</option>
          <option value="2023-2024">2027-2028</option>
        </select>
      </div>
    </>
  );
}

export default FilterPayment;
