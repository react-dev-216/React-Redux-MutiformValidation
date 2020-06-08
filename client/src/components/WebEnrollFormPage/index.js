import React, { useState, useEffect, useReducer } from 'react';
import {BrowserRouter} from 'react-router-dom'
import {Route, Switch, Redirect} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles, ThemeProvider, useTheme, createMuiTheme } from '@material-ui/core/styles';

import { userInfoReducer} from '../../reducer/UserInfoReducer'
import FormPatient from './FormPatient';
import FormDoctor from './FormDoctor';
import FormInsurance from './FormInsurance';
import FormCoPay from './FormCoPay';
import FormOrder from './FormOrder';
import FormBenefits from './FormBenefits';

import {webFormStyle} from './../../assets/WebEnrollCss';

const darkTheme = createMuiTheme({
  palette: {
    // Switching the dark mode on is a single property value change.
    type: 'light',
    // backgroundColor: '#ffffff'
  },
});

//   "homepage": "http://onwww.epizy.com/team-portfolio/react-signup/",

const useStyles = makeStyles(webFormStyle);

export default function WebEnrollFormPage() {
    const classes = useStyles();

    const currentStep = useSelector(state => state.userInfoReducer.currentStep);
    const dispatch = useDispatch();
    
    useEffect(() => {
        return () => {            
        };
    }, []);

    const updateTitle = (Step)=>{
       
        switch(Step){
            case 1:
                return 'Patient Information';
            case 2:
                return 'Doctor Information';
            case 3:
                return 'Insurance Information';
            case 4:
                return 'Co-Pay Information';
            case 5:
                return 'Order Received Confirm';
            case 6:
                return 'Benefits Options Follow Up';
            default:
                return 'Patient Information';
        }
    }
    const currentSubTitle  = updateTitle(currentStep);
        
    return (
  
    <BrowserRouter>
        <Grid container component="main" id="webEnrollForm" className={classes.root} xs={10} sm={10} alignItems="center" >

            <Grid className={classes.form_paper} item xs={12} sm={8} md={7} component={Paper} elevation={6}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5" style={{width:'100%',paddingTop: '0.5em'}}>
                        {currentSubTitle}                        
                            {currentStep === 1 && 
                                <FormPatient/>
                            }
                            {currentStep === 2 && 
                                <FormDoctor />
                            }
                            {currentStep === 3 && 
                                <FormInsurance/>
                            }
                            {currentStep === 4 && 
                                <FormCoPay
                                />
                            }
                            {currentStep === 5 && 
                                <FormOrder
                                 supportPhoneNumber = {'1-844-694-4747'}  // support phone number for patient : Entry Option from outside !!!!!!!!!!!!!!!
                                />
                            }
                            {currentStep === 6 && 
                                <FormBenefits
                                   caseInfo = {{case:'CASS753214',caseManager:'Smith'}}                           
                                />
                            }                             
                    </Typography>
                     

                </div>
            </Grid>
        </Grid>
    </BrowserRouter>
    
    )
}

