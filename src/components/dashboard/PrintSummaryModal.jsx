import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import api from "../../assets/api";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

function PrintSummaryModal() {
  const [open, setOpen] = useState(false);
  const [semester, setSemester] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  const handleGenerate = async () => {
    const response = await api.get(
      `/api/payments/print/?semester=${semester}&school_year=${schoolYear}`,
      { responseType: "blob" }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  return (
    <>
      <p
        className="bg-green-500 text-white py-3 px-7 rounded-md cursor-pointer hover:scale-110 duration-300 hover:bg-green-800"
        onClick={() => setOpen(true)}
      >
        <LocalPrintshopIcon className="mb-1" /> Print Summary
      </p>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Print Payment Summary
          </Typography>

          <TextField
            select
            fullWidth
            label="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Select Semester</MenuItem>
            <MenuItem value="First Semester">First Semester</MenuItem>
            <MenuItem value="Second Semester">Second Semester</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="School Year"
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            sx={{ mb: 3 }}
          >
            <MenuItem value="">Select School Year</MenuItem>
            <MenuItem value="2025-2026">2025-2026</MenuItem>
            <MenuItem value="2026-2027">2026-2027</MenuItem>
            <MenuItem value="2027-2028">2027-2028</MenuItem>
          </TextField>

          <Button
            fullWidth
            variant="contained"
            onClick={handleGenerate}
            disabled={!semester || !schoolYear}
          >
            Generate PDF
          </Button>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default PrintSummaryModal;
