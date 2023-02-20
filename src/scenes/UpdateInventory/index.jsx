import { useTheme } from "@emotion/react";
import {
  Alert,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import {
  deleteAItem,
  getAllItem,
  updateItem,
  updateToLog,
} from "../../api/axios";

const UpdateInventory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [select, setSelected] = useState({
    id: "",
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity: "",
    sellingPrice: "",
  });
  const [row, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: `${colors.primary[600]}`,
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  useEffect(() => {
    const getItems = async () => {
      await getAllItem().then((res) => {
        setRows(res.data);
      });
    };
    getItems();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name").toUpperCase();
    const brand = data.get("brand").toUpperCase();
    const category = data.get("category").toUpperCase();
    const price = data.get("price");
    const sellPrice = data.get("sellPrice");
    try {
      setError("");
      setLoading(true);
      await updateItem({
        id: select.id,
        name: name === "" ? select.name : name,
        brand: brand === "" ? select.brand : brand,
        category: category === "" ? select.category : category,
        price: price === "" ? select.price : price,
        sellingPrice: sellPrice === "" ? select.sellingPrice : sellPrice,
      });
      await updateToLog({
        id: select.id,
        name: name === "" ? select.name : name,
        brand: brand === "" ? select.brand : brand,
        price: price === "" ? select.price : price,
        sellingPrice: sellPrice === "" ? select.sellingPrice : sellPrice,
      });
      const getItems = async () => {
        await getAllItem().then((res) => {
          setRows(res.data);
        });
      };
      getItems();
      setError("");
      handleClose();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "quantity", headerName: "Quantity" },
    { field: "price", headerName: "Price" },
    { field: "sellingPrice", headerName: "Sell Price" },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    { field: "createdAtFormatted", headerName: "Date", flex: 1 },
    { field: "updatedAtFormatted", headerName: "Last Update", flex: 1 },
    {
      field: " ",
      headerName: " ",
      sortable: false,
      renderCell: (params) => {
        const onClick = async (e) => {
          handleOpen();
          e.stopPropagation();
          setSelected(params.row);
        };
        return (
          <Button
            disabled={loading}
            sx={{
              color: ` ${colors.greenAccent[100]}`,
              backgroundColor: `${colors.grey[500]}`,
            }}
            onClick={onClick}
          >
            Edit
          </Button>
        );
      },
    },
  ];
  const deleteItem = () => {
    const id = select.id;
    deleteAItem(id);
    handleClose();
    const getItems = async () => {
      await getAllItem().then((res) => {
        setRows(res.data);
      });
    };
    getItems();
  };
  return (
    <Box m={"0 20px 0 20px"}>
      <Typography
        variant="h2"
        color={colors.grey[900]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        UPDATE INVENTORY
      </Typography>
      <Typography sx={{ color: `${colors.greenAccent[100]}` }}>
        Update your Items
      </Typography>
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
            backgroundColor: "#AC887B",
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
        <DataGrid getRowId={(row) => row.id} rows={row} columns={columns} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h3" component="h3">
              Update Item
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate={false}
              sx={{ mt: 2 }}
            >
              {error && (
                <Alert severity="warning" sx={{ background: "none" }}>
                  {error}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    type="text"
                    id="name"
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    name="brand"
                    label="Brand"
                    type="text"
                    id="brand"
                    color="secondary"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="price"
                    label="price"
                    type="number"
                    id="price"
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="sellPrice"
                    label="Sell Price"
                    type="number"
                    id="sellPrice"
                    color="secondary"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="category"
                    label="Category"
                    type="text"
                    id="category"
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    onClick={deleteItem}
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: `${colors.blueAccent[900]}`,
                    }}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    onClick={handleClose}
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: `${colors.blueAccent[900]}`,
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      background: `${colors.blueAccent[400]}`,
                    }}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default UpdateInventory;
