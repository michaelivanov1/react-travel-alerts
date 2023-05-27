import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TravelAlerts from "./homeComponent";
import {
    Card,
    CardContent,
} from "@mui/material";
import theme from "../theme";

const AlertComponent = (props) => {

    const sendMessageToSnackbar = msg => {
        props.dataFromChild(msg);
    }

    const initialState = {
        contactServer: false,
        alerts: [],
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);
    const GRAPHURL = "/graphql";

    // load data before the component renders 
    useEffect(() => {
        fetchAlerts();
    }, []);

    // delete all from alerts collection, retrieve alerts and countries, and add back to alerts collection
    const fetchAlerts = async () => {
        try {
            sendMessageToSnackbar("Grabbing alerts");
            setState({
                contactServer: true,
            });
            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: "query { setupalerts{results} }" }),
            });

            let json = await response.json();

            let resArr = [];
            resArr = json.data.setupalerts.results
                .replace(/([.])\s*(?=[A-Z])/g, "$1|")
                .split("|");

            setState({
                contactServer: true,
                alerts: resArr,
            });

            sendMessageToSnackbar("Fetched all alerts");

        } catch (error) {
            console.log(`error: ${error}`);
            sendMessageToSnackbar(`Problem loading server data: ${error.message}`);        
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <TravelAlerts />
            <Card style={{ marginTop: "2vh", backgroundColor: '#C0D9AF' }}>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                {
                                    state.alerts.map((alert, idx) => {
                                        return <TableRow key={idx}><TableCell style={{ fontSize: 18 }}>{alert}</TableCell></TableRow>
                                    })
                                }
                            </TableHead>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}

export default AlertComponent;