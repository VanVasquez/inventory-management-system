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
import ExcelJS from "exceljs";

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

function createRow(desc, brand, unit, sellPrice, price, date) {
  const totalprice = priceRow(price, unit);
  const totalsaleprice = priceRow(sellPrice, unit);
  return {
    desc,
    brand,
    unit,
    price,
    sellPrice,
    totalprice,
    date,
    totalsaleprice,
  };
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredInventoryData, setFilteredInventoryData] = useState([]);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Report");

  const filename = "sales_report.xlsx";
  workbook.columns = [
    { header: "Item", key: "desc" },
    { header: "Brand", key: "brand" },
    { header: "Qty", key: "unit" },
    { header: "Cost/unit", key: "price" },
    { header: "Selling Price/unit", key: "sellPrice" },
    { header: "Total Cost", key: "totalprice" },
    { header: "Total Sales", key: "totalsaleprice" },
  ];
  // Add a row for the company name
  const companyNameRow = worksheet.addRow(["Company Name"]);
  companyNameRow.font = { bold: true };

  const titleNameRow = worksheet.addRow(["Sales Report"]);
  titleNameRow.font = { bold: true };

  // Add a row for the date
  worksheet.getCell("A3").value = "As of: ";
  worksheet.getCell("B3").value = new Date().toLocaleString();

  worksheet.getCell("A4").value = "Date from: ";
  worksheet.getCell("B4").value = startDate;
  worksheet.getCell("C4").value = "to: ";
  worksheet.getCell("D4").value = endDate;
  const getAllItems = async () => {
    const { data } = await getSales();
    setRows(data);
  };
  const rows = row.map((r) => {
    return createRow(
      r.item,
      r.brand,
      r.quantity,
      r.sellPrice,
      r.price,
      r.dateFormatted,
      r.totalPrice,
      r.dateFormatted
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

  const handleFilterByDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
      setFilteredInventoryData(result);
    } else {
      const filteredData = result.filter((item) => {
        const itemDate = new Date(item.date).toLocaleDateString();
        return (
          itemDate >= new Date(startDate).toLocaleDateString() &&
          itemDate <= new Date(endDate).toLocaleDateString()
        );
      });
      setFilteredInventoryData(filteredData);
    }
  };
  useEffect(() => {
    handleFilterByDateRange(startDate, endDate);
  }, []);
  const invoiceSubtotal = subtotal(filteredInventoryData);
  const invoiceSubtotal2 = subtotal2(filteredInventoryData);
  useEffect(() => {
    getAllItems();
  }, []);
  worksheet.addRow([]);
  worksheet.addRow([]);
  const headers = worksheet.addRow([]);
  headers.getCell("A").value = "Name";
  headers.getCell("B").value = "Brand";
  headers.getCell("C").value = "Qty";
  headers.getCell("D").value = "Cost/unit";
  headers.getCell("E").value = "Selling Price/unit";
  headers.getCell("F").value = "Total Cost";
  headers.getCell("G").value = "Total Sale";
  filteredInventoryData.forEach((item, index) => {
    const row = worksheet.getRow(index + 8);
    row.values = [
      item.desc,
      item.brand,
      item.unit,
      item.price,
      item.sellPrice,
      item.totalprice,
      item.totalsaleprice,
    ];

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });
  worksheet.addRow([]);

  const totalRow = worksheet.addRow([]);
  totalRow.getCell("A").value = "Total";
  totalRow.getCell("F").value = { formula: `SUM(F8:F${rows.length + 7})` };
  totalRow.getCell("G").value = { formula: `SUM(G8:G${rows.length + 7})` };
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
  console.log(filteredInventoryData);
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
                Date from :{" "}
                <input
                  type="date"
                  onChange={(e) => {
                    const inputDate = new Date(e.target.value);
                    setStartDate(inputDate);
                    handleFilterByDateRange(e.target.value, endDate);
                  }}
                />{" "}
                to:{" "}
                <input
                  type="date"
                  onChange={(e) => {
                    const inputDate = new Date(e.target.value);
                    setEndDate(inputDate);
                    handleFilterByDateRange(startDate, e.target.value);
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
              <StyledTableCell align="right">Total Sales</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredInventoryData.map((row) => (
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
      <button onClick={downloadReport}>Download Report</button>
    </Box>
  );
};
export default SalesReport;
