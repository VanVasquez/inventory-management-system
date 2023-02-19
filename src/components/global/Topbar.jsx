import { Box, Button, IconButton, Menu, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { MenuItem } from "react-pro-sidebar";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuth();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
    const storedData = localStorage.getItem("user");
    if (storedData) setUser(JSON.parse(storedData));
    setLoading(false);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onlogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/** ADD // EDIT // DELETE */}
      <Box>
        <Typography variant="h6">
          {user.user_firstname + " " + user.user_lastname}
        </Typography>
      </Box>
      <Box display="flex">
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <PersonOutlinedIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={handleClose}
              style={{ backgroundColor: "white" }}
            >
              <Typography
                style={{
                  padding: "0 8px 0 8px",
                }}
              >
                <Button onClick={onlogout}>Log Out</Button>
              </Typography>
            </MenuItem>
          </Menu>
        </div>
      </Box>
    </Box>
  );
};

export default Topbar;
