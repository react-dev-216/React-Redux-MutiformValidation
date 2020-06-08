import React, { useState, useEffect, useRef, useReducer } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { StepLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import ReCAPTCHA from "react-google-recaptcha";
import MuiPhoneNumber from 'material-ui-phone-number';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


import { userInfoReducer} from '../../reducer/UserInfoReducer'
import ListUSStates from '../../assets/NamesList';
import { countries } from '../../assets/NamesList';
import { languages } from '../../assets/NamesList';
import { SelectButton,webFormStyle } from './../../assets/WebEnrollCss';

// const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const SITE_KEY = "6LdHddEUAAAAAFWVsG1JXzjvUuxp12F7H3tw0dNm";
const INVISIBLE_SITE_KEY ="6Ld1lNMUAAAAAJvfD6i_gjWdgIkLsQW5qZxiRRSe";
const DELAY = 1500;



const SignupSchema = yup.object().shape({
    firstName:yup.string().required(),
    lastName:yup.string().required(),
    //    phone:yup.string().required(),
    email: yup.string().email().required(),  
    street:yup.string().required(),  
    apt:yup.string().required(),  
    zip:yup.string().matches(/^[0-9]{5}$/, 'Must be exactly 5 digits'),  
    country:yup.string().required(),  
    password: yup.string().required(),
    language:yup.string().required(),
//    birthday:yup.date().min(Date(1990, 11, 24)),
});

const useStyles = makeStyles(webFormStyle);

export default function FormPatient(props) {

    const classes = useStyles();

    const patientInfo = useSelector(state => state.userInfoReducer.patientInfo);
    const dispatch = useDispatch();

    const { register, handleSubmit, errors, watch,setValue } = useForm({
    validationSchema: SignupSchema,
    mode: 'onBlur',
    });

    const { type, gender, firstName, lastName, phone, email, street, apt, zip, country, birthday, password, language, contact} = patientInfo;

    const [ userType,setUserType ] = useState(type);
    const [ genderType,setGenderType ] = useState(gender);
    const [ contactType,setContactType ] = useState(contact);
    const [ phoneNumber,setPhoneNumber ] = useState(phone);
    const [ indexCountry,setIndexCountry ] = useState(()=>{
        for (let i = 0; i < countries.length; i++) {
            if(countries[i].label===country)
                return i;
        }
        return ;
    });
    const [ indexLanguage,setIndexLanguage ] = useState(()=>{
        for (let i = 0; i < languages.length; i++) {
            if(languages[i]===language)
                return i;
        }
        return ;        
    });
    const [ captcheValue,setCaptcheValue ] = useState('');
    const [ allowAuthorize,setAllowAuthorize ] = useState(false);
    const [ allowInsurance,setAllowInsurance ] = useState(false);
    const [ mobileMode, setMobileMode ] = useState(false);
    const recaptchaRef = useRef(null);
    

    useEffect(() => {
        setUserType(type);
        setGenderType(gender);
        setContactType(contact);
        setPhoneNumber(phone);

        // console.log('useEffect : ','component is mounted');
        register({ name : 'type'});
        register({ name : 'gender'});
        register({ name: 'phone'});
        register({ name : 'country'});
        register({ name : 'language'});
        register({ name : 'contact'});

        setValue('type',type);
        setValue('gender',gender);
        setValue('firstName',firstName);
        setValue('lastName',lastName);
        setValue('phone',phone);
        setValue('email',email);
        setValue('street',street);
        setValue('apt',apt);
        setValue('street',street);
        setValue('zip',zip);
        setValue('country',country);
        setValue('birthday',birthday);
        setValue('password',password);
        setValue('language',language);
        setValue('contact',contact);

        if( window.innerWidth < 768)
            setMobileMode(true);
        return () => {            
        };
    }, []);


    const checkValidate = () => {

        const patientInfoWatch = watch();
        // console.log("register Values :", patientInfoWatch);
        
        let item;
        for (item in patientInfoWatch) {
           if(patientInfoWatch[item] === '')
           return true;
        }
        for (item in errors) {
           if(errors[item] !== '')
           return true;
        }       

        if(allowInsurance == false || allowAuthorize == false)
            return true;
        
        if(!mobileMode && captcheValue ==='')
            return true;
        if(mobileMode){
            const ret = recaptchaRef.current.execute();
            if(ret === '')
                return true;
            console.log("recaptchaRef :", ret);
        }

        return false;
    }

    const onClickSignUp = () => {
        const patientInfoWatch = watch();
        dispatch({type:'UPDATE_PATIENT_INFO',data:patientInfoWatch })
        dispatch({type:'UPDATE_STEP',step:2 })
    }

    const onBlurTextField = (e) => {
        dispatch({type:'UPDATE_PATIENT_ITEM',item:e.target.name,value:e.target.value })
    }
    
    const onClickTypePatient =() =>{
        setIndexCountry(122);
        setUserType('patient');
        setValue('type','patient');
    }
    const onClickTypeDoctor = () =>{
        setUserType('HCP');
        setValue('type','doctor');
    }

    const onClickGenderMale = () => {
        setGenderType('male');
        setValue('gender','male');
    }

    const onClickGenderFemale = () => {
        setGenderType('female');
        setValue('gender','female');
    }
       
    const onChangeContactType = type => event =>{
        setContactType(type);
        setValue('contact',type)
    }

    const handleCountryChange = e => {
        const value = e.target.value;
        if(value === '' )
            errors.country = "Country is a required field";
        else
            errors.country = "";
        setValue('country',value)
    }
    const handleLanguageChange =e =>{
        const value = e.target.value;
        if(value === '' )
            errors.language = "Language is a required field";
        else
            errors.language = "";
        setValue('language',value)
    }

    const handleReCAPTCHAChange = value => {
        // console.log("Captcha value:", value);
        setCaptcheValue( value );
    }
    
    const asyncScriptOnLoad = () => {
    // console.log("asyncScriptOnLoad is called");
    };

    const handlePhoneNumber = (value) => {
        // console.log("phone number : ", value);\
        errors.phone = '';
        if(value.startsWith('+1 ('))
        {
            if(value.length<17 )
                errors.phone = 'error';
        }
        //setPhoneNumber(value);
        setValue('phone',value);
    }

    const handleBlurPhoneNumber = (event) => {
        const value = event.target.value;
        errors.phone = '';
        if(value.startsWith('+1 ('))
        {
            if(value.length<17 )
                errors.phone = 'error';

        }

        setPhoneNumber(value);
        setValue('phone',value);
    }

    const handleChangeAllowAuthorize = event => {
        setAllowAuthorize(event.target.checked);
    };

    const handleChangeAllowInsurance = event => {
        setAllowInsurance(event.target.checked);
    };

    const onSubmit = ( data ) => {
    //    e.preventDefault();
        // console.log(data);
        alert(JSON.stringify(data));
        const user = {
            firstName:data["firstName"] || undefined,
            lastName:data["lastName"] || undefined,
            phoneNumber:data["phone"]|| undefined,
            email: data["email"] || undefined,
            street:data["street"]|| undefined,
            apt:data["apt"]|| undefined,
            zip:data["zip"]|| undefined,
            country:data["country"]|| undefined,
            birthday:data["birthday"]|| undefined,
            password: data["password"] || undefined,
            language:data["language"]|| undefined,            
        }
    }

    const disabled = checkValidate();    

    return (
    <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Container component="patient" minWidth="sm">
            <Grid item className={classes.sub_form}>
                <Grid item container spacing={2}>
                    <p className={classes.p1}>Tell us about yourself</p>
                    <Grid container direction='row' alignItems='center' > 
                        <Grid item xs={6} sm={6}>
                        <SelectButton name={'patient'} selected={userType==='patient'} variant="contained" onClick={onClickTypePatient}>
                            I AM A PATIENT
                        </SelectButton>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                        <SelectButton name={'doctor'}  selected={userType==='doctor'} variant="contained" onClick={onClickTypeDoctor}>
                            I AM A HEALTH<br/> CARE PROVIDER
                        </SelectButton>
                        </Grid>
                        
                    </Grid>
                    <p className={classes.p1}>Gender</p>
                    <Grid container direction='row' alignItems='center' > 
                        <Grid item xs={6} sm={6}>
                        <SelectButton name='male' selected={genderType==='male'} variant="outlined" onClick={onClickGenderMale}>
                            MALE
                        </SelectButton>
                        </Grid>
                        <Grid item xs={6} sm={6} >
                        <SelectButton name='female' selected={genderType==='female'} variant="outlined" onClick={onClickGenderFemale}>
                            FEMALE
                        </SelectButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                        name="firstName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        margin="normal"
                        error={!!errors.firstName}
                        inputRef={register}
                        defaultValue={firstName}
                        />
                        {errors.firstName && <StepLabel error="false">{'This is a required field!'}</StepLabel>}
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        variant="outlined"
                        error={!!errors.lastName}
                        inputRef={register}
                        defaultValue={lastName}
                        />
                        {errors.lastName && <StepLabel error="false">{'This is a required field!'}</StepLabel>}
                    </Grid>
                    <Grid item xs={12}>
      
                        <MuiPhoneNumber
                            fullWidth 
                            id="phone"
                            name="phone"
                            variant="outlined" 
                            defaultCountry={'us'} 
                            onChange={handlePhoneNumber}
                            onBlur={handleBlurPhoneNumber}
                            label="Phone Number"
                            error={!!errors.phone}
                            value={phoneNumber}
                            disableDropdown={false}
                
                        />
                        {errors.phone && <StepLabel error="false">{'Please check invalid phone number'}</StepLabel>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        error={!!errors.email}
                        inputRef={register}
                        defaultValue={email}
                        />
                        {errors.email && <StepLabel error="false">{errors.email.message}</StepLabel>}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="street"
                        label="Street Address"
                        name="street"
                        error={!!errors.street}
                        inputRef={register}
                        defaultValue={street}
                        />
                        {errors.street && <StepLabel error="false">{'This is a required field!'}</StepLabel>}
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="apt"
                        label="Apt Address"
                        name="apt"
                        error={!!errors.apt}
                        inputRef={register}
                        defaultValue={apt}
                        />
                        {errors.apt && <StepLabel error="false">{'This is a required field!'}</StepLabel>}
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="zip"
                        label="ZIP Code"
                        name="zip"
                        error={!!errors.zip}
                        inputRef={register}
                        defaultValue={zip}
                        />
                        {errors.zip && <StepLabel error="false">{errors.zip.message}</StepLabel>}
                    </Grid>
                    <Grid item xs={12} sm={7} >
                        <Autocomplete
                            id="country"
                            style={{ maxWidth: 300 }}
                            options={countries}
                            autoHighlight
                            defaultValue={countries[indexCountry]}
                            onBlur={handleCountryChange}                    
                            getOptionLabel={option => option.label}
                            renderOption={option => (
                                <React.Fragment>
                                {option.label}
                                </React.Fragment>
                            )}
                            renderInput={params => (
                                <TextField
                                {...params}
                                name='Country' //{`_${params.id}`} // for hook register
                                label="Country"
                                variant="outlined"
                                fullWidth
                                error={!!errors.country}
                                // inputRef={register}
                                inputProps={{
                                    ...params.inputProps,
                                }}
                                />
                            )}
                        />
                        { errors.country && <StepLabel error="false" style={{paddingLeft:"1rem"}}>Country is a required field</StepLabel>}
                    </Grid>
            
                    <Grid item xs={12} sm={8}  >
                        <TextField
                            id="birthday"
                            name="birthday"
                            variant="outlined"
                            label="Birthday"
                            type="date"
                            defaultValue={birthday}
                            className={classes.textField}
                            error={!!errors.birthday}
                            inputRef={register}
                            fullWidth  
                            defaultValue={birthday}                  
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        error={!!errors.password}
                        inputRef={register}
                        defaultValue={password}
                        />
                        {errors.password && <StepLabel error="false" style={{paddingLeft:"1rem"}}>{'This is a required field!'}</StepLabel>}
                    </Grid>
                    <Grid xs={12} sm={12} item style={{textAlign:'left'}}>
                        <Autocomplete 
                            id="language"                   
                            style={{ maxWidth: 200 }}
                            options={languages}
                            defaultValue={languages[indexLanguage]}
                            autoHighlight
                            getOptionLabel={option => option}
                            onBlur={handleLanguageChange}
                            renderOption={option => (
                                <React.Fragment>
                                {option}
                                </React.Fragment>
                            )}
                            renderInput={params => (
                                <TextField
                                {...params}                        
                                name='language' // for hook register
                                label="Preferred Language"
                                variant="outlined"
                                fullWidth
                                error={!!errors.language}
                            //    inputRef={register}
                                inputProps={{
                                    ...params.inputProps,
                                }}
                                
                                />
                            )}
                        />
                        {errors.language && <StepLabel error="false" style={{paddingLeft:"1rem"}}>Language is a required field!</StepLabel>}
                    
                    </Grid>
                    <p style={{fontSize:'0.6em',margin:0}}>What is the best way for us to get in touch?</p>
                    <Grid container direction='row' alignItems='flex-start' item> 
                        <Grid item xs={12} sm={10} md={4}>
                        <SelectButton  name='contactMail'  selected={contactType === "EMAIL"} variant="outlined" onClick={onChangeContactType('EMAIL')}>
                            E-MAIL
                        </SelectButton>
                        </Grid>
                        <Grid item xs={12} sm={10} md={4}>
                        <SelectButton name='contactText' selected={contactType === "TEXT"} variant="outlined" onClick={onChangeContactType('TEXT')}>
                            TEXT
                        </SelectButton>
                        </Grid>
                        <Grid item xs={12} sm={10} md={4}>
                        <SelectButton name='contactBoth' selected={contactType === "EMAIL & TEXT"} variant="outlined" onClick={onChangeContactType('EMAIL & TEXT')}>
                            BOTH
                        </SelectButton>
                        </Grid>
                    </Grid>
                    <p style={{fontSize:'0.6em',margin:0,fontStyle:'italic'}}>All fields required</p>
                    <Grid item xs={12} >
                        <FormControlLabel style={{flexDirection: 'row',textAlign: 'justify',
                                            alignItems: 'flex-start'}}
                        control={<Checkbox name ='allowInsurance' value="allowInsurance" color="primary" onClick={handleChangeAllowInsurance}/>}
                        label="This website will ask you for your contact info and insurance details.
                            By checking this box, I agree that Shire and trusted paries working with Shire may use this information
                            to provide benefits verification and assist me and my doctor with any necessary insurance approvals for Xiidra.
                            I may also be contacted regarding my coverage for Xiidra."
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <FormControlLabel style={{flexDirection: 'row',textAlign: 'justify',
                                            alignItems: 'flex-start'}}
                        control={<Checkbox name='allowAuthorize' value="allowAuthorize" color="primary" onClick={handleChangeAllowAuthorize}/>}
                        label="By checking this box, I am certifying that I have received any authorization necessary to transmit health information to Shire.
                            and parties working with Shire. In order for Shire to provide benefits verification and assist with any necessary insurance approvals for Xiidra.
                            and ro communicate with thr patient regarding the benefits verification process."
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} style={{textAlign: 'start'}}>
                        <ReCAPTCHA 
                            // theme="dark"
                            sitekey={mobileMode? INVISIBLE_SITE_KEY : SITE_KEY}
                            onChange={handleReCAPTCHAChange}
                            asyncScriptOnLoad={asyncScriptOnLoad}
                            
                            size = {mobileMode? "invisible" : "normal"}
                            ref={recaptchaRef}
                        />
                    </Grid>
                </Grid>
                <Grid item container item xs={12}>
                    <Grid item xs={12} sm = {6} md={6}>
                        <Button 
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={onClickSignUp}
                        className={classes.button}
                        disabled={disabled}
                        >
                        Sign Up >>
                        </Button>
                    </Grid>
                </Grid>
                    
            </Grid>
        </Container>
    </form>    
    );
}

