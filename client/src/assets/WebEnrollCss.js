import React from 'react'
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';

import { withStyles } from '@material-ui/core/styles';

export const primary1 = '#5533bb';
export const primary2 = '#ffffff';
export const borderColor = '#005cbf';


const styledBy = (property, mapping) => props => mapping[props[property]];

export const webFormStyle = theme => ({
    root: {
    height: '100vh',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flexGrow: 1,
    justifyContent: 'center',
    display: 'inline-flex',
    },
    form_paper: {
        height:'auto',
        display: 'flex',
        justifyContent: 'center',   
        minHeight: '98vh',
        width: "100%",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
        },  
        
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(1),
    },
    formControl: {
    //  margin: theme.spacing.unit,
      minWidth: 180,
    },
    sub_form:{
      width:'90%',
      display:'inline-flex',
      flexDirection:'column',
      flexWrap: 'wrap',
      },
    image: {
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height:'97vh',
      top:'0',
      opacity:'0.8',
      marginTop:theme.spacing(1),
      position: 'fixed',
      width: "30%",
      left:'calc(100% - 35%)',
       [theme.breakpoints.down("sm")]: {
        width: "0px",
        display:'none'
      }
    },

    paper: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width:'85%',
        [theme.breakpoints.down("sm")]: {
          width: "100%",
        },
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    p:{
      marginTop:'0.3em',
      marginBottom:'0.3em',
      fontSize:'0.8em',
      textAlign:'justify',
    },
    p1:{
      marginTop:'0.5em',
      marginBottom:'0.5em',
      fontSize:'0.6em',
      textAlign:'justify',
    },
    button:{
      marginTop:'0.5em',
      marginBottom:'0.5em',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    spanButton: {

      background:primary2,
      borderColor: primary1, 
      border:'1px solid',
      '&:hover': {
        backgroundColor: primary1,
        borderColor: borderColor,
        boxShadow: 'none',
        color:primary2,
        cursor:'pointer',
      },
    },


});

export const SelectButton = withStyles ({
  root: {
     boxShadow: styledBy('selected', {
      false: 'none',
      true: '0 0 0 0.2rem rgba(0,123,255,.5)',
    }),

    background:primary2,
    width:"90%",
    height:"3rem",
    marginTop:'0.5rem',
    marginBottom:'0.5rem',
    textTransform: 'none',
    color:primary1,
    fontSize: '0.6rem',
    fontWeight:600,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    
    borderColor: primary1, 
    '&:hover': {
      backgroundColor: primary1,
      borderColor: borderColor,
      boxShadow: 'none',
      color:primary2,
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: primary1,
      borderColor: borderColor,
    },

  },
})(({selected, ...other }) => (
  <Button {...other} />
));

export const StyledToggleButton = withStyles({
  root: {
    
  //  background:'#ffffff',
  //  width:"90%",
    height:"3rem",
    marginTop:'0.5rem',
    marginBottom:'0.5rem',
    textTransform: 'none',
    color:styledBy('selected', {
      false: primary1,
      true: primary2,
    }),
    backgroundColor:styledBy('selected', {
      false: primary2,
      true: 'rgba(86, 164, 239, 0.73)',
    }),
    fontSize: '0.6rem',
    fontWeight:400,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    
    borderColor: borderColor, 
    '&:hover': {
      backgroundColor: 'rgba(86, 164, 239, 0.73)',
      borderColor: borderColor,
      boxShadow: 'none',
      color:primary2,
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#rgba(86, 164, 239, 0.73)',
      borderColor: borderColor,
    },

  },
})(({selected, ...other }) => (
  <ToggleButton {...other} />
));

export const modalStyle = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width:'95%',
    maxWidth:'850px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor:'primary1',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius:'7px',
  },
});
