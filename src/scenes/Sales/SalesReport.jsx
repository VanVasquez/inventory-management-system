import { useEffect, useState } from "react";
import {
  Button,
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
import {
  addSales,
  clearLog,
  getAPurchase,
  getTransact,
  updateTransact,
} from "../../api/axios";
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

function createRow(desc, brand, category, price, sellPrice, unit, transactId) {
  const totalprice = priceRow(sellPrice, unit);
  return {
    desc,
    brand,
    category,
    price,
    sellPrice,
    unit,
    totalprice,
    transactId,
  };
}

function subtotal(items) {
  return items
    .map(({ totalprice }) => totalprice)
    .reduce((sum, i) => sum + i, 0);
}

const SalesReport = () => {
  const [row, setRows] = useState([]);
  const [transactId, setTransactId] = useState();
  useEffect(() => {
    const getId = async () => {
      const { data } = await getTransact();
      setTransactId(
        data.map((d) => {
          return d.id;
        })
      );
    };
    const getItems = async () => {
      await getAPurchase().then((res) => {
        setRows(res.data);
      });
    };

    getId();
    getItems();
  }, []);

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = dd + "/" + mm + "/" + yyyy;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Report");
  const filename = "user_report.xlsx";
  workbook.columns = [
    { header: "Item", key: "desc" },
    { header: "Brand", key: "brand" },
    { header: "Description", key: "category" },
    { header: "Price", key: "price" },
    { header: "Qty", key: "unit" },
    { header: "Total", key: "totalprice" },
  ];
  // Add a row for the date
  worksheet.getCell("A1").value = "Date: ";
  worksheet.getCell("B1").value = new Date();

  worksheet.getCell("A3").value = "Transaction No: ";
  worksheet.getCell("B3").value = transactId;
  worksheet.getCell("A4");
  const rows = row.map((r) => {
    return createRow(
      r.item,
      r.brand,
      r.category,
      r.price,
      r.sellingPrice,
      r.quantity,
      transactId
    );
  });

  const invoiceSubtotal = subtotal(rows);
  const submitItem = async (event) => {
    event.preventDefault();
    try {
      await addSales(rows);
      await updateTransact({
        id: transactId,
        totalSum: ccyFormat(invoiceSubtotal),
      });
      await clearLog();
      const getItems = async () => {
        await getAPurchase().then((res) => {
          setRows(res.data);
        });
      };
      getItems();
      downloadReport();
      localStorage.setItem("isOpen", false);
    } catch (e) {}
  };
  const headers = worksheet.addRow([]);
  headers.getCell("A").value = "Items";
  headers.getCell("B").value = "Brand";
  headers.getCell("C").value = "Description";
  headers.getCell("D").value = "Price";
  headers.getCell("E").value = "Qty";
  headers.getCell("F").value = "Total";

  rows.forEach((item, index) => {
    const row = worksheet.getRow(index + 6);
    row.values = [
      item.desc,
      item.brand,
      item.category,
      item.price,
      item.unit,
      item.totalprice,
    ];

    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });

  const totalRow = worksheet.addRow([]);
  totalRow.getCell("A").value = "Total";
  totalRow.getCell("F").value = { formula: `SUM(F6:F${rows.length + 5})` };
  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  const message = worksheet.addRow();
  message.getCell("A").value =
    "* this is not an official receipt, ask for official receipt";
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
              <StyledTableCell align="left">Date:</StyledTableCell>
              <StyledTableCell colSpan={5}> {formattedToday}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">Transaction No: </StyledTableCell>
              <StyledTableCell colSpan={5}>{transactId}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Item</StyledTableCell>
              <StyledTableCell>Brand</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Unit</StyledTableCell>
              <StyledTableCell align="right">Sum</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.desc}>
                <StyledTableCell>{row.desc}</StyledTableCell>
                <StyledTableCell>{row.brand}</StyledTableCell>
                <StyledTableCell>{row.category}</StyledTableCell>
                <StyledTableCell align="right">{row.sellPrice}</StyledTableCell>
                <StyledTableCell align="right">{row.unit}</StyledTableCell>
                <StyledTableCell align="right">
                  {ccyFormat(row.totalprice)}
                </StyledTableCell>
              </StyledTableRow>
            ))}

            <StyledTableRow>
              <StyledTableCell colSpan={4}>
                * this is not an official receipt, ask for official receipt
              </StyledTableCell>
              <StyledTableCell align="right">Total</StyledTableCell>
              <StyledTableCell align="right">
                {ccyFormat(invoiceSubtotal)}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {ccyFormat(invoiceSubtotal) > 0 && (
        <Button onClick={submitItem}>Submit</Button>
      )}
    </Box>
  );
};
export default SalesReport;
