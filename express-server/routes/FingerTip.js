var express = require('express');
var router = express.Router();
const axios = require('axios');
const qs = require('querystring');

const FingerTip_API_KEY = '112865acf213c337646a3b9ac540d9e99a25c637';
const FingerTip_API_ROOT = 'http://api.fingertipformulary.com';
const FingerTip_API_PROVIDER = '/providers.json';
const FingerTip_API_HEALTH_PLANS = '/health_plans.json';
const FingerTip_API_NDCS = '/ndcs/display_data.json';
const FingerTip_API_DRUGS = '/drugs.json';
const FingerTip_API_COPAY = '/copays.json';



function getProviderInfoAPI (callback) {

    const URL = FingerTip_API_ROOT+FingerTip_API_PROVIDER + "?api_key="+FingerTip_API_KEY;
    axios.get(URL)
    .then((res) => {
    //  console.log(res);
      const { status, data} = res;
      if(status === 200){
         
         console.log("provider informations => ", data);
         callback(res);
         return;
      }
      else{
        console.log("Status ERROR: ", status);
        callback(res);
        return;
      }
    })
    .catch((err) => {
      console.log("Request ERROR: ", err);
      callback('error');
    })

}
function getHealthPlansAPI  (providerID,callback){
    const URL = FingerTip_API_ROOT+FingerTip_API_HEALTH_PLANS + "?api_key="+FingerTip_API_KEY+"&provider_id="+providerID;

    axios.get(URL)
    .then((res) => {
      //  console.log(res);
        callback(res);
         // console.log("provider list => ", data);
         return;
    })
    .catch((err) => {
        callback('error');
     // console.log("Request ERROR: ", err);
    })
}
function getCalculateAPI(drug_id,healthPlan_id,callback) {
    const URL = FingerTip_API_ROOT+FingerTip_API_COPAY + "?api_key="+FingerTip_API_KEY+"&drug_id="+drug_id+"&health_plan_id="+healthPlan_id;
    axios.get(URL)
    .then((res) => {
      //  console.log(res);
        callback(res);
        return;
    })
    .catch((err) => {
        callback('error');
     // console.log("Request ERROR: ", err);
    })

}
router.get('/api/FingerTip/providers.json', function(req, res, next) {
    // console.log("Request Provider ++++++++++++++++++++++++++++++++++++++++=> ", req);
    getProviderInfoAPI((resp)=>{
        if(res !== 'error'){
            const {status,data} = resp;
            res.status(status).send(data);
        }
        else{
            res.status(404).send('Not Found');
        }

    });
    //res.status(400).send("get TOKEN: passed");  
});
router.get('/api/FingerTip/health_plans.json', function(req, res, next) {
    const provider_id = req.query.provider_id;
    console.log("Request health_plans ++++++++++++++  provider_id ++++++++++++++++++++++++++=> ", provider_id);
    getHealthPlansAPI(provider_id,(resp)=>{
        if(res !== 'error'){
            const {status,data} = resp;
            res.status(status).send(data);
        }
        else{
            res.status(404).send('Not Found');
        }

    });
    //res.status(400).send("get TOKEN: passed");  
});
router.get('/api/FingerTip/copays.json', function(req, res, next) {
    const drug_id = req.query.drug_id;
    const health_plan_id = req.query.health_plan_id;
    console.log("Request copays +++++++  drug_id  +++++++++++++++++++++++++++++++++=> ", drug_id);
    console.log("Request copays +++++++  health_plan_id  +++++++++++++++++++++++++++++++++=> ", health_plan_id);
    getCalculateAPI(drug_id,health_plan_id,(resp)=>{
        if(res !== 'error'){
            const {status,data} = resp;
            res.status(status).send(data);
        }
        else{
            res.status(404).send('Not Found');
        }

    });
    //res.status(400).send("get TOKEN: passed");  
});

module.exports = router;