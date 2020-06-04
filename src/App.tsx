import React, {useEffect} from 'react';
import './App.css';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import { GoogleMap, Marker, withScriptjs, withGoogleMap } from "react-google-maps"
import ContentWrapper from "./components/CardContent";
import Header from './components/HeaderWrapper'
import axios from 'axios';
import {makeStyles} from "@material-ui/core/styles";



const useStyles = makeStyles({
    root: {
        maxWidth: 530,
        justifyContent: 'center',
    },
    media: {
        height: 140,
    },
    typography: {
        align: "center"
    },
    alignItemsAndJustifyContent: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const MyMapComponent = withScriptjs(withGoogleMap((props:any) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
     <Marker position={{ lat: -34.397, lng: 150.644 }} />
  </GoogleMap>
))

const App = () => {
    const classes = useStyles();
    // const [address, setAddress] = React.useState('')
    // const [coordinates, setCordinates] = React.useState({lat: null, lng: null})
    // const handleSelect:any = async (value:any) => {
    //     const results = await geocodeByAddress(value);
    //     const latLng:any = await getLatLng(results[0]);
    //     console.log(results);
    //     setAddress(value);
    //     setCordinates(latLng)
    // }

    // useEffect(() => {
    //     // return () => {
    //     //     effect
    //     // };
    //     try {
    //         const res = axios.get(`${process.env.REACT_APP_MAPS_API}&libraries=places`)
    //     }
    // }, []);

  return (
//       <div className="App">
//
//         <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
//           {
//             ({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
//                 <div>
//                     <p>Latitude: {coordinates.lat}</p>
//                     <p>Longitude: {coordinates.lng}</p>
//                   <input {...getInputProps({placeholder: "Type address"})}/>
//                   <div>
//                     {loading ? <div> loading...</div> : null}
//
//                     {suggestions.map( suggestion => {
//                       const style = {
//                           backgroundColor: suggestion.active ? "#41b6e6" : "#fff"
//                       }
//                       return (
//                           <div {...getSuggestionItemProps(suggestion, {style})}> {suggestion.description}  </div>
//                       );
//                     })}
//                   </div>
//
//                 </div>
//             )
//           }
//         </PlacesAutocomplete>
//         <MyMapComponent
//   googleMapURL ="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
//   loadingElement={<div style={{ height: `100%` }} />}
//   containerElement={<div style={{ height: `400px` }} />}
//   mapElement={<div style={{ height: `100%` }} />}
// />
//
//       </div>
      <div className={classes.alignItemsAndJustifyContent} style={{
          display: "flex",
          justifyContent: "center",
          margin: 20,
          padding: 20
      }}>
          <Card className={classes.root} style={{justifyContent: "center"}}>
              <Header></Header>
              <ContentWrapper></ContentWrapper>
          </Card>
      </div>



  );
}

export default App;
