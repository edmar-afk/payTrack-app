import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Autocomplete,
  MenuItem,
  Grid,
} from "@mui/material";
import api from "../../assets/api";

function WalkInModal() {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    proof: null,
    payment: "",
    semester: "",
    school_year: "",
    cf: "",
    lac: "",
    pta: "",
    qaa: "",
    rhc: "",
  });

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
      .then(() => setOpen(false))
      .catch((err) => console.log(err.response?.data));
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
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Semester"
                fullWidth
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              >
                <MenuItem value="1st Semester">1st Semester</MenuItem>
                <MenuItem value="2nd Semester">2nd Semester</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Year"
                type="text"
                value={formData.school_year}
                onChange={(e) =>
                  setFormData({ ...formData, school_year: e.target.value })
                }
              />
            </Grid>

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
            disabled={!selectedUser}
            sx={{ mt: 2 }}
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
