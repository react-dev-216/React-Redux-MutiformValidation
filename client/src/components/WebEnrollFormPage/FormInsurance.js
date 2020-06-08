import React, { useState, useEffect,useReducer } from 'react'
import { useDispatch, useSelector,connect } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { StepLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { NavigateBefore,NavigateNext } from '@material-ui/icons';
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { SelectButton,webFormStyle } from './../../assets/WebEnrollCss';

import { getHealthCareTokenAPI, postHealthCareEligibility,clearHealthCareStatus, clearHealthCareCommand, setHealthCareCommand } from './../../actions/HealthCareAPIAction';
import reducer from '../../reducer';

const useStyles = makeStyles(webFormStyle);

const SignupSchema = yup.object().shape({
    cardFirstName:yup.string().required(),
    cardLastName:yup.string().required(),
    RxBIN:yup.number().required(),
    RxPCN:yup.string().required(),
    RxGroup:yup.string().required(),
    cardID:yup.string().required(),
    insuranceType:yup.string().required(),
});

const postData={
  "controlNumber":"000000021",
  "tradingPartnerServiceId": "serviceId",
  "ProviderType": "payer",
  "provider":
  {
    "organizationName": "provider_name",
    "npi": "0123456789",
    "serviceProviderNumber": "54321",
    "providerCode": "AD",
    "referenceIdentification": "54321g"
  },
  "subscriber": {
    "memberId": "0000000000",
    "firstName": "johnOne",
    "lastName": "doeOne",
    "gender": "M",
    "dateOfBirth": "18800102",
    "ssn": "000000000",
    "idCard": "card123"
  }
};

export default function FormInsurance(props) {

    // const { getHealthCareTokenAPI,
    //         postHealthCareEligibility,
    //         clearHealthCare
    //     }  = props;
    const classes = useStyles();

    const insuranceInfo = useSelector(state => state.userInfoReducer.insuranceInfo);
    const healthCareData  = useSelector(state => state.healthCareReducer);
    const dispatch = useDispatch();

    const { register, handleSubmit, errors, watch,setValue } = useForm({
        validationSchema: SignupSchema,
        mode: 'onBlur',
    });

    const { haveCard, cardFirstName, cardLastName, RxBIN, RxPCN, RxGroup, cardID, insuranceType } = insuranceInfo;
    const { access_token, status, command, eligibilityData,data } = healthCareData;


    const [ bYesNo,setYesNo] = useState(()=>(haveCard?1:0));
    const [ haveInsurance,setHaveInsurance] = useState(0);
    const [ localInsuranceType, setInsuranceType] = useState(insuranceType);
    
    useEffect(() => {
        register({ name : 'haveCard'});
        register({ name : 'insuranceType'});

        setValue('haveCard',haveCard);
        setValue('insuranceType',insuranceType);
        return () => {            
        };
    }, []);

    useEffect(() => {
         console.log('new access-token => ',access_token);
        return () => {
        };
    }, [access_token]);

    useEffect(() => {
        console.log('status => ', status);
        switch(status){
            case 'GET_HEALTH':
                break;
            case 'GET_HEALTH_TOKEN':
                break;
            case 'GET_TOKEN_SUCCESS':
                if(command === 'GET_ELIGIBILITY'){
                    dispatch(clearHealthCareCommand());
                    dispatch(postHealthCareEligibility(access_token,postData));
                }
                break;
            case 'GET_HEALTH_SUCCESS':
                break;
            case 'GET_ELIGIBILITY_SUCCESS':
                dispatch(clearHealthCareStatus());
            //    console.log("ELIGIBILITY data => ",JSON.stringify(eligibilityData));
                dispatch({type:'COPAY_CLEAR'});
                dispatch({type:'UPDATE_STEP',step:4 });
                break;
            case 'GET_HEALTH_FAILED':
                break;
            default:
        }
    //    dispatch(clearHealthCareStatus());
        return () => {
            
        };
    }, [status]);



    const checkValidate = () => {
        const insuranceInfoWatch = watch();
        let item;
        for (item in insuranceInfoWatch) {
           if(insuranceInfoWatch[item] === '')
           return true;
        }
        for (item in errors) {
           if(errors[item] !== '')
           return true;
        }
        
        return false;
    }

    const onClickYes = () => {
        setYesNo(1);
        setValue('haveCard',true);

    }
    const onClickNo = () => {
        setYesNo(-1);
        setValue('haveCard',false);
        dispatch({type:'UPDATE_STEP',step:6 })
    }
    const onClickNoInsurance = () => {  
        if(haveInsurance === 1)
            setHaveInsurance(0);
        else
            setHaveInsurance(1);
        setValue('haveCard',false);    
        dispatch({type:'UPDATE_STEP',step:6 })

    }
    const onClickNotKnown = () => {

        if(haveInsurance === -1)
            setHaveInsurance(0);
        else
            setHaveInsurance(-1);
        setValue('haveCard',false);
        dispatch({type:'UPDATE_STEP',step:6 })
    }

    const handleTypeOptum =()=>{
        setInsuranceType('OptumRx');
        setValue('insuranceType','OptumRx');
    }
    const handleTypeCareMark =()=>{
        setInsuranceType('Caremark');
        setValue('insuranceType','Caremark');
    }
    const handleTypeExpress =()=>{
        setInsuranceType('Express Scripts');
        setValue('insuranceType','Express Scripts');
    }
    const handleTypeOther =()=>{
        setInsuranceType('Other');
        setValue('insuranceType','Other');
    }
    const onClickBefore = () => {
        const insuranceInfoWatch = watch();
        dispatch({type:'UPDATE_INSURANCE_INFO',data:insuranceInfoWatch })    
        dispatch({type:'UPDATE_STEP',step:2 })
    }
    const onClickNext = () => {
        const insuranceInfoWatch = watch();
        dispatch({type:'UPDATE_INSURANCE_INFO',data:insuranceInfoWatch })
                
        if(access_token===''){
            dispatch(getHealthCareTokenAPI('GET_ELIGIBILITY'));
        }
        else
            dispatch(postHealthCareEligibility(access_token,postData));

        // dispatch({type:'UPDATE_STEP',step:4 })
    }

    const disabled = checkValidate();
    return (
        <form className={classes.form} noValidate>  
            <Container component="insurance" minWidth="sm">
                <Grid item container className={classes.sub_form}>
                    <Grid container direction="column" style={{textAlign: 'left'}}>
                        <Grid item fullWidth>
                            <p item style={{fontSize:'0.6em',margin:0}}>
                            Is your prescription covered, in whole or in part, under any state, federal, government program.
                            including bur not limited Medicare, Medicaid, Medigap, VA,DOD,or TRICARE?</p>
                        </Grid>
                        <Grid container direction='row' alignItems='center' > 
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='yes' selected={ bYesNo === 1 } variant="outlined" onClick={onClickYes}>
                                    YES
                                </SelectButton>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='no' selected={ bYesNo === -1 } variant="outlined" onClick={onClickNo}>
                                    NO
                                </SelectButton>
                            </Grid>
                            
                        </Grid>
                        <Grid container direction='row' alignItems='center' > 
                            <Grid item xs={6} sm={6}>
                            <SelectButton name='noInsurance' selected={ haveInsurance === 1} variant="outlined" onClick={onClickNoInsurance}>
                                NO INSURANCE
                            </SelectButton>
                            </Grid>
                            <Grid item xs={6} sm={6} >
                            <SelectButton name='notKnown' selected={ haveInsurance === -1 } variant="outlined" onClick={onClickNotKnown}>
                                NOT KNOWN
                            </SelectButton>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField
                            name="cardFirstName"
                            variant="outlined"
                            required
                            fullWidth
                            id="cardFirstName"
                            label="Prescription Card Holder First Name"
                            margin="normal"
                            error={!!errors.cardFirstName}
                            inputRef={register}
                            defaultValue={cardFirstName}
                            disabled={!bYesNo}
                            />
                            {errors.cardFirstName && <StepLabel error="false">CardFirstName is a required field!</StepLabel>}
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                            name="cardLastName"
                            variant="outlined"
                            required
                            fullWidth
                            id="cardLastName"
                            label="Prescription Card Holder Last Name"
                            margin="normal"
                            error={!!errors.cardLastName}
                            inputRef={register}
                            disabled={!bYesNo}
                            defaultValue={cardLastName}
                            />
                            {errors.cardLastName && <StepLabel error="false">CardLastName is a required field!</StepLabel>}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                            name="RxBIN"
                            variant="outlined"
                            required
                            fullWidth
                            id="RxBIN"
                            label="RxBIN"
                            margin="normal"
                            error={!!errors.RxBIN}
                            inputRef={register}
                            disabled={!bYesNo}
                            defaultValue={RxBIN}
                            />
                            {errors.RxBIN && <StepLabel error="false">RxBIN must be number and is a required field!</StepLabel>}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                            name="RxPCN"
                            variant="outlined"
                            required
                            fullWidth
                            id="RxPCN"
                            label="RxPCN"
                            margin="normal"
                            error={!!errors.RxPCN}
                            inputRef={register}
                            disabled={!bYesNo}
                            defaultValue={RxPCN}
                            />
                            {errors.RxPCN && <StepLabel error="false">RxPCN must be number and is a required field!</StepLabel>}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                            name="RxGroup"
                            variant="outlined"
                            required
                            fullWidth
                            id="RxGroup"
                            label="RxGroup"
                            margin="normal"
                            error={!!errors.RxGroup}
                            inputRef={register}
                            disabled={!bYesNo}
                            defaultValue={RxGroup}
                            />
                            {errors.RxGroup && <StepLabel error="false">RxGroup must be number and is a required field!</StepLabel>}
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField
                            name="cardID"
                            variant="outlined"
                            required
                            fullWidth
                            id="cardID"
                            label="Issuer/Member ID"
                            margin="normal"
                            error={!!errors.cardID}
                            inputRef={register}
                            disabled={!bYesNo}
                            defaultValue={cardID}
                            />
                            {errors.cardID && <StepLabel error="false">CardID must be number and is a required field!</StepLabel>}
                        </Grid>
                        <Grid item>
                            <p item style={{fontSize:'0.6em'}}>Prescription Insurance type</p>
                        </Grid>
                        <Grid container direction='row' alignItems='center' > 
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='typeOptumRx' selected={ localInsuranceType === 'OptumRx' } variant="outlined" disabled={!bYesNo} onClick={handleTypeOptum}>
                                OPTUM RX
                                </SelectButton>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='typeCareMark' selected={ localInsuranceType === 'Caremark' } variant="outlined" disabled={!bYesNo} onClick={handleTypeCareMark}>
                                    CAREMARK
                                </SelectButton>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='typeExpress' selected={ localInsuranceType === 'Express Scripts' } variant="outlined" disabled={!bYesNo} onClick={handleTypeExpress}>
                                    EXPRESS SCRIPTS
                                </SelectButton>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='typeOther' selected={ localInsuranceType==='Other' } variant="outlined" disabled={!bYesNo} onClick={handleTypeOther}>
                                    OTHER
                                </SelectButton>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <p item style={{fontSize:'0.6em',fontStyle:'italic'}}>All fields required</p>
                        </Grid>
                        <Grid container  Item  alignItems='center' direction='row' style={{justifyContent:'space-around'}}>
                            <Grid item xs={12} sm = {4} >
                                <Button type="button" className={classes.button} fullWidth variant="contained" color="primary" onClick={onClickBefore} >
                                <NavigateBefore />BACK
                                </Button>
                                <p className={classes.p1} style={{textAlign: 'center'}}>Doctor Info</p>
                            </Grid>
                            <Grid item xs={12} sm = {4}>
                                <Button type="button" className={classes.button} fullWidth variant="contained" color="primary" disabled={disabled} onClick={onClickNext} >
                                NEXT <NavigateNext />
                                </Button>
                                <p className={classes.p1} style={{textAlign: 'center'}}>Co-Pay Calculation</p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </form>
    )
}
