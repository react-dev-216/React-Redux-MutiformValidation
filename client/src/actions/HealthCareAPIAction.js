import axios from 'axios';
import qs from 'querystring'

import { HealthCare_API_ROOT, HealthCare_CLIENT_ID,HealthCare_CLIENT_SECRET,HealthCare_AUTHORIZE_TOKEN_URL,HealthCare_GRANT_TYPE,HealthCare_ELIGIBILITY_CONTENT_TYPE,
        HealthCare_ELIGIBILITY_URL,HealthCare_ELIGIBILITY_HEALTH_CHECK_URL } from './../constants/service-info.js'
import {  GET_HEALTH,
          GET_HEALTH_SUCCESS,
          GET_HEALTH_TOKEN,
          GET_HEALTH_TOKEN_SUCCESS,
          GET_HEALTH_ELIGIBILITY_SUCCESS,
          GET_HEALTH_FAILED,
          GET_HEALTH_STATUS,
          STATUS_HEALTH_CLEAR,
          COMMAND_HEALTH_CLEAR,
          SET_HEALTH_COMMAND} from './../reducer/HealthCareReducer.js';


export const getHealthCareTokenAPI = (nextCommand)=> (dispatch) => {
  // console.log('getHealthCareTokenAPI => ', dispatch);
    dispatch({type:GET_HEALTH_TOKEN});
    const URL="http://localhost:5000/api/HealthCare";

    // axios.get('http://localhost:5000/api/HealthCare'+HealthCare_AUTHORIZE_TOKEN_URL)
     axios.get("/api/HealthCare"+HealthCare_AUTHORIZE_TOKEN_URL)
     .then((res) => {
        const { status, data} = res;
        if(status === 200){
          const token = data.access_token;
          // console.log("requestTokenAPI TOKEN : ", token);
          dispatch(setHealthCareCommand(nextCommand));
          dispatch({type:GET_HEALTH_TOKEN_SUCCESS,data:token});
        }else
          dispatch({type:GET_HEALTH_FAILED});
     })
     .catch((err) => {
      console.log("HCP ERROR: ", err);
      dispatch({type:GET_HEALTH_FAILED});
    })  

}

export const postHealthCareEligibility = (token,postData) =>(dispatch) => {
  
  dispatch({type:GET_HEALTH});

  const URL_HEADER = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type' : HealthCare_ELIGIBILITY_CONTENT_TYPE
    }
  };

  const URL=HealthCare_API_ROOT + HealthCare_ELIGIBILITY_URL;
  // axios.post('http://localhost:5000/api/HealthCare'+HealthCare_ELIGIBILITY_URL,postData,URL_HEADER)
  axios.post('/api/HealthCare'+HealthCare_ELIGIBILITY_URL,postData,URL_HEADER)
  .then( (res) => {
    const { status, data} = res;
    console.log("ELIGIBILITY received  : ", res);
    if(status === 200){
      dispatch({type:GET_HEALTH_ELIGIBILITY_SUCCESS,data:data});
      // console.log("requestTokenAPI TOKEN : ", token);
    }
    else if(status === 401){ // Unauthorized token 
      //dispatch(clearHealthCareStatus());
      dispatch(getHealthCareTokenAPI('GET_ELIGIBILITY'));
    }
    else{
      dispatch({type:GET_HEALTH_FAILED});
    }

  })
  .catch((err)=>{
    console.log("ELIGIBILITY ERROR : ", postData);
    console.log("ELIGIBILITY ERROR : ", err);
    dispatch({type:GET_HEALTH_FAILED});
  })    
}


export const getEligibilityHealthCheck = (token) => async(dispatch) => {

    let axiosConfig = {
      headers: {
          'Authorization':`Bearer ${token}`, 
      }
    };
    const URL=HealthCare_API_ROOT + HealthCare_ELIGIBILITY_HEALTH_CHECK_URL;
    axios.get(URL,axiosConfig)
    .then((res) => {
      dispatch({type:GET_HEALTH_SUCCESS,data:res.data})
      return;
    })
    .catch((err) => {
      console.log("HCP ERROR: ", err);
      dispatch({type:GET_HEALTH_FAILED});
    })    
}


export const clearHealthCareStatus = ()=>dispatch => {
  dispatch({type:STATUS_HEALTH_CLEAR});
}
export const clearHealthCareCommand = ()=>dispatch => {
  dispatch({type:COMMAND_HEALTH_CLEAR});
}
export const setHealthCareCommand = (command) => dispatch => {
  dispatch({type:SET_HEALTH_COMMAND,data:command});
}
// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
export const postHealthCareAuthorizeToken =(dispatch)=>{

      const postData = {
        grant_type:HealthCare_GRANT_TYPE,
        client_id:HealthCare_CLIENT_ID,
        client_secret:HealthCare_CLIENT_SECRET
        }
      const data=qs.stringify(postData);
      
      const axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const URL=HealthCare_API_ROOT + HealthCare_AUTHORIZE_TOKEN_URL;
      
      axios.post(URL, data, axiosConfig)
      // axios.post(URL, form, axiosConfig)
      .then((res) => {
        
        const { status, data } = res; 
        if( status === 200 )
        { 
          const { access_token, expires_in, token_type } = data;  
          dispatch({type:GET_HEALTH_TOKEN_SUCCESS,data:access_token}); 
          return;
        }
        dispatch({type:GET_HEALTH_FAILED});
        return ("Unknown Error");
      })
      .catch((err) => {
        dispatch({type:GET_HEALTH_FAILED});
        return ;
      });  
}
