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
  const [reason, setReason] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (event) => setStatus(event.target.value);

  const handleSave = async () => {
    try {
      const response = await api.post(`/api/payments/${paymentId}/feedback/`, {
        status: status,
        feedback: reason,
      });

      Swal.fire({
        icon: "success",
        title: "Feedback Saved",
        text: "The payment status and feedback have been updated.",
        timer: 2000,
        showConfirmButton: false,
      });

      if (onFeedbackSaved) {
        onFeedbackSaved(response.data); // notify parent to refresh table if needed
      }

      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Failed to save feedback.",
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
          <h2 className="text-lg font-semibold">Edit Payment Status</h2>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={handleChange}>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Decline">Decline</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Reason (Optional)"
            placeholder="e.g. Declined due to incorrect payment details"
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 2 }}
            multiline
            minRows={2}
          />
          <p className="text-xs text-orange-600 pt-1">
            Enter the reason for this status so students will know.
          </p>

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
