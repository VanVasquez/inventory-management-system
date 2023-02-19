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
import { getSales } from "../../api/axios";
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

function createRow(desc, brand, unit, sellPrice, price) {
  const totalprice = priceRow(price, unit);
  const totalsaleprice = priceRow(sellPrice, unit);
  return { desc, brand, unit, price, sellPrice, totalprice, totalsaleprice };
}

function subtotal(items) {
  return items
    .map(({ totalprice }) => totalprice)
    .reduce((sum, i) => sum + i, 0);
}
function subtotal2(items) {
  return items
    .map(({ totalsaleprice }) => totalsaleprice)
    .reduce((sum, i) => sum + i, 0);
}

const SalesReport = () => {
  const [row, setRows] = useState([]);
  const getAllItems = async () => {
    const { data } = await getSales();
    console.log(data);
    setRows(data);
  };
  const rows = row.map((r) => {
    return createRow(
      r.item,
      r.brand,
      r.quantity,
      r.sellPrice,
      r.price,
      r.totalPrice
    );
  });
  const result = rows.reduce((acc, curr) => {
    const index = acc.findIndex(
      (item) => item.desc === curr.desc && item.brand === curr.brand
    );
    if (index !== -1) {
      acc[index].unit += curr.unit;
      acc[index].totalprice += curr.totalprice;
      acc[index].totalsaleprice += curr.totalsaleprice;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  console.log(result);
  const invoiceSubtotal = subtotal(result);
  const invoiceSubtotal2 = subtotal2(result);
  useEffect(() => {
    getAllItems();
  }, []);
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
              <StyledTableCell colSpan={6}> </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="left">
                Sales Report{" "}
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="left">
                Date from : {formattedToday} to: {formattedToday}
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
              <StyledTableCell align="right">Total Sales</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {result.map((row) => (
              <StyledTableRow key={row.desc}>
                <StyledTableCell>{row.desc}</StyledTableCell>
                <StyledTableCell>{row.brand}</StyledTableCell>
                <StyledTableCell>{row.unit}</StyledTableCell>
                <StyledTableCell align="right">{row.price}</StyledTableCell>
                <StyledTableCell align="right">{row.sellPrice}</StyledTableCell>
                <StyledTableCell align="right">
                  {ccyFormat(row.totalprice)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {ccyFormat(row.totalsaleprice)}
                </StyledTableCell>
              </StyledTableRow>
            ))}

            <StyledTableRow>
              <StyledTableCell colSpan={4}></StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">
                {ccyFormat(invoiceSubtotal)}
              </StyledTableCell>
              <StyledTableCell align="right">
                {ccyFormat(invoiceSubtotal2)}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default SalesReport;
