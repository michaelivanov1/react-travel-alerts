import React from "react";
import "../App.css";
import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardHeader,
} from "@mui/material";
import theme from "../theme";
import logo from './images/globe.png';

// render logo and title 
const HomePage = () => {
    return (
        <ThemeProvider theme={theme}>
            <Card style={{ boxShadow: 'none' }} className="cardStyle">
                <img src={logo} alt="GlobeLogo" className="globeLogo" />
                <CardHeader title="World Wide Travel Alerts" className="titleStyle" titleTypographyProps={{ variant: 'h5' }} />
            </Card>
        </ThemeProvider>
    );
}

export default HomePage;