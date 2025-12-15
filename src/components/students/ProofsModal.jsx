import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import api from "../../assets/api";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

function ProofsModal({ paymentId }) {
  const [open, setOpen] = useState(false);
  const [mainProofs, setMainProofs] = useState([]);
  const [extraProofs, setExtraProofs] = useState([]);
  const [isWalkIn, setIsWalkIn] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!paymentId || !open) return;

    api.get(`/api/payments/${paymentId}/`).then((res) => {
      const d = res.data;
      setIsWalkIn(d.is_walk_in);
      setMainProofs(d.proof ? [{ id: d.id, proof: d.proof }] : []);
    });

    api.get(`/api/payment/${paymentId}/proofs/`).then((res) => {
      setExtraProofs(
        Array.isArray(res.data)
          ? res.data.map((p) => ({ id: p.id, proof: p.proof }))
          : []
      );
    });
  }, [paymentId, open]);

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
        <Box className="bg-white rounded-2xl shadow-xl w-11/12 max-w-lg p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <p className="font-semibold mt-5">Payment Proof</p>

            {isWalkIn && mainProofs.length === 0 ? (
              <p className="text-gray-500 flex flex-col items-center px-8 text-center text-xl">
                <DirectionsWalkIcon
                  fontSize="large"
                  className="text-gray-800"
                />
                This is a Walk-In Student Payment Submission. No proof needed.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {mainProofs.map((p) => (
                  <div
                    key={p.id}
                    className="border p-2 rounded-lg h-72 overflow-y-auto"
                  >
                    <img src={p.proof} className="w-full object-contain" />
                  </div>
                ))}
              </div>
            )}

            {extraProofs.length > 0 && (
              <>
                <p className="font-semibold mt-3">Additional Payment Proofs</p>
                <div className="flex flex-row flex-wrap gap-3">
                  {extraProofs.map((p) => (
                    <img
                      key={p.id}
                      src={p.proof}
                      className="max-h-40 object-contain"
                    />
                  ))}
                </div>
              </>
            )}

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
