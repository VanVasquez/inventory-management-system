import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import Header from "../../components/Header";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getAllUser } from "../../api/axios";
import { useNavigate } from "react-router-dom";
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getAll = async () => {
      const data = await getAllUser();
      const user = data.data;

      setLoading(false);
      setRows(user);
    };

    getAll();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  const columns = [
    { field: "  ", headerName: " ", sortable: false },
    {
      field: "user_lastname",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "user_firstname",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "user_email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "user_role",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { user_role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              user_role === "admin" ? colors.grey[500] : colors.grey[600]
            }
            borderRadius="4px"
          >
            {user_role === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {user_role === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {user_role}
            </Typography>
          </Box>
        );
      },
    },
  ];
  const addTeam = () => {
    navigate("/signup");
  };
  return (
    <Box m={"0 20px 0 20px"}>
      <Typography
        variant="h2"
        color={colors.grey[900]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        MY TEAM
      </Typography>
      <Button sx={{ color: `${colors.greenAccent[100]}` }} onClick={addTeam}>
        Add new member
      </Button>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[900],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.user_id}
          rows={rows}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Team;
