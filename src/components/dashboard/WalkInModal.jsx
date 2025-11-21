import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Autocomplete,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import api from "../../assets/api";
import Swal from "sweetalert2";
function WalkInModal() {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    proof: null,
    payment: "",
    semester: "1st Semester",
    school_year: "2025-2026",
    cf: "",
    lac: "",
    pta: "",
    qaa: "",
    rhc: "",
    is_walk_in: true,
  });

  const isFormValid =
    selectedUser &&
    formData.semester &&
    formData.school_year &&
    formData.cf &&
    formData.lac &&
    formData.pta &&
    formData.qaa &&
    formData.rhc;

  useEffect(() => {
    api.get("/api/students/").then((res) => setStudents(res.data));
  }, []);

  const handleSubmit = () => {
    if (!selectedUser) return;

    const data = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== "") data.append(k, v);
    });

    api
      .post(`/api/submit-payment/${selectedUser.id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Payment Submitted",
          text: "The walk-in payment was successfully submitted.",
          confirmButtonColor: "#3085d6",
        });
        setOpen(false);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: err.response?.data?.message || "Something went wrong.",
          confirmButtonColor: "#d33",
        });
      });
  };

  const maxLimits = {
    cf: 100,
    lac: 100,
    pta: 150,
    qaa: 100,
    rhc: 100,
  };

  const handleNumberChange = (field, value) => {
    const num = Number(value);
    const max = maxLimits[field];

    if (num >= max) {
      setFormData({ ...formData, [field]: max.toString() });
    } else if (num < 0) {
      setFormData({ ...formData, [field]: "0" });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <div>
      <p onClick={() => setOpen(true)}>Walk-In Student</p>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 4,
            bgcolor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 350, md: 600 },
            borderRadius: 2,
          }}
        >
          <h2 className="mb-4 text-lg font-bold">
            Submit Payment for Walk-In Student
          </h2>

          <Autocomplete
            options={students}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name} (${
                option.profile?.course || ""
              })`
            }
            value={selectedUser}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Student"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
          />

          <Grid container spacing={2}>
            <div className="flex flex-row items-center justify-evenly gap-4 w-full">
              <div className="flex flex-col flex-1">
                <label>Semester</label>
                <select
                  className="border border-gray-400 py-4 px-3 w-full"
                  name="semester"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                >
                  <option value="First Semester">1st Semester</option>
                  <option value="Second Semester">2nd Semester</option>
                </select>
              </div>

              <div className="flex flex-col flex-1">
                <label>School Year</label>
                <select
                  className="border border-gray-400 py-4 px-3 w-full"
                  name="school_year"
                  value={formData.school_year}
                  onChange={(e) =>
                    setFormData({ ...formData, school_year: e.target.value })
                  }
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                </select>
              </div>
            </div>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="CF Payment"
                value={formData.cf}
                onChange={(e) => handleNumberChange("cf", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="LAC Payment"
                value={formData.lac}
                onChange={(e) => handleNumberChange("lac", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="PTA Payment"
                value={formData.pta}
                onChange={(e) => handleNumberChange("pta", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="QAA Payment"
                value={formData.qaa}
                onChange={(e) => handleNumberChange("qaa", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="RHC Payment"
                value={formData.rhc}
                onChange={(e) => handleNumberChange("rhc", e.target.value)}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!isFormValid}
            sx={{
              mt: 2,
              bgcolor: !isFormValid ? "red" : undefined,
              "&:hover": {
                bgcolor: !isFormValid ? "darkred" : undefined,
              },
            }}
          >
            Submit Payment
          </Button>

          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default WalkInModal;
