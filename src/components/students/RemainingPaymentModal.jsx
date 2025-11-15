import { useState } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../assets/api";
import DoneAllIcon from "@mui/icons-material/DoneAll";
function RemainingPaymentModal({ payment, schoolyear, semesters }) {
  const [open, setOpen] = useState(false);
  const limits = { cf: 100, lac: 100, pta: 150, qaa: 100, rhc: 100 };
  const [form, setForm] = useState({
    cf: 0,
    lac: 0,
    pta: 0,
    qaa: 0,
    rhc: 0,
  });

  const [proof, setProof] = useState(null);
  const [preview, setPreview] = useState(null);

  const remaining = {
    cf: limits.cf - (payment.cf || 0),
    lac: limits.lac - (payment.lac || 0),
    pta: limits.pta - (payment.pta || 0),
    qaa: limits.qaa - (payment.qaa || 0),
    rhc: limits.rhc - (payment.rhc || 0),
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProof(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setProof(null);
    setPreview(null);
  };

  const submitRemaining = async () => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });
    if (proof) {
      formData.append("proofs", proof);
    }

    await api.put(`/api/update_payment/${payment.id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (proof) {
      const proofData = new FormData();
      proofData.append("proof", proof);
      await api.post(`/api/payments/${payment.id}/upload-proof/`, proofData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    window.location.reload();
  };

  const handleChange = (key, value) => {
    const val = Number(value);
    const maxVal = limits[key] - (payment[key] || 0);
    setForm((prev) => ({
      ...prev,
      [key]: val > maxVal ? maxVal : val,
    }));
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-800 text-white py-1 px-4 rounded-lg mt-2 cursor-pointer hover:scale-105 duration-300"
      >
        Pay Remaining Balance
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            width: 350,
            mx: "auto",
            mt: 4, // margin from top
            mb: 4, // optional bottom margin
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <p className="text-sm font-bold">
            Pay your Remaining Fees for School Year {schoolyear} - {semesters}
          </p>

          {Object.keys(remaining).map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="font-light text-sm">
                {key.toUpperCase()} Remaining: ₱{remaining[key]}{" "}
                {remaining[key] === 0 && (
                  <span className="text-green-600 font-medium ml-1">
                    <DoneAllIcon className="inline mb-0.5" /> Paid
                  </span>
                )}
              </label>

              {remaining[key] !== 0 && (
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  min="0"
                  max={remaining[key]}
                  className="border border-gray-300 rounded p-2 text-sm"
                />
              )}
            </div>
          ))}

          {/* Image upload field */}
          {Object.values(remaining).some((val) => val !== 0) && (
            <div className="flex flex-col gap-1">
              <label className="font-light text-sm">Upload Payment Proof</label>
              {preview ? (
                <div className="relative w-full h-40 border border-gray-300 rounded overflow-hidden">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-44 object-contain"
                  />
                  <IconButton
                    size="small"
                    onClick={removeFile}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border border-gray-300 rounded p-2 text-sm"
                />
              )}
            </div>
          )}

          <Button
            variant="contained"
            onClick={submitRemaining}
            disabled={!proof}
            sx={{
              bgcolor: !proof ? "red" : "green",
              "&:hover": {
                bgcolor: !proof ? "red" : "darkgreen",
              },
            }}
          >
            Submit Payment
          </Button>

          <Button variant="outlined" onClick={() => setOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default RemainingPaymentModal;
