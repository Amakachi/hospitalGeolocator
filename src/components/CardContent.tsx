import React, {ChangeEvent} from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { compose, withProps, withHandlers, withState } from "recompose"
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import GoogleMapReact from 'google-map-react';
import Button from '@material-ui/core/Button';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {Box} from "@material-ui/core";
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import withStyles from "@material-ui/core/styles/withStyles";
import InputBase from "@material-ui/core/InputBase";
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

const MyMapComponent = withGoogleMap((props:any) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: props.coordinates.lat, lng: props.coordinates.lng }}
    >

        <Marker  position={{ lat: props.coordinates.lat, lng: props.coordinates.lng }} />
    </GoogleMap>
)


function ContentWrapper() {
    const [address, setAddress] = React.useState('')
    const [coordinates, setCordinates] = React.useState({lat: 6.5243793, lng: 3.3792057})
    const [map, setMap] = React.useState({})
    const [mapsApi, setMapsApi] = React.useState({})
    const [mapLoaded, setMapLoaded] = React.useState(false)
    const [placesService, setPlacesService] = React.useState({})
    const [filteredResult, setFilteredResult] = React.useState([])
    const handleSelect:any = async (value:any) => {
        const results = await geocodeByAddress(value);
        const latLng:any = await getLatLng(results[0]);
        console.log(results);
        setAddress(value);
        setCordinates(latLng)
    }
    const [radius, setRadius] = React.useState('')
    function handleSubmit(){
        console.log(coordinates, radius);

    }
   let apiHasLoaded = ((map:any, mapsApi:any) => {

        setMap(map)
        setMapLoaded(true)
        setMapsApi(mapsApi)
       setPlacesService(new google.maps.places.PlacesService(map);)
        // setPlacesService(new mapsApi.places.PlacesService(map))


    });
    let service = placesService
    const handleSearch = (() => {


        // 1. Create places request
        const placesRequest = {
            location: coordinates,
            type: ['hospital'],
            // query: 'ice cream',
            rankBy: mapsApi.places.RankBy.DISTANCE,
             radius: radius
        };


        service.textSearch(placesRequest, ((response:any) => {
            for (let i = 0; i < response.length; i ++) {
                const hospital = response[i];
                console.log(hospital);
                const {rating, name} = hospital;
                const address = hospital.formatted_address; // e.g 80 mandai lake...

                // 4. Create direction request for each location
                const directionRequest = {
                    origin: coordinates, // From
                    destination: address, // To
                    travelMode: 'DRIVING',
                };
                // directionService.route(directionRequest, ((result, status) => {
                //     if (status !== 'OK') { return }
                //     const travellingRoute = result.routes[0].legs[0];
                //     const travellingTimeInMinutes = travellingRoute.duration.value / 60;
                //
                //     // 6. Places within limit are added to results
                //     // if (travellingTimeInMinutes < timeLimitInMinutes) {
                //     //     filteredResults.push(name);
                //     // }
                // }));

                // this.setState({ searchResults: filteredResults });
            }
        }));
        });

    const classes = useStyles();
    return(
            <CardContent>
                <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                    {
                        ({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                            <Box>

                                <form action="" className={classes.margin} style={{display: 'flex'}}>
                                    {/*<TextField id="filled-search" label="Search field" type="search" variant="filled"  />*/}


                                    <BootstrapInput id="demo-customized-textbox"   {...getInputProps({placeholder: "Type address"})}/>
                                    <br/>
                                    <Select labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            input={<BootstrapInput
                                            value={radius} onChange={(e:any) => setRadius(e.target.value)}/> }>
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={500}>5Km</MenuItem>
                                        <MenuItem value={10000}>10Km</MenuItem>
                                        <MenuItem value={20000}>20Km</MenuItem>

                                    </Select>

                                    <Button variant="contained" size="large" color="primary" className={classes.buttonStyle} onClick={handleSubmit} >
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
                {/*<MyMapComponent*/}
                {/*    googleMapURL =""*/}
                {/*    loadingElement={<div style={{ height: `100%` }} />}*/}
                {/*    containerElement={<div style={{ height: `400px` , width: `500px`, marginTop: `15px`}} />}*/}
                {/*    mapElement={<div style={{ height: `400px` }} />}*/}
                {/*    coordinates={coordinates}*/}
                {/*/>*/}
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: 'AIzaSyAFuqG_7MUm5R8ykACrJYTQHqvja2yyxzM',
                        libraries: ['places', 'directions']
                    }}
                    defaultZoom={11} // Supports DP, e.g 11.5
                    defaultCenter={{ lat: 1.3521, lng: 103.8198 }}
                    yesIWantToUseGoogleMapApiInternals={true}
                    onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
                >
                    <Marker  position={{ lat: coordinates.lat, lng: coordinates.lng }} />
                </GoogleMapReact>
            </CardContent>

    )
}
    export default ContentWrapper;