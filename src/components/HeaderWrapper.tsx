import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import healthcare from '../image/healthcare.jpg'


import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';

import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Box} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    typography: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 30,
        color: '#00416D',
        marginTop: '5px'

    }
});
function Header() {
    const classes = useStyles();
        return (
                <Box>
                    <CardMedia className={classes.media}
                               image={healthcare}>

                    </CardMedia>
                    <Box className={classes.typography}>
                        <Typography className={classes.typography} variant="h5" component="h2">
                            Hospitals Geolocation
                        </Typography>
                    </Box>

                </Box>

        )
}

export default Header;