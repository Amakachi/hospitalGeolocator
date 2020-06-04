import  React from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {Box} from "@material-ui/core";
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import withStyles from "@material-ui/core/styles/withStyles";
import InputBase from "@material-ui/core/InputBase";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        buttonStyle: {
                border: 0,
                borderRadius: 7,
                color: 'white',
                height: 39,
                padding: '0 20px',
                marginLeft: '7px',
                width: '30px',
                fontSize: 12,
        },
        textFieldStyle: {
            marginTop: '8px'
        }
    }),
);

const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #ced4da',
            fontSize: 16,
            padding: '10px 26px 10px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    }),
)(InputBase);

const MyMapComponent = withScriptjs(withGoogleMap((props:any) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
        <Marker position={{ lat: -34.397, lng: 150.644 }} />
    </GoogleMap>
))


function ContentWrapper() {
    const [address, setAddress] = React.useState('')
    const [coordinates, setCordinates] = React.useState({lat: null, lng: null})
    const handleSelect:any = async (value:any) => {
        const results = await geocodeByAddress(value);
        const latLng:any = await getLatLng(results[0]);
        console.log(results);
        setAddress(value);
        setCordinates(latLng)
    }

    const classes = useStyles();
    return(
            <CardContent>
                <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                    {
                        ({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                            <Box>
                                {/*<p>Latitude: {coordinates.lat}</p>*/}
                                {/*<p>Longitude: {coordinates.lng}</p>*/}
                                <form action="" className={classes.margin} style={{display: 'flex'}}>
                                    {/*<TextField id="filled-search" label="Search field" type="search" variant="filled"  />*/}


                                    <BootstrapInput id="demo-customized-textbox"   {...getInputProps({placeholder: "Type address"})}/>
                                    <br/>
                                    <Select labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            input={<BootstrapInput /> }>
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={5}>5Km</MenuItem>
                                        <MenuItem value={10}>10Km</MenuItem>
                                        <MenuItem value={20}>20Km</MenuItem>

                                    </Select>

                                    <Button variant="contained" size="large" color="primary" className={classes.buttonStyle} >
                                        Submit
                                    </Button>

                                </form>
                                <Box>
                                    {loading ? <div> loading...</div> : null}

                                    {suggestions.map( suggestion => {
                                        const style = {
                                            backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
                                        }
                                        return (
                                            <div {...getSuggestionItemProps(suggestion, {style})}> {suggestion.description}  </div>
                                        );
                                    })}
                                </Box>

                            </Box>
                        )
                    }
                </PlacesAutocomplete>
                <MyMapComponent
                    googleMapURL ="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` , width: `500px`, marginTop: `15px`}} />}
                    mapElement={<div style={{ height: `400px` }} />}
                />
            </CardContent>

    )
}
export default ContentWrapper;