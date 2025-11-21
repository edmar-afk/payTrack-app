import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import api from "../../assets/api";
import { getUserInfoFromToken } from "../../utils/auth";

function SummaryModal() {
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (open) {
      const token = localStorage.getItem("access");
      const userInfo = getUserInfoFromToken(token);
      if (userInfo?.id) {
        api
          .get(`/api/student-payments/${userInfo.id}/`)
          .then((res) => setPayments(res.data))
          .catch((err) => console.error(err));
      }
    }
  }, [open]);

  return (
    <div>
      <Button variant="contained" color="success" onClick={handleOpen}>
        Open Summary
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            className="text-xl font-bold mb-4"
          >
            Payment Summary
          </Typography>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Date Submitted</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Semester</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Payment Method</th>
                  <th className="border px-4 py-2">CF</th>
                  <th className="border px-4 py-2">LAC</th>
                  <th className="border px-4 py-2">PTA</th>
                  <th className="border px-4 py-2">QAA</th>
                  <th className="border px-4 py-2">RHC</th>
                  <th className="border px-4 py-2">Proofs</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {new Date(p.date_issued).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      ₱
                      {(
                        +(p.cf || 0) +
                        +(p.lac || 0) +
                        +(p.pta || 0) +
                        +(p.qaa || 0) +
                        +(p.rhc || 0)
                      ).toLocaleString()}
                    </td>

                    <td className="border px-4 py-2">{p.semester || "-"}</td>
                    <td className="border px-4 py-2">{p.status}</td>
                    <td className="border px-4 py-2">
                      {p.payment || "Walk-In"}
                    </td>
                    <td className="border px-4 py-2">₱ {p.cf || "-"}</td>
                    <td className="border px-4 py-2">₱ {p.lac || "-"}</td>
                    <td className="border px-4 py-2">₱ {p.pta || "-"}</td>
                    <td className="border px-4 py-2">₱ {p.qaa || "-"}</td>
                    <td className="border px-4 py-2">₱ {p.rhc || "-"}</td>
                    <td className="border px-4 py-2">
                      {p.proofs && p.proofs.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {p.proofs.map((proof) => (
                            <img
                              key={proof.id}
                              src={proof.proof}
                              alt="Proof"
                              className="w-16 h-16 object-cover border"
                            />
                          ))}
                        </div>
                      ) : (
                        <span>No Proof</span>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-4">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Button variant="contained" onClick={handleClose} sx={{ mt: 4 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default SummaryModal;
