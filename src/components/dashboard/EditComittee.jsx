import { useState } from "react";
import { Modal, Box, TextField, Button, InputAdornment } from "@mui/material";
import api from "../../assets/api";
import BorderColorIcon from "@mui/icons-material/BorderColor";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

function EditComittee({ committee, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: committee?.name || "",
    details: committee?.details || "",
    amount: committee?.amount || "",
    deadline: committee?.deadline || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/api/committee/update/${committee.id}/`, form);
      onUpdated();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <BorderColorIcon fontSize="small" className="text-blue-600" />
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <h2 className="text-lg font-bold mb-4">Edit Committee</h2>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={{ display: "none" }} // hides it visually
          />

          <TextField
            fullWidth
            label="Details"
            name="details"
            value={form.details}
            onChange={handleChange}
            className="mb-4"
            style={{ marginBottom: 24 }}
          />

          <TextField
            fullWidth
            label="Amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₱</InputAdornment>
              ),
            }}
            className="mb-4"
            style={{ marginBottom: 24 }}
          />

          <TextField
            fullWidth
            type="date"
            label="Deadline"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            className="mb-4"
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default EditComittee;
