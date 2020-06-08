var express = require('express');
var router = express.Router();
const axios = require('axios');
const qs = require('querystring');

const API_ROOT = 'https://apistage.medproid.com';
const CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  
const CLIENT_SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const USER_NAME = 'user_name';
const AUTHORIZE_TOKEN_URL = '/v1/authorize/token';
const GET_ONE_HCP_URL = '/v1/hcps/'
const CONTENT_TYPE = 'application/x-www-form-urlencoded';
const GRANT_TYPE = 'client_credentials';


function getAuthorizeToken(callback){

      const postData = {
        grant_type:GRANT_TYPE,
        client_id:CLIENT_ID,
        client_secret:CLIENT_SECRET
        }

      const axiosConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const URL=API_ROOT + AUTHORIZE_TOKEN_URL;
      axios.post(URL, qs.stringify(postData), axiosConfig)
      .then((res) => {
        console.log("TOKEN RECEIVED: ", res);
        const { status, data } = res; 
        if( status === 200 )
        { 
          const { access_token, expires_in, token_type } = data;  
    //      console.log("Access Token: ", access_token);
          callback(access_token); 
          return;
        }
        callback('error');
        return ("Unknown Error");
      })
      .catch((err) => {
        console.log("TOKEN ERROR: ", err);
        callback('error');
        return ;
      });  
}

router.get('/api/token', function(req, res, next) {
  
  getAuthorizeToken((access_token)=>{
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
//    res.status(400).send("get TOKEN: passed");  
});


module.exports = router;
