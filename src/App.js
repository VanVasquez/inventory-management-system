import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/global/Sidebar";
import Topbar from "./components/global/Topbar";
import PrivateRoutes from "./PrivateRoutes";
import AddInventory from "./scenes/AddInventory";
import LogIn from "./scenes/Login";
import Register from "./scenes/Register";
import Sales from "./scenes/Sales";
import Team from "./scenes/Team";
import UpdateInventory from "./scenes/UpdateInventory";
import Report from "./scenes/Report";
import { ColorModeContext, useMode } from "./theme";
function App() {
  const [theme, colorMode] = useMode();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const storedData = localStorage.getItem("user");
    if (storedData) setUser(JSON.parse(storedData));
    setLoading(false);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route
              path="/signup"
              element={
                <PrivateRoutes roles={["admin"]}>
                  {" "}
                  <Register />
                </PrivateRoutes>
              }
            />{" "}
            <Route
              path="/"
              element={
                <PrivateRoutes roles={["admin", "user"]}>
                  <Sidebar user={user} />
                  <main className="content">
                    <Topbar />
                  </main>
                </PrivateRoutes>
              }
            />{" "}
            <Route
              path="/teams"
              element={
                <PrivateRoutes roles={["admin"]}>
                  <Sidebar user={user} />
                  <main className="content">
                    <Topbar />
                    <Team />
                  </main>
                </PrivateRoutes>
              }
            />{" "}
            <Route
              path="/add"
              element={
                <PrivateRoutes roles={["admin"]}>
                  <Sidebar user={user} />
                  <main className="content">
                    <Topbar />
                    <AddInventory />
                  </main>
                </PrivateRoutes>
              }
            />{" "}
            <Route
              path="/update"
              element={
                <PrivateRoutes roles={["admin"]}>
                  <Sidebar user={user} />
                  <main className="content">
                    <Topbar />
                    <UpdateInventory />
                  </main>
                </PrivateRoutes>
              }
            />{" "}
            <Route
              path="/report"
              element={
                <PrivateRoutes roles={["admin"]}>
                  <Sidebar user={user} />
                  <main className="content">
                    <Topbar />
                    <Report />
                  </main>
                </PrivateRoutes>
              }
            />
            <Route
              path="/sale"
              element={
                <PrivateRoutes roles={["user"]}>
                  <Sidebar user={user} />
                  <main className="content">
                    <Topbar />
                    <Sales />
                  </main>
                </PrivateRoutes>
              }
            />
          </Routes>
        </div>
      </ThemeProvider>{" "}
    </ColorModeContext.Provider>
  );
}

export default App;
