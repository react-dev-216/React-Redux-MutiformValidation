

const initialPatientInfo={
    type:'',
    gender:'',
    firstName:'',
    lastName:'',
    phone:'',
    email:'',
    street:'',
    apt:'',
    zip:'',
    country:'',
    birthday:'1989-02-16',
    password:'',
    language:'',
    contact:''    
}
const initialDoctorInfo = {
        firstName:'',
        lastName:'',
        NPI:'',
        addr:'',
        city:'',
        zip:'',
        state:'',
        radius:'', 
}
const initialInsuranceInfo = {
    cardFirstName:'',
    cardLastName:'',
    RxBIN:'',
    RxPCN:'',
    RxGroup:'',
    cardId:'',
    insuranceType:'',
    haveCard:false,
    }
const initialPatientNote = {
    allergy:'',
    other:'',
    note:''
}
export const initialUserInfo = {
    patientInfo : initialPatientInfo,
    doctorInfo : initialDoctorInfo,
    insuranceInfo : initialInsuranceInfo,
    patientNote :initialPatientNote,
    contactTime :'',
    currentStep : 1
}

export function userInfoReducer(state=initialUserInfo, action) {
//  console.log("userInfoReducer : state => ",state);
//  console.log("userInfoReducer : action =>",action);
    switch (action.type) {
      case 'UPDATE_PATIENT_INFO':
        return { ...state,['patientInfo']:action.data };
      case 'UPDATE_DOCTOR_INFO':
        return { ...state,['doctorInfo']:action.data };
      case 'UPDATE_INSURANCE_INFO':
        return { ...state,['insuranceInfo']:action.data };
      case 'UPDATE_PATIENT_NOTE':
        return { ...state,['patientNote']:action.data };
      case 'UPDATE_CONTACT_TIME':
        return { ...state,['contactTime']:action.data};
      case 'UPDATE_STEP':
        return { ...state,['currentStep']:action.step};
      case 'UPDATE_PATIENT_ITEM':
        let patientInfo= state.patientInfo;
        patientInfo = {...patientInfo,[action.item]:action.value};
        return {...state,['patientInfo']:patientInfo};
      default:
        return state;
    }
}