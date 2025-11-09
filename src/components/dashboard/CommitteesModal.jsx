import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import api from "../../assets/api";

function CommitteesModal({ paymentId }) {
  const [open, setOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (open) {
      api.get(`/api/payments/${paymentId}/`).then((res) => {
        setPaymentData(res.data);
      });
    }
  }, [open]);

  const limits = {
    cf: 100,
    lac: 100,
    pta: 150,
    qaa: 100,
    rhc: 100,
  };

  const committees = [
    { label: "CF", key: "cf" },
    { label: "LAC", key: "lac" },
    { label: "PTA", key: "pta" },
    { label: "QAA", key: "qaa" },
    { label: "RHC", key: "rhc" },
  ];

  return (
    <div>
      <button onClick={() => setOpen(true)}>View</button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            width: 350,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Payment Statistics
          </Typography>

          {paymentData && (
            <div className="flex flex-col gap-4 mb-8">
              {committees.map((item, idx) => {
                const paid = Number(paymentData[item.key]) || 0;
                const limit = limits[item.key];
                const remaining = Math.max(limit - paid, 0);
                const isPaid = paid >= limit;

                return (
                  <div
                    key={idx}
                    className="flex items-center bg-white border rounded-sm overflow-hidden shadow"
                  >
                    <div className="p-4 bg-green-800 text-white text-xl font-bold w-24 text-center">
                      {item.label}
                    </div>

                    <div className="px-4 text-gray-700 w-full">
                      {!isPaid && (
                        <div className="flex flex-row items-center">
                          <p className="text-md font-bold text-red-600 text-xs">
                            ₱ {remaining.toFixed(2)}
                          </p>
                          <p className="text-xs font-bold ml-1 text-red-600">
                            Remaining
                          </p>
                        </div>
                      )}

                      {isPaid && (
                        <p className="text-green-600 text-xs font-bold mt-1">
                          Fully Paid ✅
                        </p>
                      )}

                      <div className="flex flex-col text-sm">
                        <div className="flex flex-row items-end">
                          <p className="text-xl font-bold">
                            ₱ {paid.toFixed(2)} Sent
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Button variant="contained" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default CommitteesModal;
