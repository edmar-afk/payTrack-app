import { useState } from "react";
import { Box, Button, Modal, TextField, InputAdornment } from "@mui/material";
import api from "../../assets/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function AddPayment({ name, onSaved }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const formatAmount = (value) => {
    const num = value.replace(/,/g, "").replace(/\D/g, "");
    if (!num) return "";
    return parseInt(num, 10).toLocaleString("en-US");
  };

  const handleAmountChange = (e) => {
    setAmount(formatAmount(e.target.value));
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: name,
        details: details,
        amount: amount.replace(/,/g, ""),
        deadline: deadline,
      };
      await api.post("/api/committees/post/", payload);
      handleClose();
      if (onSaved) onSaved(); // refresh parent table
    } catch (err) {
      console.error("Error saving committee:", err);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Add Payment
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h2 className="mb-4 font-bold text-lg">Add {name} Payment</h2>
          <Box className="flex flex-col gap-4">
            <TextField
              label="Details(Optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              fullWidth
              multiline
              placeholder="Put any description below."
              rows={3}
            />
            <TextField
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Box className="flex justify-end gap-2">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default AddPayment;
