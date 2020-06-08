import axios from 'axios';
import qs from 'querystring'

const FingerTip_API_KEY = 'Your-API-key';
const FingerTip_API_ROOT = 'http://api.fingertipformulary.com';
const FingerTip_API_PROVIDER = '/providers.json';
const FingerTip_API_HEALTH_PLANS = '/health_plans.json';
const FingerTip_API_NDCS = '/ndcs/display_data.json';
const FingerTip_API_DRUGS = '/drugs.json';
const FingerTip_API_COPAY = '/copays.json';
const FingerTip_DRUG_ID = Drug_ID;

export const setFingerTipCommand = (command) => dispatch => {
  dispatch({type:'SET_FINGERTIP_COMMAND',data:command});
}
export const clearFingerTipCommand = () => dispatch => {
  dispatch({type:'COMMAND_FINGERTIP_CLEAR'});
}
export const clearFingerTipStatus = () => dispatch => {
  dispatch({type:'STATUS_FINGER_CLEAR'});
}
export const setFingerTipStatus = (status) => dispatch => {
  dispatch({type:'SET_FINGERTIP_STATUS',data:status});
}

export const getProvidersInfoAPI = (command)=>(dispatch) => {
    dispatch(setFingerTipStatus('GET_PENDING'));
    const URL = FingerTip_API_ROOT+FingerTip_API_PROVIDER + "?api_key="+FingerTip_API_KEY;
    axios.get('/api/FingerTip' + FingerTip_API_PROVIDER)
    .then((res) => {
      //  console.log(res);
      const { status, data} = res;
      if(status === 200){
         dispatch(setFingerTipCommand(command));
         dispatch({type:'GET_PROVIDERS_SUCCESS',data:data});
         // console.log("provider list => ", data);
         return;
      }
      else{
      //  console.log("Status ERROR: ", status);
        return;
      }
    })
    .catch((err) => {
     // console.log("Request ERROR: ", err);
    })

}

export const getDrugsInfoAPI = (command) =>{

}
const getHealthPlansAPI  = (providerID,callback)=>{
    const URL = FingerTip_API_ROOT+FingerTip_API_HEALTH_PLANS + "?api_key="+FingerTip_API_KEY+"&provider_id="+providerID;
    const Local_URL = '/api/FingerTip' +FingerTip_API_HEALTH_PLANS + "?api_key="+FingerTip_API_KEY+"&provider_id="+providerID;

    axios.get(Local_URL)
    .then((res) => {
      console.log('getHealthPlansAPI =>',res);
      const { status, data} = res;
      if(status === 200){
         // console.log("provider list => ", data);
         callback(data);
         return;
      }
      else{
        //console.log("getHealthPlansAPI ERROR: ", res);
        return;
      }
    })
    .catch((err) => {
      console.log("getHealthPlansAPI Request ERROR: ", err);
    })
}
export const getCalculateAPI = (drug_id,healthPlan_id) => dispatch => {
    const URL = FingerTip_API_ROOT+FingerTip_API_COPAY + "?api_key="+FingerTip_API_KEY+"&drug_id="+drug_id+"&health_plan_id="+healthPlan_id;
    const Local_URL = '/api/FingerTip' +FingerTip_API_COPAY + "?api_key="+FingerTip_API_KEY+"&drug_id="+drug_id+"&health_plan_id="+healthPlan_id;
    axios.get(Local_URL)
    .then((res) => {
      // console.log('getCalculateAPI =>',res);
      const { status, data} = res;
      if(status === 200){
        // console.log("provider list => ", data);
        dispatch({type:'GET_COPAY_SUCCESS',data:data});
         return;
      }
      else{
        //  console.log("Status ERROR: ", status);
        return;
      }
    })
    .catch((err) => {
       console.log("getCalculateAPI Request ERROR: ", err);
    })

}
export const getCopayInfo =(providers,insuranceType,command)=>dispatch =>{
  dispatch({type:'COPAY_CLEAR'});
  let i, bOK;
  bOK = false;
  for (i = 0; i<providers.length;i++){
    if ( providers[i].provider.name.toLowerCase().includes(insuranceType.toLowerCase())){
      bOK = true;
      const providerID = providers[i].provider.id;
      getHealthPlansAPI(providerID,(healthPlans)=>{
        console.log('getCopayInfo : health_plans =>',healthPlans);
        let j;
        for(j=0;j<healthPlans.length;j++){
          dispatch(getCalculateAPI(FingerTip_DRUG_ID,healthPlans[j].health_plan.displayid));
        }
      })
    }    
  }

  if(bOK === false){
    dispatch(setFingerTipStatus('COMMAND_FINGERTIP_STOP'));
  }
}



