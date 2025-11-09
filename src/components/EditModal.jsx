/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Modal,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Swal from "sweetalert2";
import api from "../assets/api";

function EditModal({ paymentId, onFeedbackSaved }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [feedback, setFeedback] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const handleOpen = async () => {
    try {
      const res = await api.get(`/api/payments/${paymentId}/`);
      const payment = res.data;

      setStatus(payment.status || "Pending");
      setFeedback(payment.feedback || "");
      setPaymentType(payment.comittee_name || "");
      setPaymentNumber(
        payment.amount
          ? payment.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : ""
      );

      setOpen(true);
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch payment details.", "error");
    }
  };

  const handleClose = () => setOpen(false);

  const handleNumberChange = (e) => {
    let value = e.target.value.replace(/,/g, "");
    if (!isNaN(value)) {
      setPaymentNumber(value.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
  };

  const handleSave = async () => {
    try {
      await api.patch(`/api/payments/${paymentId}/edit/`, {
        status,
        feedback,
        comittee_name: paymentType || null,
        amount: paymentNumber ? paymentNumber.replace(/,/g, "") : null,
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Payment details have been updated.",
        confirmButtonColor: "#3085d6",
      });

      if (onFeedbackSaved) onFeedbackSaved(); // ✅ refresh the payment table
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update payment. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="hover:scale-110 duration-300 cursor-pointer"
      >
        <EditSquareIcon className="text-blue-600" />
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 className="text-lg font-semibold">Edit Payment</h2>

          {/* Status */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Accepted">Accepted</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          {/* Feedback */}
          <TextField
            fullWidth
            label="Feedback"
            placeholder="e.g. Payment declined due to incorrect details"
            variant="outlined"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
            multiline
            minRows={2}
          />

          {/* Payment Number */}
          {/* <TextField
            fullWidth
            label="Payment Amount"
            placeholder="Enter amount"
            value={paymentNumber}
            onChange={handleNumberChange}
            sx={{ mt: 2 }}
          /> */}

          {/* Payment Type */}
          {/* <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Payment Type</InputLabel>
            <Select
              value={paymentType}
              label="Payment Type"
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="PTA">PTA</MenuItem>
              <MenuItem value="QAA">QAA</MenuItem>
              <MenuItem value="LAC">LAC</MenuItem>
              <MenuItem value="CF">CF</MenuItem>
              <MenuItem value="RHC">RHC</MenuItem>
            </Select>
          </FormControl> */}

          {/* Action Buttons */}
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default EditModal;
