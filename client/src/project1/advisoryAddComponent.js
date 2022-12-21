import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import TravelAlerts from "./homeComponent";
import {
    Typography,
    Card,
    CardContent,
    Autocomplete,
    TextField,
    Button,
} from "@mui/material";
import theme from "../theme";

const AdvisoryAddComponent = (props) => {

    const initialState = {
        msg: "",
        snackBarMsg: "",
        testDataFromChild: "",
        contactServer: false,
        countryNames: [],
        countryText: [],
        travelerName: [],
        allCountryData: [],
        selectedCountry: "",
        selectedText: "",
    };

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const GRAPHURL = "/graphql";

    const sendMessageToSnackbar = msg => {
        props.dataFromChild(msg);
    }

    // load data before the component renders 
    useEffect(() => {
        fetchCountrys();
    }, []);

    const fetchCountrys = async () => {
        try {
            sendMessageToSnackbar("Finding countries...");

            setState({
                contactServer: true,
                snackBarMsg: "Attempting to load countries from server...",
            });

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: "query { alerts {name, country, text, date} }" })
            });

            let json = await response.json();

            setState({
                contactServer: true,
                countryNames: json.data.alerts.map((a) => a.name),
                countryText: json.data.alerts.map((t) => t.text),
                allCountryData: json.data.alerts,
                snackBarMsg: "Countries loaded",
            });

            sendMessageToSnackbar(`Found ${json.data.alerts.length} countries`);

        } catch (error) {
            console.log(error);
            sendMessageToSnackbar(`Problem loading server data: ${error.message}`);
        }
    };


    const chooseCountry = (e, selectedCountry) => {
        // find country text that matches country name
        const findText = state.allCountryData.find(e => e.name == selectedCountry);

        if (selectedCountry) {
            setState(state.selectedCountry = selectedCountry);
            setState(state.selectedText = findText.text);
        } else {
            setState(state.selectedCountry = "");
            setState(state.selectedText = "");
        }
    };


    const addAdvisoryButton = async () => {
        let currentDate = new Date();
        let dateTimeNow = currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + currentDate.getFullYear()
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds();

        Date.prototype.todaysDate = function () {
            return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
        }
        Date.prototype.timeNow = function () {
            return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }

        let newDate = new Date();
        dateTimeNow = `${newDate.todaysDate()} ${newDate.timeNow()}`;

        let advisoryContents = {
            name: state.travelerName,
            country: state.selectedCountry,
            text: state.selectedText,
            date: dateTimeNow,
        }

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        try {
            /* 
                mutation to add into advisories collection
                * each property must be wrapped in quotations *
            */
            let query = JSON.stringify({
                query: `mutation {addadvisory(name: "${advisoryContents.name}", country: "${advisoryContents.country}", text: "${advisoryContents.text}", date: "${advisoryContents.date}" )
                        { name, country, text, date }}`,
            });

            let response = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: query,
            });

            let json = await response.json();
            sendMessageToSnackbar(`Added advisory on ${json.data.addadvisory.date}`);

            setState({
                snackBarMsg: `User ${json.data.addadvisory.name} added`,
            });

        } catch (error) {
            console.log(`error: ${error}`);
            sendMessageToSnackbar(`Problem loading server data: ${error.message}`);
        }
    }

    // keeps the add advisory button disabled until user has entered required data 
    const emptyorundefined =
        state.travelerName === undefined ||
        state.travelerName === "" ||
        state.selectedCountry === undefined ||
        state.selectedCountry === "";

    return (
        <ThemeProvider theme={theme}>
            <TravelAlerts />
            <Typography variant="h4" color="green" style={{ textAlign: "center", marginTop: 14 }}>
                Add Advisory
            </Typography>
            <Card style={{ marginTop: "2vh", boxShadow: 'none' }}>
                <CardContent style={{ textAlign: "center" }}>
                    <TextField
                        style={{ marginBottom: 20 }}
                        label="Traveler's name"
                        onChange={(e) => setState(state.travelerName = e.target.value)
                        }
                    />
                    <Autocomplete
                        data-testid="autocomplete"
                        options={state.countryNames}
                        getOptionLabel={(option) => option}
                        style={{ width: 200, margin: 'auto' }}
                        onChange={chooseCountry}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="countries"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                    <Button
                        disabled={emptyorundefined}
                        variant="contained"
                        style={{ marginTop: 20 }}
                        onClick={addAdvisoryButton}
                    >add advisory</Button>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}

export default AdvisoryAddComponent;