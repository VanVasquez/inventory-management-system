import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { IconButton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AddHomeIcon from "@mui/icons-material/AddHome";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import StoreIconOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { useMode, tokens } from "../../theme";
import "react-pro-sidebar/dist/css/styles.css";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};
const Sidebar = ({ selectedd }) => {
  const [theme] = useMode();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState();
  const [selected, setSelected] = useState("Profile");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const storedData = localStorage.getItem("user");
    if (storedData) setUser(JSON.parse(storedData));
    setLoading(false);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `#656666 !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          color: "white !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <SidebarHeader>
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    {"Hi " + user.user_lastname}
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
          </SidebarHeader>
          <SidebarContent>
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              {" "}
              {user.user_role === "admin" ? (
                <Item
                  title="Manage Team"
                  to="/teams"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                " "
              )}
            </Box>
          </SidebarContent>
          <SidebarFooter>
            {" "}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              {!isCollapsed && (
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  MY INVENTORY
                </Typography>
              )}
              {user.user_role === "admin" ? (
                <Item
                  title="Add Inventory"
                  to="/add"
                  icon={<AddHomeIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                " "
              )}
              {user.user_role === "admin" ? (
                <Item
                  title="Update Inventory"
                  to="/update"
                  icon={<SystemUpdateAltOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                " "
              )}
              {user.user_role === "user" ? (
                <Item
                  title="Sales"
                  to="/sale"
                  icon={<StoreIconOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                " "
              )}
              {user.user_role === "admin" ? (
                <Item
                  title="Report"
                  to="/report"
                  icon={<AssessmentOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                " "
              )}
            </Box>
          </SidebarFooter>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
