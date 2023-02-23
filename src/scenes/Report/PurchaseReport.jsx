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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [transactId, setTransactId] = useState();
  const [filteredInventoryData, setFilteredInventoryData] = useState([]);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Purchase Report");

  const filename = "purchase_report.xlsx";
  workbook.columns = [
    { header: "Date", key: "date" },
    { header: "Item", key: "desc" },
    { header: "Brand", key: "brand" },
    { header: "Qty", key: "quantity" },
    { header: "Cost/unit", key: "price" },
    { header: "Selling Price/unit", key: "sellprice" },
    { header: "Total Cost", key: "totalprice" },
  ];
  // Add a row for the company name
  const companyNameRow = worksheet.addRow(["Company Name"]);
  companyNameRow.font = { bold: true };

  const titleNameRow = worksheet.addRow(["Purchase Report"]);
  titleNameRow.font = { bold: true };
  // Add a row for the date
  worksheet.getCell("A3").value = "As of: ";
  worksheet.getCell("B3").value = new Date().toLocaleString();

  worksheet.getCell("A4").value = "Date from: ";
  worksheet.getCell("B4").value = startDate;
  worksheet.getCell("C4").value = "to: ";
  worksheet.getCell("D4").value = endDate;
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
  const handleFilterByDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
      setFilteredInventoryData(rows);
    } else {
      const filteredData = rows.filter((item) => {
        const itemDate = new Date(item.date).toLocaleDateString();
        console.log(itemDate);
        console.log(new Date(startDate).toLocaleDateString());
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
    getId();
  }, []);

  worksheet.addRow([]);
  const headers = worksheet.addRow([]);
  headers.getCell("A").value = "Date";
  headers.getCell("B").value = "Name";
  headers.getCell("C").value = "Brand";
  headers.getCell("D").value = "Qty";
  headers.getCell("E").value = "Cost/unit";
  headers.getCell("F").value = "Selling Price/unit";
  headers.getCell("G").value = "Total Cost";

  filteredInventoryData.forEach((item, index) => {
    const row = worksheet.getRow(index + 7);
    row.values = [
      item.date,
      item.desc,
      item.brand,
      item.unit,
      item.price,
      item.sellPrice,
      item.totalprice,
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
              {" "}
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
            {filteredInventoryData.map((row) => (
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
      <button onClick={downloadReport}>Download Report</button>
    </Box>
  );
};
export default PurchaseReport;
