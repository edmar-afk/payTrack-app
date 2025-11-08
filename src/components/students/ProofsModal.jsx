import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../assets/api";

function ProofsModal({ paymentId }) {
  const [open, setOpen] = useState(false);
  const [mainProofs, setMainProofs] = useState([]);
  const [extraProofs, setExtraProofs] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (paymentId && open) {
      api.get(`/api/payments/${paymentId}/`).then((res) => {
        const d = res.data;
        const mp = d.proof ? [{ id: d.id, proof: d.proof }] : [];
        setMainProofs(mp);
      });

      api.get(`/api/payment/${paymentId}/proofs/`).then((res) => {
        const ep = Array.isArray(res.data)
          ? res.data.map((p) => ({ id: p.id, proof: p.proof }))
          : [];
        setExtraProofs(ep);
      });
    }
  }, [paymentId, open]);
  console.log(extraProofs);
  return (
    <div>
      <button onClick={handleOpen} className="text-blue-700 cursor-pointer">
        View Proofs
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <Box className="bg-white rounded-2xl shadow-xl w-11/12 max-w-lg p-6 relative max-h-[80vh] overflow-y-auto">
          <IconButton onClick={handleClose} className="absolute top-2 right-2">
            <CloseIcon />
          </IconButton>

          <div className="flex flex-col gap-4">
            <Typography variant="h6" className="text-center font-bold">
              Payment Proofs
            </Typography>

            <p className="font-semibold">Payment Proof</p>
            <div className="flex flex-col gap-3">
              {mainProofs.length === 0 ? (
                <p className="text-gray-500 text-sm text-left">
                  No Payment proof.
                </p>
              ) : (
                mainProofs.map((p) => (
                  <div
                    key={p.id}
                    className="border p-2 rounded-lg flex items-center justify-center"
                  >
                    <img src={p.proof} className="max-h-40 object-contain" />
                  </div>
                ))
              )}
            </div>

            <p className="font-semibold mt-3">Additional Payment Proofs</p>
            <div className="flex flex-col gap-3">
              {extraProofs.length === 0 ? (
                <p className="text-gray-500 text-sm text-left">
                  No additional payment proofs.
                </p>
              ) : (
                <div className="flex flex-row flex-wrap gap-3">
                  {extraProofs.map((p) => (
                    <div key={p.id}>
                      <img src={p.proof} className="max-h-40 object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 self-center"
            >
              Close Modal
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ProofsModal;
