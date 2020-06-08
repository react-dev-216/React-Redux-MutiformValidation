import React,{ useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Container from '@material-ui/core/Container';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { StepLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import { SelectButton,webFormStyle,primary1,modalStyle} from './../../assets/WebEnrollCss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import * as yup from "yup";

import { getProvidersInfoAPI, getDrugsInfo, getCopayInfo, clearFingerTipCommand, clearFingerTipStatus } from '../../actions/FingerTipAPIAction'

import AllergyImg from '../../assets/img/allergy.png'
import KnownImg from '../../assets/img/Known.png'
import CalcImg from '../../assets/img/calculating.gif'
import LoadingImg from '../../assets/img/loading.gif'

const useStyles = makeStyles(webFormStyle);
const useModalStyles = makeStyles(modalStyle);

export default function FormCoPay(props) {

    const classes = useStyles();
    const modalClasses = useModalStyles();

    const patientInfo= useSelector(state => state.userInfoReducer.patientInfo);
    const patientNote = useSelector(state => state.userInfoReducer.patientNote);
    const insuranceInfo = useSelector(state => state.userInfoReducer.insuranceInfo);
    const fingerTipInfo = useSelector(state => state.fingerTipReducer);

    const dispatch = useDispatch();

    const { contact, type } = patientInfo;
    const { allergy, other, note } = patientNote;
    const { insuranceType } = insuranceInfo;
    const { copays, providers, statusFingerTip, commandFingerTip } = fingerTipInfo;

    const [ bAllergy, setAllergy ] = useState(allergy ==='' ? 0 : 1);
    const [ bOther, setOther] = useState(other ==='' ? 0 : 1);
    const [ counter,setCounter] = useState(0);
    const [ editType, setEditType] = useState('');
    const [ bOpen, setOpen] = useState(false);

    const [ textAllergy, setTextAllergy ] = useState(allergy);
    const [ textOther, setTextOther ] = useState(other);
    const [ textNote, setTextNote ] = useState(note);
    const [ checkYears, setCheckYears ] = useState(false);
    const [ copayText, setCopayText ] = useState('');
    const [ errorNote, setErrorNote ] = useState('');

    useEffect(() => {
        if(copays.length > 0){
            let text='';
                // copays.map((item, index) => {
                //     const copay=JSON.stringify(item);
                //     text = text.concat(copay);                   
                //     });
            text=JSON.stringify(copays[0]);    
            text=text.replace(/{/g,'').replace(/"/g,'').replace(/,/g,'\n').replace(/}/g,'\n') ;      
            setCopayText(text); 
            setCounter(1);

        }
        else{
            setCounter(0);
            calculateCoPay();
        }

        // const timer = setTimeout(() => {
        //     setCounter(1);
        // }, 4500);    
        // return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        console.log('statusFingerTip => ', statusFingerTip);
        switch(statusFingerTip){
            case 'GET_PROVIDERS_SUCCESS':
                if(commandFingerTip === 'CMD_COPAY'){
                    dispatch(clearFingerTipCommand());
                    dispatch(getCopayInfo(providers,insuranceType,''));
                }
                break;
            case 'GET_COPAY_SUCCESS':                
                let text='';
                if(copays.length>0){
                    text=JSON.stringify(copays[0]); 
                    text=text.replace(/{/g,'').replace(/"/g,'').replace(/,/g,'\n').replace(/}/g,'\n') ;  
                    setCopayText(text); 
                    setCounter(1);  
                }
                    dispatch(clearFingerTipStatus());
                break;
            case 'COMMAND_FINGERTIP_STOP':
                setCopayText("Not Found Insurance Type");
                dispatch(clearFingerTipStatus());
            default:
        }
        return () => {
            
        };
    }, [statusFingerTip]);

    const calculateCoPay = () => {
        
        if(providers.length === 0)
            dispatch(getProvidersInfoAPI('CMD_COPAY'));
        else{
            dispatch(getCopayInfo(providers,insuranceType,''));

        }
    }
    const onClickSeeCoPay = () => {             // CTA options of "SEE MY COPAY" button
        switch(type){
            case 'HCP':
                dispatch({type:'UPDATE_STEP',step:6 });
                break;
            case 'patient':
                setCounter(2);
                
                break;
            case 'Benefits':
                break;
            default:                
        }
    }
    const onClickYesAllergy = () => {
        setAllergy(1);
        setEditType('allergy');
        setOpen(true);
    }
    const onClickNoAllergy=()=>{
        setAllergy(-1);
        setTextAllergy('');
    }
    const onClickYesOther=()=>{
        setOther(1);
        setEditType('other');
        setOpen(true);
    }
    const onClickNoOther=()=>{
        setOther(-1);
        setTextOther('');
    }

    const onClickEdit = () => {
        setEditType('note');
        setOpen(true);
    }

    const onCheckYears = (event) => {
        setCheckYears(event.target.checked);
    }

    const checkValidate = () => {
        if( bAllergy === 0 || bOther ===0 || checkYears === false)
            return true;
        return false;
    }
    const onClickFinish = () => {
        const patientNoteWatch = { allergy:textAllergy, other:textOther, note:textNote };
        dispatch({type:'UPDATE_PATIENT_NOTE',data:patientNoteWatch });
        dispatch({type:'UPDATE_STEP',step: 5});
    }

    const onClickSave = async(e) => {

        const text = document.getElementById('txt').value;

        const words = text.split(" ");
        // console.log(words);
        let item;


        switch(editType){
            case 'allergy':
                setTextAllergy(text);
                break;
            case 'other':
                setTextOther(text);
                break;
            case 'note':
                if(editType!=='TEXT')
                {
                for(item in words){
                    const word = words[item];
                    let schema = yup.string().email();
 
                    if(word.includes('@')){
                    const ret = await schema.isValid(word);
                         if( ret === false){
                            setErrorNote(word); 
                                return; 
                        }
                        // var n1 = word.indexOf('@');
                        // var n2 = word.lastIndexOf('.');
                        // if(n1>=n2){
                        //     setErrorNote(true); 
                        //     return;                   
                        // }
                    }
                }}
                setTextNote(text);
                break;
            default:
                return;
        }   
        setErrorNote('');  
        setOpen(false);
    };

    const onCloseModal =()=>{
        setErrorNote('');  
        setOpen(false);
    }

    const getText =(editType)=>{
        switch(editType){
            case 'allergy':
                return textAllergy;
            case 'other':
                return textOther;
            case 'note':                
                return textNote;
            default:
                return '';
        }        
    } 

    const onClickBefore = () => {
        const patientNoteWatch = { allergy:textAllergy, other:textOther, note:textNote };
        dispatch({type:'UPDATE_PATIENT_NOTE',data:patientNoteWatch });
        dispatch({type:'UPDATE_STEP',step:3 });
    }

    const disabled = checkValidate();

    const bDisabledButton = counter === 2 ? false : true ;
    return (
    <form className={classes.form} noValidate>          
        <Container component="CoPay" minWidth="sm">
            <Grid item container className={classes.sub_form}>
                <Grid item container direction={'column'} style={{background:'rgb(155, 193, 226, 0.23)',textAlignLast:'center'}}>
                    <Grid item xs={12} >
                        <Modal
                            className={modalClasses.modal}
                            open={bOpen}
                            onClose={onCloseModal}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                            timeout: 500,
                            }}
                        >
                        <Fade in={bOpen}>
                        <div className={modalClasses.paper}>
                            <h4>Please input your {editType} information</h4>
                            {/* <textarea autofocus id='txt' rows="9" cols="100" style={{width:'100%',fontSize: '1.2em', 'fontFamily':'inherit'}}>
                            {getText(editType)}
                            </textarea> */}
                            <TextareaAutosize
                                rows={9}
                                columns={100}
                                id='txt'
                                aria-label="maximum height"
                                defaultValue={getText(editType)}
                                style={{width:'100%',fontSize: '1.2em', 'fontFamily':'inherit'}}
                                />
                            {errorNote !=='' && <StepLabel error="false" style={{padding:"0.6rem",fontSize: '1em'}}>{'Please check invalid email address : '}{errorNote}</StepLabel>}
                            <Grid item container direction='row' style={{justifyContent: 'space-evenly'}}>
                            <Button className={classes.spanButton} onClick={onClickSave}>Save</Button>
                            <Button className={classes.spanButton} onClick={onCloseModal}>Cancel</Button>
                            </Grid>
                        </div>
                        </Fade>    
                        </Modal>
                    </Grid>
                    <Grid item>
                        { (counter===0) &&
                            <img src={CalcImg} alt="Calculating ..." style={{marginBottom:'1rem',height:'20%',width:'100%'}} />
                        }
                        { (counter===1) &&
                            <img src={LoadingImg} alt="Loading ..." style={{marginBottom:'1rem',height:'20%',width:'100%'}} />
                        }
                        { (counter ===2) &&
                            <textarea rows="10" cols="100" style={{fontSize: 'inherit',width:'100%', 'fontFamily':'inherit',border:'0px'}}>
                                {copayText}
                            </textarea>

                        }
                        </Grid>
                        <Grid item xs={12} sm = {8}>
                        <Button  type="button" fullWidth disabled={ copays.length>0 ? false : true } variant="contained"  color="primary" //  onClick={onClick} 
                                className={classes.button} onClick={onClickSeeCoPay}>
                                SEE MY COPAY<NavigateNext />
                        </Button>
                    </Grid>    
                    <br/>
                    <Grid container spacing={0} direction="column" style={{textAlign: 'left'}}>
                        <Grid item xs={8} sm = {4} style={{alignSelf:'center'}}>
                        <img src={AllergyImg} alt="AllergyImg ..." style={{width:'100%'}} />
                        </Grid>
                        <Grid item  xs={12} sm = {10} style={{alignSelf:'center',textAlign:'justify'}}>
                            <p item style={{fontSize:'0.8em',margin:0}}>Do you have any allergies pharmacist should be aware of?</p>
                        </Grid>
                        <Grid container direction='row' alignItems='center' > 
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='yesAllergy' disabled={bDisabledButton} selected={ bAllergy === 1 } variant="outlined" onClick={onClickYesAllergy}>
                                    YES
                                </SelectButton>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <SelectButton name='noAllergy' disabled={bDisabledButton} selected={ bAllergy === -1 } variant="outlined" onClick={onClickNoAllergy}>
                                    NO
                                </SelectButton>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={12} sm = {8} style={{alignSelf:'center'}}>
                        <img src={KnownImg} alt="KnownImg ..." style={{width:'100%'}} />
                        </Grid>
                        <Grid  xs={12} sm = {10} style={{alignSelf:'center',textAlign:'justify'}}>
                            <p item style={{fontSize:'0.8em',margin:0}}>Do you have any other conditions your pharmacist should be aware of?</p>
                        </Grid>
                        <Grid container direction='row' alignItems='center' > 
                            <Grid item xs={6} sm={6}>
                            <SelectButton name='yesOther' disabled={bDisabledButton} selected={ bOther === 1} variant="outlined" onClick={onClickYesOther}>
                                YES
                            </SelectButton>
                            </Grid>
                            <Grid item xs={6} sm={6} >
                            <SelectButton name='noOther' disabled={bDisabledButton} selected={ bOther === -1 } variant="outlined" onClick={onClickNoOther}>
                                NO
                            </SelectButton>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid item>
                            <p item style={{fontSize:'0.6em',margin:0}}>What is the best way for us to get in touch?</p>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} style={{margin:'8px',alignSelf: 'flex-center',height:'20vh',maxHeight: '200px',display:'inline-grid',}}>
                            <Grid item xs={4} sm={1} style={{margin:'0px', justifySelf: 'flex-end'}}>
                                <a href='#edit'><p item style={{fontSize:'0.6em',margin:0}} onClick={onClickEdit}>Edit</p></a>
                            </Grid>
                            <Grid item >
                            <p item style={{height:'3em',fontSize:'0.6em',margin:0,color:primary1}}><b>{contact}</b></p>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <br/>
                <Grid item xs={12} sm = {12}>
                    <Button  type="button" disabled={disabled} fullWidth  variant="contained"  color="primary"  onClick={onClickFinish} 
                            className={classes.button} >
                            FINISH  <NavigateNext />
                    </Button>
                </Grid>
                <br/>
                <Grid item xs={12} >
                    <FormControlLabel style={{flexDirection: 'row',textAlign: 'justify',
                                        alignItems: 'flex-start'}}
                    control={<Checkbox value="allowExtraEmails" color="primary" onClick={onCheckYears} />}
                    label="I confirm that I'm at least 18 years old and that I would like to receive information about Xiidra
                    treatment options, saving, and other information from Shire. I understand that the Xiidra Hraider program will 
                    send me information about Xiidra and I can opt out of these communications at any time."
                    />
                </Grid>
                <br/>
                <Grid item style={{flexDirection: 'row',textAlign: 'justify',
                                            alignItems: 'flex-start'}}>
                    <p item style={{fontSize:'1rem',margin:0}}>
                        We went to let you know that Shire respects your personal information . AI personal and/or medical information you have
                        provided will be kept confidential and will not be used ot distributed to any purpose other than what is explained in our Privacy
                        Notice statment. We encourage you to read our <a href="#privacy">Privacy Notice</a>. this consent will be in effect until such time
                        as you opt out of the program. 
                    </p>
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
