import { useTheme } from "@emotion/react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  addPurchase,
  clearLog,
  getAllItem,
  getAPurchase,
  newTransact,
} from "../../api/axios";
import { tokens } from "../../theme";

const columns = [
  { field: "item", headerName: "item", flex: 1 },
  { field: "brand", headerName: "Brand", flex: 1 },
  { field: "quantity", headerName: "Quantity", flex: 1 },
  { field: "sellingPrice", headerName: "Price", flex: 1 },
  { field: "totalPrice", headerName: "Total", flex: 1 },
];

const Purchase = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [select, setSelected] = useState("");
  const [inventory, setInventory] = useState([]);
  const [row, setRows] = useState([]);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState();
  const [options, setOptions] = useState([]);
  const [optionsBrand, setOptionsBrand] = useState([]);
  const [brand, setBrand] = useState();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setError("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [order, setOrder] = useState(row.length === 0 ? false : true);
  console.log(row.length === 0);
  console.log(row);
  useEffect(() => {
    const getPurchase = async () => {
      await getAPurchase().then((res) => {
        setRows(res.data);
      });
    };
    getPurchase();
  }, []);
  console.log(row);
  useEffect(() => {
    const getItems = async () => {
      await getAllItem().then((res) => {
        setInventory(res.data);
        setOptions(
          res.data.map((d) => {
            return d.name;
          })
        );
        setOptionsBrand(
          res.data.map((d) => {
            return d.brand;
          })
        );
      });
    };
    getItems();
  }, []);
  const uniq = [...new Set(optionsBrand)];
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      setError("");
      setLoading(true);
      inventory.map(async (item) => {
        const name = data.get("name").toUpperCase();
        const brand = data.get("brand").toUpperCase();
        const quantity = data.get("quantity");
        const category = item.category;
        const price = item.price;
        const sellingPrice = item.sellingPrice;
        const totalPrice = quantity * sellingPrice;
        if (quantity >= item.quantity) return setError("Insufficient Items");
        if (name === item.name && brand === item.brand) {
          await addPurchase({
            name,
            brand,
            category,
            price,
            sellingPrice,
            quantity,
            totalPrice,
          });
          const getItems = async () => {
            await getAPurchase().then((res) => {
              setRows(res.data);
            });
          };
          getItems();
          handleClose();
        } else return setError("No item found");
      });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
  const clearData = async () => {
    try {
      await clearLog();
      setOrder(false);
    } catch (e) {
      setError(e.message);
    }
  };
  const createPurchase = async (event) => {
    event.preventDefault();
    try {
      await newTransact({ totalSum: 0 });
      const getItems = async () => {
        await getAPurchase().then((res) => {
          setRows(res.data);
        });
      };
      getItems();
      setOrder(true);
    } catch (err) {
      setError(err.message);
    }
  };
  console.log(error);
  return (
    <>
      <Box>
        {!order && <Button onClick={createPurchase}>New</Button>}
        {order && (
          <Box
            m="0 0 0 0"
            height="70vh"
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
            <DataGrid getRowId={(row) => row.id} rows={row} columns={columns} />
          </Box>
        )}
        {order && <Button onClick={handleOpen}>Add </Button>}
        {order && <Button onClick={clearData}>Clear </Button>}
      </Box>
      <Box></Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h3">
            Purchase Item
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
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={options}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name="name"
                      label="Name"
                      type="text"
                      id="name"
                      color="secondary"
                      onChange={(e) => {
                        setBrand(e.target.value.toUpperCase());
                      }}
                      placeholder={select.name}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={uniq}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name="brand"
                      label="Brand"
                      type="text"
                      id="brand"
                      color="secondary"
                      onChange={(e) => {
                        setBrand(e.target.value.toUpperCase());
                      }}
                      placeholder={select.brand}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Quantity"
                  type="number"
                  id="quantity"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                  color="secondary"
                  placeholder={select.quantity}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
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
                  ADD
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Purchase;
