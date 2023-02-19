import { Box, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import ActualInventory from "./ActualInventory";
import PurchaseReport from "./PurchaseReport";
import SalesReport from "./SalesReport";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Report = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box m={"0 20px 0 20px"}>
      {" "}
      <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Actual Inventory" {...a11yProps(0)} />
          <Tab label="Sales Report" {...a11yProps(1)} />
          <Tab label="Purchase Report" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ActualInventory />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SalesReport />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PurchaseReport />
      </TabPanel>
    </Box>
  );
};
export default Report;
