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
import { getPurchase, getTransact } from "../../api/axios";
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

function createRow(id, date, desc, brand, unit, price, sellPrice, transactId) {
  const totalprice = priceRow(price, unit);
  return {
    id,
    date,
    desc,
    brand,
    price,
    unit,
    sellPrice,
    totalprice,
    transactId,
  };
}

function subtotal(items) {
  return items
    .map(({ totalprice }) => totalprice)
    .reduce((sum, i) => sum + i, 0);
}

function subtotal2(items) {
  return items.map(({ sellPrice }) => sellPrice).reduce((sum, i) => sum + i, 0);
}

const PurchaseReport = () => {
  const [row, setRows] = useState([]);
  const [transactId, setTransactId] = useState();
  const getId = async () => {
    const { data } = await getTransact();
    setTransactId(
      data.map((d) => {
        return d.id;
      })
    );
  };
  const getAllItems = async () => {
    const { data } = await getPurchase();
    console.log(data);
    setRows(data);
  };
  const rows = row.map((r) => {
    return createRow(
      r.id,
      r.dateFormatted,
      r.name,
      r.brand,
      r.quantity,
      r.cost,
      r.sellingPrice,
      transactId
    );
  });
  const invoiceSubtotal = subtotal(rows);
  const invoiceSubtotal2 = subtotal2(rows);
  useEffect(() => {
    getAllItems();
    getId();
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
                Purchase Report{" "}
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="left">
                As of:{" "}
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
              <StyledTableCell>Date of input</StyledTableCell>
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
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.date}</StyledTableCell>
                <StyledTableCell>{row.desc}</StyledTableCell>
                <StyledTableCell>{row.brand}</StyledTableCell>
                <StyledTableCell>{row.unit}</StyledTableCell>
                <StyledTableCell align="right">{row.price}</StyledTableCell>
                <StyledTableCell align="right">{row.sellPrice}</StyledTableCell>
                <StyledTableCell align="right">
                  {ccyFormat(row.totalprice)}
                </StyledTableCell>
              </StyledTableRow>
            ))}

            <StyledTableRow>
              <StyledTableCell colSpan={4}></StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">
                {ccyFormat(invoiceSubtotal2)}
              </StyledTableCell>
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
export default PurchaseReport;
