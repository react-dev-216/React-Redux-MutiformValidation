import axios from 'axios';
import qs from 'querystring'
import { MedPro_API_ROOT, MedPro_CLIENT_ID, MedPro_CLIENT_SECRET, MedPro_USER_NAME,MedPro_GET_SEARCH_HCP_URL, 
        MedPro_AUTHORIZE_TOKEN_URL, MedPro_CONTENT_TYPE, MedPro_GRANT_TYPE,MedPro_GET_ONE_HCP_URL } from '../constants/service-info';


export const requestMedProTokenAPI = (callback) => {

    const URL="/api/token";

    axios.get(URL)
    .then((res) => {
    //  console.log(res);
      const { status, data} = res;
      if(status === 200){
         const token = data.access_token;
    //     console.log("requestTokenAPI TOKEN : ", token);
         callback(token);
         return;
      }
      else{
        // console.log("TOKEN ERROR: ", res);
        callback('error');
        return;
      }
    })
    .catch((err) => {
      // console.log("TOKEN ERROR: ", err);
      callback('error');
    })

}

export const searchOneHCPById = (token,id,callback) => {
  // const dispatch = useDispatch();
    let axiosConfig = {
      headers: {
          'Authorization':`Bearer ${token}`, 
      }
    };
    const URL=MedPro_API_ROOT + MedPro_GET_ONE_HCP_URL + `${id}`;
    axios.get(URL,axiosConfig)
    .then((res) => {
      
      callback(res);
      return;
    })
    .catch((err) => {
      console.log("HCP ERROR: ", err);
      callback('error');
    })    
}
export const searchOneHCPByKey = (token,key,callback) => {
//    console.log(" searchOneHCPByKey => access token,key : ", token + key);
    const getData = {
      query : key,
    };  
    let axiosConfig = {
      headers: {
          'Authorization':`Bearer ${token}`, 
      }
    };
    const URL=MedPro_API_ROOT + MedPro_GET_SEARCH_HCP_URL+ '?query="'+key+'"';
    axios.get(URL,axiosConfig)
    .then((res) => {
    //  console.log("HCP DATA: ", res);
      callback(res);
      return;
    })
    .catch((err) => {
      console.log("HCP ERROR: ", err);
      callback({status:'error'});
    })    
}

const searchHCPs = (token) => {

    const postData = {
      grant_type : MedPro_GRANT_TYPE,
      client_secret : MedPro_CLIENT_SECRET,
      client_id : MedPro_CLIENT_ID
    };    

    let axiosConfig = {
      headers: {
          'Authorization': `Bearer ${token}`, 
      }
    };
    const URL=MedPro_API_ROOT + MedPro_AUTHORIZE_TOKEN_URL;
    axios.post(URL, postData, axiosConfig)
    .then((res) => {
      console.log("RESPONSE RECEIVED: ", res);
      const { access_token, expires_in, token_type } = res;      
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    })  

}

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });


