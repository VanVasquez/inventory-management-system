import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Copyright from "../../components/Copyright";

const LogIn = () => {
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = values.email;
    const password = values.pass;
    try {
      setError("");
      setLoading(true);
      const res = await login({ email, password });
      const [user] = res.data.results;
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            LOG IN
          </Typography>
          {error && (
            <Alert severity="warning" sx={{ background: "none" }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate={false}
            sx={{ mt: 1 }}
          >
            <TextField
              color="secondary"
              margin="normal"
              required
              fullWidth
              type="email"
              label="Email Address"
              autoComplete="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              autoFocus
            />
            <TextField
              color="secondary"
              margin="normal"
              required
              fullWidth
              label="Password"
              onChange={(e) => setValues({ ...values, pass: e.target.value })}
              type={showPassword ? "text" : "password"}
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />{" "}
      </Container>
    </>
  );
};

export default LogIn;
