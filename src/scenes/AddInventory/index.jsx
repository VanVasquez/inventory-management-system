import { useTheme } from "@emotion/react";
import {
  Alert,
  Button,
  Grid,
  LinearProgress,
  Modal,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { addItem, addToLog, getAllItem } from "../../api/axios";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
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
];

function CustomPagination() {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
const AddInventory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
    bgcolor: `${colors.primary[800]}`,
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
    const quantity = data.get("quantity");
    const category = data.get("category").toUpperCase();
    const price = data.get("price");
    const sellingPrice = data.get("sellingPrice");
    try {
      setError("");
      setLoading(true);
      await addItem({ name, brand, quantity, category, price, sellingPrice });
      await addToLog({ name, brand, quantity, price, sellingPrice });
      const getItems = async () => {
        await getAllItem().then((res) => {
          setRows(res.data);
        });
      };
      getItems();
      handleClose();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
  return (
    <Box m={"0 20px 0 20px"}>
      <Typography
        variant="h2"
        color={colors.grey[900]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        ADD INVENTORY
      </Typography>
      <Button sx={{ color: `${colors.greenAccent[100]}` }} onClick={handleOpen}>
        Add new Items
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h3">
            Add Item
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
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  type="text"
                  id="name"
                  color="secondary"
                />
              </Grid>{" "}
              <Grid item xs={12} sm={5}>
                <TextField
                  required
                  fullWidth
                  name="brand"
                  label="Brand"
                  type="text"
                  id="brand"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  required
                  fullWidth
                  name="quantity"
                  label="Quantity"
                  type="number"
                  id="quantity"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  required
                  fullWidth
                  name="price"
                  label="price"
                  type="number"
                  id="price"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  required
                  fullWidth
                  name="sellingPrice"
                  label="sell price"
                  type="number"
                  id="sellingPrice"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="category"
                  label="Category"
                  type="text"
                  id="category"
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleClose}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background: `${colors.blueAccent[900]}` }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  disabled={loading}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background: `${colors.blueAccent[400]}` }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
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
            color: `${colors.greenAccent[100]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.id}
          rows={row}
          columns={columns}
          components={{
            Pagination: CustomPagination,
            LoadingOverlay: LinearProgress,
          }}
        />
      </Box>
    </Box>
  );
};
export default AddInventory;
