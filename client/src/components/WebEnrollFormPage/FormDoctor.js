import React, { useState, useEffect, useReducer, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { StepLabel } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { NavigateBefore,NavigateNext } from '@material-ui/icons';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';

import { requestMedProTokenAPI, searchOneHCPByKey } from '../../actions/MedProAPIAction'
import { webFormStyle } from './../../assets/WebEnrollCss';
import { listUSStates } from './../../assets/NamesList';
import { StyledToggleButton } from './../../assets/WebEnrollCss';
import SearchResultModal from './SearchResultModal';
const useStyles = makeStyles(webFormStyle);

const SignupSchema = yup.object().shape({   
    // doctor information
    //firstName:yup.string(),
    //lastName:yup.string(),
    city:yup.string().required(),
    state:yup.string().required(),
});

export default function FormDoctor(props) {

    const classes = useStyles();

    const doctorInfo = useSelector(state => state.userInfoReducer.doctorInfo);
    const searchHCPReducer = useSelector(state => state.searchHCPReducer);
    const { HCPs,access_token} = searchHCPReducer;
    const dispatch = useDispatch();

    const { register, handleSubmit, errors, watch,setValue, } = useForm({
    validationSchema: SignupSchema,
    mode: 'onBlur',
    });

    const { firstName, lastName, city, state, radius } = doctorInfo;
    // const { changeDoctorInfo } = props;


    const [indexState,setIndexState] = useState(()=>{
        for (let i = 0; i < listUSStates.length; i++) {
            if(listUSStates[i].name===state)
                return i;
        }
        return ;
    });

    const [nameErr,setNameErr] = useState(false);
    const [localRadius, setLocalRadius] = useState(radius);
    const [ bModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // console.log('useEffect : ','component is mounted');
        register({ name : 'radius'});
        register({ name : 'state'});

        setValue('firstName',firstName);
        setValue('lastName',lastName);
        setValue('city',city);
        setValue('state',state);
        setValue('radius',radius);

    //    console.log("doctorInfo ++ ",doctorInfo);

        return () => {            
        };
    }, []);

    const checkValidate = () => {
        const doctorInfoWatch = watch();
        //  console.log("doctorInfo register Values :", doctorInfoWatch);
        if(doctorInfoWatch.firstName ==='' && doctorInfoWatch.lastName ==='')
            return true;

        let item;
        for (item in doctorInfoWatch) {
            if(item === 'firstName' || item === 'lastName')
                continue;
            if(doctorInfoWatch[item] === '')
                return true;
        }
        for (item in errors) {
            if(errors[item] !== '')
                return true;
        }
        
        return false;
    }

    const handleStateChange =(e) => {
        const value = e.target.value;
        //    console.log("handleStateChange : ",value);
        if(value === '' )
            errors.state = "State is a required field";
        else
            errors.state = "";
        setValue('state',value);
    }

    const handleFirstNameChange = (e) => {
        if(e.target.value !==''){
            // document.querySelector("#lastName").value = '';   
            setNameErr(false);
        }
        if(e.target.value ==='' && document.querySelector("#lastName").value ==='')
             setNameErr(true);

    }
    const handleLastNameChange = (e) => {
        if(e.target.value !==''){
            // document.querySelector("#firstName").value = '';   
            setNameErr(false);
        }
        if(e.target.value ==='' && document.querySelector("#firstName").value ==='')
            setNameErr(true);
    }

    const handleRadius = (event, newRadius) => {
        setLocalRadius(newRadius);
        setValue('radius',newRadius);
    };
    
    const getValidList=(list)=>{

        let i;
        const validList=[];
        const doctorInfoWatch = watch();
        const {firstName,lastName,city,state} = doctorInfoWatch;
        let abbreviation ='';
        for (let i = 0; i < listUSStates.length; i++) {
            if(listUSStates[i].name===state)
                abbreviation = listUSStates[i].abbreviation;
        }

        // console.log('HCP information',doctorInfoWatch);
        for(i=0;i<list.length;i++){
            // console.log('HCP candidates list',list[i]);
            const { name_First,name_Middle,name_Last,bestInfo_Address_City,bestInfo_Address_State} = list[i];
            if( (name_First.toLowerCase().includes(firstName.toLowerCase()) || name_First.toLowerCase().includes(lastName.toLowerCase()) ||
                 name_Middle.toLowerCase().includes(firstName.toLowerCase()) || name_Middle.toLowerCase().includes(lastName.toLowerCase()) ||
                 name_Last.toLowerCase().includes(firstName.toLowerCase()) || name_Last.toLowerCase().includes(lastName.toLowerCase())) &&
              bestInfo_Address_City.toLowerCase().includes(city.toLowerCase()) && bestInfo_Address_State.toLowerCase().includes(abbreviation.toLowerCase()) )
              {
                validList.push(list[i]);
                // console.log(' insert HCP ',list[i]);
              }
        }
  
        dispatch({type:'GET_HCP_SUCCESS',data: validList});
        

    }
    const getAccessToken = (callback) =>{
        // dispatch({type:'GET_HCP_STATUS',data: "TOKEN_UNAUTHORIZED"});
        dispatch({type:'GET_HCP_STATUS',data: "TOKEN_LOADING"});
        requestMedProTokenAPI((token)=>{
            if(token !== 'error'){
                dispatch({type:'GET_HCP_STATUS',data: "TOKEN_SUCCESS"});
                dispatch({type:'GET_ACCESS_TOKEN',data: token});
                callback(token);
                return;
            }
            else {
                
                callback('error');
            }
            return;
        });
    }
    const getHCPInfoByKey = (token,key) =>{
        let result;  
        searchOneHCPByKey(token,key,(res)=>{
            const {status, data} = res;
            if(status === 200){
                getValidList(data);
                // dispatch({type:'GET_HCP_SUCCESS',data: data});
                // console.log("HCP INFORMATION RECEIVED: ", data);
            }
            else{
                // console.log("GET_HCP_UNAUTHORIZED: ", res);
                getAccessToken((ret_token)=>{
                    if(ret_token === 'error' ){
                        dispatch({type:'GET_HCP_STATUS',data: "TOKEN_FAILED"});
                    }
                    else {
                        searchOneHCPByKey(ret_token,key,(res)=>{
                            const {status, data} = res;
                            if(status === 200){
                                getValidList(data);
                                // dispatch({type:'GET_HCP_SUCCESS',data: data});
                                // console.log("HCP INFORMATION RECEIVED: ", data);
                            }
                            else{
                                dispatch({type:'GET_HCP_STATUS',data: "TOKEN_FAILED"});
                            }
                        });
                    }
                });
            }
        }); 
    }

    const onClickSearch = e => {

        //    console.log(searchHCPs);
        const doctorInfoWatch = watch();
        let abbreviation ='';
        for (let i = 0; i < listUSStates.length; i++) {
            if(listUSStates[i].name===doctorInfoWatch.state)
                abbreviation = listUSStates[i].abbreviation;
        }

        dispatch({type:'GET_HCP',data:""});

        const key = `${doctorInfoWatch.firstName} ${doctorInfoWatch.lastName} ${abbreviation} ${doctorInfoWatch.city}`;
        if(access_token === '')
            getAccessToken((token)=>{
                //      console.log('Search access: ', token);
                if(token === 'error'){
                    dispatch({type:'GET_HCP_STATUS',data: "TOKEN_FAILED"});
                }
                else{
                    getHCPInfoByKey(token,key);
                    // getHCPInfo(token,1000);
                }
            });
        else
            getHCPInfoByKey(access_token,key);

        setModalOpen(true);    
    }

    const onClickBefore = () => {
       const doctorInfoWatch = watch();
       dispatch({type:'UPDATE_DOCTOR_INFO',data:doctorInfoWatch })        
       dispatch({type:'UPDATE_STEP',step:1 })
    }
    const onClickNext =(index) =>{
        // console.log('onClickNext index =>', index);
        setModalOpen(false);
        const doctorInfoWatch = watch();
        const {name_First, name_Last,npi_Number,bestInfo_Address_Line1,bestInfo_Address_Zip} = HCPs[index];
        const doctor = {firstName:name_First,lastName:name_Last,NPI:npi_Number,addr: bestInfo_Address_Line1,
                    city:doctorInfoWatch.city,zip:bestInfo_Address_Zip,state:doctorInfoWatch.state,radius:doctorInfoWatch.radius};
        // console.log('doctor information =>', doctor);
        dispatch({type:'UPDATE_DOCTOR_INFO',data:doctor })
        dispatch({type:'UPDATE_STEP',step:3 })
    };
    const onCloseModal =()=>{

        dispatch({type:'GET_HCP_SUCCESS',data: []});
        setModalOpen(false);
    }

    const disabled = checkValidate();
    return(
    <form className={classes.form} noValidate>        
        <Container component="doctor" minWidth="sm">
            <Grid item container className={classes.sub_form}>
                <SearchResultModal bModalOpen={bModalOpen}  onCloseModal={onCloseModal} onClickNext={onClickNext} />
                <Grid container spacing={2} direction="column" style={{textAlign: 'left'}}>
                    <Grid item xs={12} sm={10}>
                        <TextField
                        name="firstName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="Doctor's first Name"
                        placeholder="Doctor's first name"
                        margin="normal"
                        error={nameErr}
                        inputRef={register}
                        defaultValue={firstName}
                        onBlur={handleFirstNameChange}
                        />
                        {nameErr && <StepLabel error="false">First  Name or Last Name is reqiured</StepLabel>}
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        <TextField
                        name="lastName"
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Doctor's last Name"
                        margin="normal"
                        error={nameErr}
                        inputRef={register}
                        defaultValue={lastName}
                        onBlur={handleLastNameChange}
                        />
                        {nameErr && <StepLabel error="false">First  Name or Last Name is reqiured</StepLabel>}
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                        name="city"
                        variant="outlined"
                        required
                        fullWidth
                        id="city"
                        label="City"
                        margin="normal"
                        error={!!errors.city}
                        inputRef={register}
                        defaultValue={city}
                        />
                        {errors.city && <StepLabel error="false">{errors.city.message}</StepLabel>}
                    </Grid>
                    <Grid xs={12} sm={12} item>
                        <Autocomplete
                        id="state"
                        style={{ maxWidth: 300 }}
                        options={listUSStates}
                        autoHighlight
                        onBlur={handleStateChange}
                        getOptionLabel={option => option.name}
                        defaultValue={listUSStates[indexState]}
                        renderOption={option => (
                            <React.Fragment>
                            {option.name}
                            </React.Fragment>
                        )}
                        renderInput={params => (
                            <TextField
                            {...params}
                            label="state"
                            variant="outlined"
                            name='state' // for hook register
                            fullWidth
                            error={!!errors.state}
                            inputProps={{
                                ...params.inputProps,
                            //   autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                            />
                        )}
                        />
                    {errors.state && <StepLabel error="false" style={{paddingLeft:"1rem"}}>State is a required field</StepLabel>}
                    
                    </Grid>
                    <Grid item xs={12}>
                         <p style={{fontSize:'0.6em',margin:0}}>Radius</p>
                        <ToggleButtonGroup
                            fullWidth
                            value={localRadius}
                            exclusive
                            onChange={handleRadius}
                            aria-label="doctor radius"
                        >
                            <StyledToggleButton value="1mile" aria-label="left aligned">
                            1 MILE
                            </StyledToggleButton>
                            <StyledToggleButton value="2mile" aria-label="centered">
                            2 MILES
                            </StyledToggleButton>
                            <StyledToggleButton value="5mile" aria-label="right aligned">
                            5 Miles
                            </StyledToggleButton>
                            <StyledToggleButton value="10mile" aria-label="justified">
                            10 Miles
                            </StyledToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                <Grid item>
                    <p item style={{fontSize:'0.6em',fontStyle:'italic'}}>All fields required</p>
                </Grid>
                </Grid>
                <Grid item container direction='row' style={{justifyContent: 'space-around'}} >
                    <Grid item xs={12} sm = {5} md={5}>
                        <Button type="button" className={classes.button} fullWidth variant="contained" color="primary" onClick={onClickBefore} >
                        <NavigateBefore />BACK
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm = {5} md={5}>
                        <Button 
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={onClickSearch}
                        className={classes.button}
                        disabled ={disabled}
                        >
                        SEARCH <NavigateNext/>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    </form>
    )

}