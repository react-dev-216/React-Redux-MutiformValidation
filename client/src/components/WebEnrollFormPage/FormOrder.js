import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { NavigateBefore } from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';
import { NavigateNext } from '@material-ui/icons';
import { webFormStyle,primary1} from './../../assets/WebEnrollCss';

import OrderImg from '../../assets/img/order.png'
import OrderReceivedImg from '../../assets/img/order_received.png'
import LinkImg from '../../assets/img/Link.png'

const useStyles = makeStyles(webFormStyle);

export default function FormOrder(props) {

    const classes = useStyles();

    const userInfo = useSelector(state => state.userInfoReducer);
    const dispatch = useDispatch();

    const { patientInfo, doctorInfo, insuranceInfo, patientNote,  } = userInfo;
    const { supportPhoneNumber } = props;

    const onClickProfile = () => {
        let userInfo = ' patientInfo : ' + JSON.stringify(patientInfo) + 
                         ' doctorInfo : ' + JSON.stringify(doctorInfo) + 
                         ' insuranceInfo : ' + JSON.stringify(insuranceInfo) +
                         ' patientNote ' + JSON.stringify(patientNote);
    //    console.log("user Information",userInfo);
        userInfo=userInfo.replace(/{/g,'').replace(/"/g,'').replace(/,/g,'\n').replace(/}/g,'\n') ;  
        alert(userInfo);
    }

    const onClickVisitXiidra = () => {
        window.location.replace("http://www.xiidra.com");
    }

    const onClickBefore = () => {
        dispatch({type:'UPDATE_STEP',step: 4});
    }
    return (
    <form className={classes.form} noValidate>           
        <Container component="Order" minWidth="sm">
            <Grid item container className={classes.sub_form}>
                <Grid item container style={{textAlign:'left'}} direction={'column'}>
                    <Grid item >
                    <img src={OrderImg} alt="order img" style={{height:'5em',width:'auto',maxWidth:'100%'}} />
                    </Grid>
                    <Grid item>
                    <img src={OrderReceivedImg} alt="order_character img" style={{height:'5em',width:'auto',maxWidth:'100%'}} />
                    </Grid>
                </Grid>
                <Grid item  xs={12} sm = {11} style={{alignSelf:'center',textAlign:'justify'}}>
                    <p className={classes.p}>Once we confirm that your doctor is able to send your proscription to PillPack for delivery, we'll be in touch 
                    (typically in 4-6 days). If we have any question, we'll give you a call back from area code 502.</p>
                </Grid>
                <Grid item  xs={12} sm = {11} style={{alignSelf:'center',textAlign:'justify'}}>
                    <p className={classes.p}>You can expect PillPack to contact you every month before filling your prescription. Just let them know if you no 
                    longer want them to ship Xiidra to you.</p>
                </Grid>
                <Grid item xs={12} sm = {8}>
                    <Button  type="button" fullWidth  variant="contained"  color="primary"  onClick={onClickProfile}
                            className={classes.button} >
                            SEE MY PROFILE  <NavigateNext />
                    </Button>
                </Grid>
                <Grid item xs={12} sm = {8}>
                    <Button  type="button" fullWidth  variant="contained"  color="primary"   onClick={onClickVisitXiidra} 
                            className={classes.button} >
                            VISIT XIIDAR.COM  <NavigateNext />
                    </Button>
                </Grid>
                <Grid item  xs={12} sm = {11} style={{alignSelf:'center',textAlign:'justify'}}>
                    <p className={classes.p1}>Order processed, filled, and shipped by PillPack.*</p>
                    <p className={classes.p1}>*PillPack, an independent retail pharmacy, is solely responsible for your.
                        Any questions about your delivery should be directed to PillPack</p>
                    <p className={classes.p1}>Shire expressly disclaims responsibility for delivery, including shipping and billing.
                    Please contact PillPack for more information about your delivery.</p>
                </Grid>
                <Grid item style={{textAlign:'left'}}>
                    <img src={LinkImg} alt="link" style={{height:'2em',width:'auto'}} />
                </Grid>
                <Grid item>
                    <p className={classes.p1}>For any other question, call {supportPhoneNumber}</p>
                </Grid>
                <Grid item xs={12} sm = {4} >
                    <Button type="button" className={classes.button} fullWidth variant="contained" color="primary" onClick={onClickBefore} >
                    <NavigateBefore />BACK
                    </Button>
                </Grid>
            </Grid>
        </Container>
    </form>    
    )
}
