import React, { useReducer, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import HomePage from "./homeComponent";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
    Typography,
    Card,
    CardContent,
    Autocomplete,
    TextField,
    TableBody,
} from "@mui/material";
import theme from "../theme";
import "../App.css";


const AdvisoryListComponent = (props) => {

    const initialState = {
        travelerNames: [],
        allCountryData: [],
        matchingTravelerName: [],
        matchingRegionName: [],
        matchingSubregionName: [],
        regionNames: [],
        subregionNames: [],
        isTraveler: false,
        isRegion: false,
        isSubregion: false,
        // to clear radio button data when clicked off of / hide headers when radio button not checked
        isSelected: false,
    };

    const sendMessageToSnackbar = msg => {
        props.dataFromChild(msg);
    }

    const reducer = (state, newState) => ({ ...state, ...newState });
    const [state, setState] = useReducer(reducer, initialState);

    const GRAPHURL = "/graphql";

    // load data before the component renders 
    useEffect(() => {
        fetchAllData();
    }, []);

    // filter out unique values
    const unique = (value, index, self) => {
        return self.indexOf(value) === index
    }

    // houses 3 responses that fetch data for travelers, regions, and subregions
    const fetchAllData = async () => {
        try {
            sendMessageToSnackbar(`Finding travelers...`);

            setState({
                contactServer: true,
            });

            let getTravelerResponse = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: "query { advisories {name, country, text, date } }" }),
            });

            let getRegionResponse = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: "query { alerts { region, name } }" })
            });

            let getSubregionResponse = await fetch(GRAPHURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ query: "query { alerts { subregion, name } }" })
            });

            let jsonTraveler = await getTravelerResponse.json();
            let jsonRegion = await getRegionResponse.json();
            let jsonSubregion = await getSubregionResponse.json();

            setState({
                allCountryData: jsonTraveler.data.advisories,
                travelerNames: jsonTraveler.data.advisories.map((n) => n.name).filter(unique),
                regionNames: jsonRegion.data.alerts.map((r) => r.region).filter(unique),
                subregionNames: jsonSubregion.data.alerts.map((sr) => sr.subregion).filter(unique),
            });

            sendMessageToSnackbar(`Loaded data`);

        } catch (error) {
            console.log(error);
            setState({
                msg: `Problem loading server data - ${error.message}`,
            });
        }
    };


    const chooseTraveler = async (e, selectedTraveler) => {
        let response = await fetch(GRAPHURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ query: `query { advisoriesfortraveler(name: "${selectedTraveler}") { country, text, date }}` })
        });

        let json = await response.json();
        let alertsLength = json.data.advisoriesfortraveler

        setState({
            matchingTravelerName: json.data.advisoriesfortraveler,
            isSelected: true
        });
        sendMessageToSnackbar(`Found ${alertsLength.length} alerts for ${selectedTraveler}`);
    };


    const chooseRegion = async (e, selectedRegion) => {
        let response = await fetch(GRAPHURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ query: `query { advisoriesforregion(region: "${selectedRegion}") { country, name, text, date }}` })
        });

        let json = await response.json();
        let alertsLength = json.data.advisoriesforregion

        setState({
            matchingRegionName: json.data.advisoriesforregion,
            isSelected: true
        });
        sendMessageToSnackbar(`Found ${alertsLength.length} alerts for ${selectedRegion}`);
    };


    const chooseSubregion = async (e, selectedSubregion) => {
        let response = await fetch(GRAPHURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ query: `query { advisoriesforsubregion(subregion: "${selectedSubregion}") { country, name, text, date }}` })
        });

        let json = await response.json();
        let alertsLength = json.data.advisoriesforsubregion

        setState({
            matchingSubregionName: json.data.advisoriesforsubregion,
            isSelected: true
        });
        sendMessageToSnackbar(`Found ${alertsLength.length} alerts for ${selectedSubregion}`);
    };

    // function to set states for each radio button
    const handleRadioButtonChange = (event) => {
        if (event.target.value === "traveler") {
            setState(state.isTraveler = true);
            setState(state.isRegion = false);
            setState(state.isSubregion = false);
            setState(state.isSelected = false);
            sendMessageToSnackbar(`Found ${state.travelerNames.length} travelers(s)`)
        }
        if (event.target.value === "region") {
            setState(state.isRegion = true);
            setState(state.isTraveler = false);
            setState(state.isSubregion = false);
            setState(state.isSelected = false);
            sendMessageToSnackbar(`Found ${state.regionNames.length} regions(s)`);
        }
        if (event.target.value === "subregion") {
            setState(state.isSubregion = true);
            setState(state.isRegion = false);
            setState(state.isTraveler = false);
            setState(state.isSelected = false);
            sendMessageToSnackbar(`Found ${state.subregionNames.length} subregion(s)`);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <HomePage />
            <Typography variant="h4" color="darkgreen" style={{ textAlign: "center", marginBottom: 10, fontSize: 20 }}>
                List Advisories By:
            </Typography>

            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={handleRadioButtonChange}
                style={{ justifyContent: 'center' }}
            >
                <FormControlLabel value="traveler" control={<Radio />} label="Traveler" />
                <FormControlLabel value="region" control={<Radio />} label="Region" />
                <FormControlLabel value="subregion" control={<Radio />} label="Sub-Region" />
            </RadioGroup>

            <Card style={{ marginTop: "1vh", boxShadow: 'none' }}>
                <CardContent style={{ textAlign: "center" }}>
                    {state.isTraveler &&
                        <Autocomplete
                            data-testid="autocomplete"
                            options={state.travelerNames}
                            getOptionLabel={(option) => option}
                            style={{ width: 200, margin: 'auto' }}
                            onChange={chooseTraveler}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="travelers"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    }
                    {state.isRegion &&
                        <Autocomplete
                            data-testid="autocomplete"
                            options={state.regionNames}
                            getOptionLabel={(option) => option}
                            style={{ width: 200, margin: 'auto' }}
                            onChange={chooseRegion}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="regions"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    }
                    {state.isSubregion &&
                        <Autocomplete
                            data-testid="autocomplete"
                            options={state.subregionNames}
                            getOptionLabel={(option) => option}
                            style={{ width: 200, margin: 'auto' }}
                            onChange={chooseSubregion}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="subregions"
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    }

                    {state.isSelected &&
                        <TableContainer
                            className="tableStyles">
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" style={{ fontSize: 20, borderBottom: '1px solid black', backgroundColor: '#C0D9AF' }}>Country</TableCell>
                                        <TableCell align="center" style={{ fontSize: 20, borderBottom: '1px solid black', backgroundColor: 'lightblue' }}>Alert Information</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{ marginTop: 50, borderTop: '2px solid green' }}>
                                    {state.isTraveler && state.matchingTravelerName.map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell align={'center'} style={{ backgroundColor: '#C0D9AF' }}>{data.country}</TableCell>
                                            <TableCell style={{ width: '70%', backgroundColor: 'lightblue' }}>{`${data.text} ${data.date}`}</TableCell>
                                        </TableRow>
                                    ))}
                                    {state.isRegion && state.matchingRegionName.map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell align={'center'} style={{ backgroundColor: '#C0D9AF' }}>{data.name}</TableCell>
                                            <TableCell style={{ width: '70%', backgroundColor: 'lightblue' }}>{`${data.text} ${data.date}`}</TableCell>
                                        </TableRow>
                                    ))}
                                    {state.isSubregion && state.matchingSubregionName.map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell align={'center'} style={{ backgroundColor: '#C0D9AF' }}>{data.name}</TableCell>
                                            <TableCell style={{ width: '70%', backgroundColor: 'lightblue' }}>{`${data.text} ${data.date}`}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </CardContent >
            </Card >
        </ThemeProvider >
    );
}

export default AdvisoryListComponent;