import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "@emotion/styled";
import { Box } from "@mui/system";
import { getAllItem } from "../../api/axios";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "black",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#CBCBCB",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#f0f0f0",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function ccyFormat(num) {
  return `${num?.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, brand, unit, price, sellprice, date) {
  const totalprice = priceRow(price, unit);
  return { desc, brand, unit, price, sellprice, totalprice, date };
}

function subtotal(items) {
  return items
    .map(({ totalprice }) => totalprice)
    .reduce((sum, i) => sum + i, 0);
}

const ActualInventory = () => {
  const [row, setRows] = useState([]);
  const [date, setDate] = useState();
  const rows = row.map((r) => {
    return createRow(
      r.name,
      r.brand,
      r.quantity,
      r.price,
      r.sellingPrice,
      r.createdAtFormatted
    );
  });

  const invoiceSubtotal = subtotal(rows);
  useEffect(() => {
    const getAllItems = async () => {
      const { data } = await getAllItem();
      setRows(data);
    };

    getAllItems();
  }, []);
  console.log(row);
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = dd + "/" + mm + "/" + yyyy;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="spanning table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="left">COMPANY NAME</StyledTableCell>
              <StyledTableCell colSpan={5}> </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={5} align="left">
                Actual Inventory Report{" "}
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={5} align="left">
                As of:{formattedToday}
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={5} align="left">
                Date:{" "}
                <input
                  type="date"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Item</StyledTableCell>
              <StyledTableCell>Brand</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell align="right">Cost/Unit</StyledTableCell>
              <StyledTableCell align="right">
                Selling Price/Unit
              </StyledTableCell>
              <StyledTableCell align="right">Total Cost</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.desc}>
                <StyledTableCell>{row.desc}</StyledTableCell>
                <StyledTableCell>{row.brand}</StyledTableCell>
                <StyledTableCell>{row.unit}</StyledTableCell>
                <StyledTableCell align="right">{row.price}</StyledTableCell>
                <StyledTableCell align="right">{row.sellprice}</StyledTableCell>
                <StyledTableCell align="right">
                  {ccyFormat(row.totalprice)}
                </StyledTableCell>
              </StyledTableRow>
            ))}

            <StyledTableRow>
              <StyledTableCell colSpan={4}></StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">
                {ccyFormat(invoiceSubtotal)}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default ActualInventory;
