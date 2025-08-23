import React, { useState } from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const BASE_URL = import.meta.env.VITE_API_URL;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  outline: "none",
};

function ViewProof({ student, imageUrl }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!student || !imageUrl) return null;

  console.log("imageUrl:", imageUrl);

  return (
    <div>
      <button className="text-blue-600 cursor-pointer" onClick={handleOpen}>
        View Receipt
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              Viewing proof of payment for {student.last_name},{" "}
              {student.first_name}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            component="img"
            src={`${BASE_URL}${imageUrl}`}
            alt={`Proof of ${student.first_name} ${student.last_name}`}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 1,
              objectFit: "contain",
            }}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default ViewProof;
