import { useState, useReducer } from "react";
import { Route, Link, Routes } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import HomePage from "./project1/homeComponent";
import AlertComponent from "./project1/alertComponent";
import AdvisoryAddComponent from "./project1/advisoryAddComponent";
import AdvisoryListComponent from "./project1/advisoryListComponent";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";


// uncomment all for dev mode
const App = () => {

  const initialState = {
    snackBarMsg: "",
    gotData: false,
  }

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ gotData: false });
  };

  const msgFromChild = (msg) => {
    setState({ snackbarMsg: msg, gotData: true });
  };


  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  return (

    <ThemeProvider theme={theme}>
      <AppBar color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Travel Alerts - Michael Ivanov
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={Link} to="/home">
              Home
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/resetalerts">
              Reset Alerts
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/addadvisory">
              Add Advisory
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/listadvisory">
              List Advisories
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <div>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/resetalerts" element={<AlertComponent dataFromChild={msgFromChild} />} />
          <Route path="/addadvisory" element={<AdvisoryAddComponent dataFromChild={msgFromChild} />} />
          <Route path="/listadvisory" element={<AdvisoryListComponent dataFromChild={msgFromChild} />} />
        </Routes>
      </div>
      <Snackbar
        open={state.gotData}
        message={state.snackbarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />
    </ThemeProvider>
  );
};
export default App;