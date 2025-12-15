import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import api from "../assets/api";

function PaymentDetailsModal({ open, onClose, title, count }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchPayments = async () => {
        setLoading(true);
        try {
          const committee = title.toLowerCase();
          const response = await api.get(`/api/payments/${committee}/`);
          setPayments(response.data);
        } catch (error) {
          console.error("Error fetching payments:", error);
          setPayments([]);
        } finally {
          setLoading(false);
        }
      };
      fetchPayments();
    }
  }, [open, title]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: "80%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {title} Payment Details
        </Typography>

        <Typography sx={{ mb: 2 }}>
          {count} students have paid for this committee.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>School Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.student.first_name} {p.student.last_name}
                    </TableCell>
                    <TableCell>₱ {p[title.toLowerCase()] || "N/A"}</TableCell>

                    <TableCell>{p.semester || "N/A"}</TableCell>
                    <TableCell>{p.school_year || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <button
          className="mt-4 bg-gray-900 text-white py-3 px-8 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      </Box>
    </Modal>
  );
}

export default PaymentDetailsModal;
