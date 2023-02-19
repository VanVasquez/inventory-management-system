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
import ExcelJS from "exceljs";
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
  const totalsellprice = priceRow(sellprice, unit);
  return {
    desc,
    brand,
    unit,
    price,
    sellprice,
    totalprice,
    totalsellprice,
    date,
  };
}

function subtotal(items) {
  return items
    .map(({ totalprice }) => totalprice)
    .reduce((sum, i) => sum + i, 0);
}

function subtotal2(items) {
  return items
    .map(({ totalsellprice }) => totalsellprice)
    .reduce((sum, i) => sum + i, 0);
}

const ActualInventory = () => {
  const [row, setRows] = useState([]);
  const [date, setDate] = useState();
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = dd + "/" + mm + "/" + yyyy;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Inventory Report");

  const filename = "inventory_report.xlsx";
  workbook.columns = [
    { header: "Item", key: "desc" },
    { header: "Brand", key: "brand" },
    { header: "Qty", key: "unit" },
    { header: "Cost/unit", key: "price" },
    { header: "Selling Price/unit", key: "sellprice" },
    { header: "Total Cost", key: "totalprice" },
    { header: "Total Selling Price", key: "totalsellprice" },
  ];
  // Add a row for the company name
  const companyNameRow = worksheet.addRow(["Company Name"]);
  companyNameRow.font = { bold: true };

  // Add a row for the date
  const dateRow = worksheet.addRow([new Date().toLocaleString()]);
  dateRow.font = { bold: true };

  worksheet.getCell("A4").value = new Date();
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
  const invoiceSubtotal2 = subtotal2(rows);
  useEffect(() => {
    const getAllItems = async () => {
      const { data } = await getAllItem();
      setRows(data);
    };

    getAllItems();
  }, []);

  const headers = worksheet.addRow([]);
  headers.getCell("A").value = "Name";
  headers.getCell("B").value = "Brand";
  headers.getCell("C").value = "Qty";
  headers.getCell("D").value = "Cost/unit";
  headers.getCell("E").value = "Selling Price/unit";
  headers.getCell("F").value = "Total Cost";
  headers.getCell("G").value = "Total Selling Price";

  rows.forEach((item, index) => {
    const row = worksheet.getRow(index + 7);
    row.values = [
      item.desc,
      item.brand,
      item.unit,
      item.price,
      item.sellprice,
      item.totalprice,
      item.totalsellprice,
    ];

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });

  const totalRow = worksheet.addRow([]);
  totalRow.getCell("A").value = "Total";
  totalRow.getCell("F").value = { formula: `SUM(F7:F${rows.length + 6})` };
  totalRow.getCell("G").value = { formula: `SUM(G7:G${rows.length + 6})` };
  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  const downloadReport = async () => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
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
                Actual Inventory Report{" "}
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="left">
                As of:{formattedToday}
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="left">
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
              <StyledTableCell align="right">
                Total Selling Price
              </StyledTableCell>
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
                <StyledTableCell align="right">
                  {ccyFormat(row.totalsellprice)}
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
      <button onClick={downloadReport}>Download Report</button>
    </Box>
  );
};
export default ActualInventory;
