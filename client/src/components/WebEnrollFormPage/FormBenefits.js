import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { NavigateBefore,NavigateNext } from '@material-ui/icons';
import { SelectButton,webFormStyle} from './../../assets/WebEnrollCss';

import YourInfoImg from '../../assets/img/your_info.png'
import DocInfoImg from '../../assets/img/doctor_info.png'
import PreInfoImg from '../../assets/img/prescription_info.png'

const useStyles = makeStyles(webFormStyle);

export default function FormBenefits(props) {

    const classes = useStyles();

    const userInfo = useSelector(state => state.userInfoReducer);
    const dispatch = useDispatch();

    const { patientInfo, doctorInfo, insuranceInfo, contactTime } = userInfo;
    const { caseInfo } = props;


    const onClickMorning =() =>{
        dispatch({type:'UPDATE_CONTACT_TIME',data:'morning' })
    }
    const onClickAfternoon =() =>{
        dispatch({type:'UPDATE_CONTACT_TIME',data:'afternoon' })
    }
    const onClickEvening =()=>{
        dispatch({type:'UPDATE_CONTACT_TIME',data:'evening' })
    }
    const onClickBefore = () => {
        if(insuranceInfo.haveCard)
            dispatch({type:'UPDATE_STEP',step:4 })
        else
            dispatch({type:'UPDATE_STEP',step:3 })
    }
    return (
    <Container component="Benefits" minWidth="sm">
        <Grid item className={classes.sub_form}>
            <Grid item style={{background:'rgb(155, 193, 226, 0.23)',marginBottom:'0.7em'}}>
                <Grid item  xs={12} sm = {11} style={{textAlign: 'start', fontSize:'0.8em'}}>
                    Case#:        <input id='case' type='text' style={{border:'0px',fontSize:'0.8em',height:'1.3em'}} /><br/>
                    Case Manager: <input id='caseManager' type='text' style={{border:'0px',fontSize:'0.8em',height:'1.3em'}}/>
                </Grid>            
            </Grid>
            <Grid item style={{background:'rgb(155, 193, 226, 0.23)',marginBottom:'0.1em',maxWidth:'100%'}} >
                <Grid direction='column' style={{textAlign:'justify'}}>
                    <img src={YourInfoImg} alt="Calculating ..." style={{width:'auto',maxWidth:'100%'}} />
                    <p className={classes.p}>User Name : {`${patientInfo.firstName} ${patientInfo.lastName}`} </p>
                    <p className={classes.p}>Address : {`${patientInfo.street} ${patientInfo.apt} ${patientInfo.zip} ${patientInfo.country}`}</p>
                    <img src={DocInfoImg} alt="Loading ..." style={{width:'auto',maxWidth:'100%'}} />
                    <p className={classes.p}>Doctor Name : {`${doctorInfo.firstName} ${doctorInfo.lastName}`} </p>
                    <p className={classes.p}>Address :  {`${doctorInfo.addr} ${doctorInfo.city} ${doctorInfo.state} ${doctorInfo.zip}`}</p>
                </Grid>
                <Grid item  xs={12} sm = {11}  direction='column' style={{textAlign:'justify'}} >
                    <img src={PreInfoImg} alt="Loading ..." style={{width:'auto',maxWidth:'100%'}} />
                    <p className={classes.p}>Rx Bin#: {` ${insuranceInfo.RxBIN}`}   </p>
                    <p className={classes.p}>Rx PCN: {` ${insuranceInfo.RxPCN}`} </p>
                    <p className={classes.p}>Rx Group: {` ${insuranceInfo.RxGroup}`}</p>
                    <p className={classes.p}>Issue/MemberID: {` ${insuranceInfo.cardID}`}  </p>
                    <p className={classes.p}>Payer Name: {`${insuranceInfo.insuranceType}`}  </p>
                </Grid>
            </Grid>
            <Grid item>   
                <Grid item >
                    <p className={classes.p}>
                        <b>Upload your prescription card</b><br/>
                        Tip:You can help speed things up by uploading a photo of your insurance card
                    </p>
                </Grid> 
                <Grid item style={{textAlign: 'justify'}}>
                    <input
                        accept="*/*"
                        style={{display: 'none'}}
                        id="contained-button-file"
                        multiple
                        type="file"
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                        Upload Files
                        </Button>
                    </label>
                </Grid>        
                <Grid container direction='column' style={{alignContent:'flex-start'}} > 
                    <p className={classes.p}>Let us known When would be a good time to chat  </p>
                    <Grid item xs={12} sm={6}>
                        <SelectButton name={'morning'} selected={contactTime === 'morning'} variant="contained" onClick={onClickMorning}>
                            MORNING<br/>(8AM - 11AM)
                        </SelectButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectButton name={'afternoon'}  selected={contactTime==='afternoon'} variant="contained" onClick={onClickAfternoon}>
                            After noon<br/> (11AM - 4PM)
                        </SelectButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectButton name={'evening'}  selected={contactTime ==='evening'} variant="contained" onClick={onClickEvening}>
                        Evening<br/>(4PM - 7:30PM)
                        </SelectButton>
                    </Grid>
                    <Grid item>
                        <p className={classes.p}>
                            Your call management will be calling from an area code 502 number and, for your security, will ask you a few questions
                            to confirm they are speaking with the right person before providing your coverage information.
                        </p>
                    </Grid>
                    <Grid item container direction='row' style={{justifyContent: 'space-around'}} >
                        <Grid item xs={12} sm = {5} md={5}>
                            <Button type="button" className={classes.button} fullWidth variant="contained" color="primary" onClick={onClickBefore} >
                            <NavigateBefore />BACK
                            </Button>
                        </Grid>
                        <Grid item xs={12}  sm = {5} md={5}>
                            <Button  type="button" fullWidth  variant="contained"  color="primary" //  onClick={onClick} 
                                    className={classes.button} >
                                    Call Me  <NavigateNext />
                            </Button>
                        </Grid> 
                    </Grid>               
                </Grid>        
            </Grid>
        </Grid>
    </Container>
    )
}
