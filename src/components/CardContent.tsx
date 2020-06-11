import React, {ChangeEvent, useRef, useState} from 'react'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import { compose, withProps, withHandlers, withState } from "recompose"
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import {  Input, Divider, message } from 'antd';
import MapMarker from "./MapMarker";
import { Card } from 'antd';
import GoogleMapReact from 'google-map-react';
import Button from '@material-ui/core/Button';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {Box} from "@material-ui/core";
// import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import withStyles from "@material-ui/core/styles/withStyles";
import InputBase from "@material-ui/core/InputBase";
import Select from "@material-ui/core/Select";
import useSupercluster from "use-supercluster";
import '../App.css';

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


 const ContentWrapper = () => {
    const [address, setAddress] = React.useState('')
    const [coordinates, setCordinates] = React.useState({lat: 6.5243793, lng: 3.3792057})
    const [map, setMap] = React.useState({})
    const [mapsApi, setMapsApi] = React.useState()
    const [mapLoaded, setMapLoaded] = React.useState(false)
    const [placesService, setPlacesService] = React.useState()
    const [filteredResult, setFilteredResult] = React.useState( Array());
    const [markers, setMarkers] = React.useState()
     const Marker = ({ children }:any) => children;
     let mapRef = useRef();
     const [bounds, setBounds] = useState([]);
     const [zoom, setZoom] = useState(10);

    const handleSelect:any = async (value:any) => {
        const results = await geocodeByAddress(value);
        const latLng:any = await getLatLng(results[0]);
        console.log(results);
        setAddress(value);
        setCordinates(latLng)
    }
    const [radius, setRadius] = React.useState('')
   const handleSubmit = () => {
        console.log(coordinates, radius);

    }

    let addMarker = ((lat:any, lng:any, name:any) => {

        let prevMarkers:[] = setMarkers([]);
         const markers:any = Object.assign([], prevMarkers);

         // If name already exists in marker list just replace lat & lng.
         let newMarker = true;
         for (let i = 0; i < markers.length; i++) {
             if (markers[i].name === name) {
                 newMarker = false;
                 markers[i].lat = lat;
                 markers[i].lng = lng;
                 message.success(`Updated "${name}" Marker`);
                 break;
             }
         }
        if (newMarker) {
            markers.push({ lat, lng, name });
            message.success(`Added new "${name}" Marker`);
        }

        setMarkers({ markers });
    });
     let apiHasLoaded = ((map:any, mapsApi:any) => {
         setMap(map)
         setMapLoaded(true)
         setMapsApi(mapsApi)
         setPlacesService(new mapsApi.places.PlacesService(map));
         mapRef.current = map;
     });


    const handleSearch = (() => {

        // 1. Create places request
        const placesRequest = {
            location: coordinates,
            type: ['hospital'],
            rankBy: mapsApi.places.RankBy.DISTANCE,
             radius: radius
        };


       placesService.textSearch(placesRequest, (response:[]) => {
            setFilteredResult(response)
            // for (let i = 0; i < response.length; i ++) {
            //     const hospital:any = response[i];
            //     const {rating, name} = hospital;
            //
            //     const address = hospital.formatted_address;// e.g 80 mandai lake...
            //     const location = hospital.geometry.location;
            //
            //     filteredResult.push(hospital.name, address, rating, location)
            //
            //    setFilteredResult(filteredResult)
            //
            // }
        });

        });
     const points = filteredResult.map(hospital => ({
         type: "Feature",
         properties: { cluster: false, placeId: hospital.place_id, name: hospital.name, address: hospital.formatted_address },
         geometry: {
             type: "Point",
             coordinates: [
                 parseFloat(hospital.geometry.location.longitude),
                 parseFloat(hospital.geometry.location.latitude)
             ]
         }
     }));
     const { clusters, supercluster } = useSupercluster({
         points,
         bounds,
         zoom,
         options: { radius: 75, maxZoom: 20 }
     });
     const classes = useStyles();
    console.log(filteredResult);

    return(
            <Card>
                <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                    {
                        ({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                            <Box>

                                <form action="" className={classes.margin} style={{display: 'flex'}}>
                                    {/*<TextField id="filled-search" label="Search field" type="search" variant="filled"  />*/}


                                    <BootstrapInput
                                        id="demo-customized-textbox"   {...getInputProps({placeholder: "Type address"})} />
                                    <br/>
                                    <Select labelId="demo-customized-select-label"
                                            id="demo-customized-select"
                                            input={<BootstrapInput
                                                value={radius} onChange={(e: any) => setRadius(e.target.value)}/>}>
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={500}>5Km</MenuItem>
                                        <MenuItem value={10000}>10Km</MenuItem>
                                        <MenuItem value={20000}>20Km</MenuItem>

                                    </Select>

                                    <Button variant="contained" size="large" color="primary"
                                            className={classes.buttonStyle} onClick={handleSearch} >
                                        Submit
                                    </Button>

                                </form>
                                <Box>
                                    {loading ? <div> loading...</div> : null}

                                    {suggestions.map(suggestion => {
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
                <div style={{ height: '400px', width: '500px' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: 'API-KEY',
                        libraries: ['places', 'directions']
                    }}
                    defaultZoom={11} // Supports DP, e.g 11.5
                    defaultCenter={{ lat: coordinates.lat, lng: coordinates.lng}}
                    yesIWantToUseGoogleMapApiInternals={true}
                    onGoogleApiLoaded={({ map, maps}) =>
                    {
                        apiHasLoaded(map, maps)
                    }
                    }
                    onChange={({ zoom, bounds }) => {
                        setZoom(zoom);
                        setBounds([
                            bounds.nw.lng,
                            bounds.se.lat,
                            bounds.se.lng,
                            bounds.nw.lat
                        ]);
                    }}
                >
                    {
                        <div style={{ height: '400px', width: '500px' }}>
                            {clusters.map(cluster => {
                                const [longitude, latitude] = cluster.geometry.coordinates;
                                const {
                                    cluster: isCluster,
                                    point_count: pointCount
                                } = cluster.properties;

                                if (isCluster) {
                                    return (
                                        <Marker
                                            key={`cluster-${cluster.id}`}
                                            lat={latitude}
                                            lng={longitude}
                                        >
                                            <div
                                                className="cluster-marker"
                                                style={{
                                                    width: `${10 + (pointCount / points.length) * 20}px`,
                                                    height: `${10 + (pointCount / points.length) * 20}px`
                                                }}
                                                onClick={() => {
                                                    const expansionZoom = Math.min(
                                                        supercluster.getClusterExpansionZoom(cluster.id),
                                                        20
                                                    );
                                                    mapRef.current.setZoom(expansionZoom);
                                                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                                                }}
                                            >
                                                {pointCount}
                                            </div>
                                        </Marker>
                                    );
                                }

                                return (
                                    <Marker
                                        key={`place-${cluster.properties.placeId}`}
                                        lat={latitude}
                                        lng={longitude}
                                    >
                                        {/*<button className="crime-marker">*/}
                                        {/*    <img src="/custody.svg" alt="crime doesn't pay" />*/}
                                        {/*</button>*/}
                                    </Marker>
                                );
                            })}

                            {/*{filteredResult.map((center: { place_id: any; geometry: { location: any; }; }, index: string | number | undefined) =>*/}


                            {/*    <AnyReactComponent*/}
                            {/*    lat= {center.geometry.location.lat()}*/}
                            {/*    lng={center.geometry.location.lng()}*/}
                            {/*    text="My Marker"*/}
                            {/*    />*/}


                            {/*    // key={index}*/}
                            {/*        // position={{*/}
                            {/*        //     lat: 6.5243793, lng: 3.3792057*/}
                            {/*        // }}*/}
                            {/*        // position={{*/}
                            {/*        //     lat: center.location,*/}
                            {/*        //     lng: center.longitude*/}
                            {/*        // }}*/}
                            {/*        // place={{*/}
                            {/*        //     placeId: center.place_id,*/}
                            {/*        //     position: center.geometry.location*/}
                            {/*        // }}*/}


                            {/*)}*/}
                        </div>
                    }

                </GoogleMapReact>
                </div>
            </Card>

    )
}
    export default ContentWrapper;