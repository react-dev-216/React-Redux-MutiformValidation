var express = require('express');
var router = express.Router();
const axios = require('axios');
const qs = require('querystring');

const HealthCare_API_ROOT = 'https://sandbox.apis.changehealthcare.com';
const HealthCare_CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx';
const HealthCare_CLIENT_SECRET = 'xxxxxxxxxxxxxxx';
const HealthCare_AUTHORIZE_TOKEN_URL = '/apip/auth/v2/token';
const HealthCare_GRANT_TYPE = 'client_credentials';
const HealthCare_ELIGIBILITY_CONTENT_TYPE = 'application/json';
const HealthCare_ELIGIBILITY_URL = '/medicalnetwork/eligibility/v3';
const HealthCare_ELIGIBILITY_HEALTH_CHECK_URL = '/medicalnetwork/eligibility/v3/healthcheck';

function getHealthCareAuthorizeToken(callback){

      const postData = {
        grant_type:HealthCare_GRANT_TYPE,
        client_id:HealthCare_CLIENT_ID,
        client_secret:HealthCare_CLIENT_SECRET
        }
      const data=qs.stringify(postData);
      // console.log("  data         +++++++++++++++++++++++++++++++++++++++++", data);
      const axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const URL=HealthCare_API_ROOT + HealthCare_AUTHORIZE_TOKEN_URL;
      // console.log("URL+++++++++++++++++++++++++++++++++++++++++", URL);
      axios.post(URL, data, axiosConfig)
      // axios.post(URL, form, axiosConfig)
      .then((res) => {
        // console.log("TOKEN RECEIVED+++++++++++++++++++++++++++++++++++++++++++++: ", res);
        const { status, data } = res; 
        if( status === 200 )
        { 
          const { access_token, expires_in, token_type } = data;  
          // console.log("Access Token: ++++++++++++++++++++++++++++++++++++++++", access_token);
          callback(access_token); 
          return;
        }
        callback('error');
        return ("Unknown Error");
      })
      .catch((err) => {
        // console.log("TOKEN ERROR  +++++++++++++++++++++++++++++++++++++++++++++++ : ", err);
        callback('error');
        return ;
      });  
}

function postHealthCareEligibility ( token, postData, callback) {
  
  const URL_HEADER = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type' : HealthCare_ELIGIBILITY_CONTENT_TYPE
    }
  };

  const URL=HealthCare_API_ROOT + HealthCare_ELIGIBILITY_URL;
  axios.post(URL,postData,URL_HEADER)
  .then( (res) => {
    console.log(res);
    const { status, data} = res;
    callback(res);
  })
  .catch((err)=>{
    callback('error');
  })    
}

router.post('/api/healthCare/medicalnetwork/eligibility/v3', function(req, res, next) {
    let token = req.headers.authorization;
    token = token.slice(token.search("Bearer ")+7);
    const postData = req.body;
    //  console.log("++++++++++ token ++++++++++++++++  post eligibility => ", token);
    // console.log("++++++++++  postData  ++++++++++++++++  post eligibility => ", JSON.stringify(postData));
    postHealthCareEligibility(token,postData,(resp)=>{
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        if( resp !== 'error')
        {
            res.status(resp.status).send(resp.data);
        }
        else
          res.status(404).send('Not found');
    });

});

router.get('/api/healthCare/apip/auth/v2/token', function(req, res, next) {
    console.log("Request Access Token => ", req);
    getHealthCareAuthorizeToken((access_token)=>{
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        access_token = JSON.stringify({access_token:access_token});
        if(access_token === 'error'){
            res.status(400).send(access_token);
        }
        else {
            // console.log("Access Token => ", access_token);
            res.status(200).send(access_token);
            return;
        }
    });
    
});

module.exports = router;
