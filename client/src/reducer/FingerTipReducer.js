const initialHealthCareData = {
  providers:[],
  copays:[],
  statusFingerTip:'',
  commandFingerTip:'',
  isLoadingFingerTip:false,  
  isErrorFingerTip:false
}

export default function fingerTipReducer(state=initialHealthCareData , action ) {
//   console.log("fingerTipReducer : state =>",state);
//   console.log("fingerTipReducer : action =>",action);
  switch(action.type) {
    case 'GET_PENDING':
      return {...state,
        isLoadingFingerTip: true,
        isErrorFingerTip: false,
        statusFingerTip:'GET_PENDING',
      }
    case 'GET_FINGERTIP_FAILED':
      return {...state,
        isLoadingFingerTip: false,
        isErrorFingerTip: true,
        statusFingerTip:'GET_FINGERTIP_FAILED',
      }  
    case 'SET_FINGERTIP_STATUS':
      return {...state,
        statusFingerTip: action.data,
      }
    case 'STATUS_FINGER_CLEAR':
      return {...state,
        statusFingerTip: '',
      }
    case 'SET_FINGERTIP_COMMAND':
      return {...state,
        commandFingerTip: action.data
      }
    case 'COMMAND_FINGERTIP_CLEAR':
      return {...state,
        commandFingerTip: ''
      }
    case 'GET_PROVIDERS_SUCCESS':
        return { ...state,
                ['providers']:action.data,
                statusFingerTip:'GET_PROVIDERS_SUCCESS'};
    case 'GET_COPAY_SUCCESS':
        const res_copays=action.data;
        let copays = state.copays;
        for(let item in res_copays){
            const copay = res_copays[item].copay
            if(copay.min_percentage !==null || copay.min_value !==null ||
               copay.max_percentage !==null || copay.max_value !==null )
                copays.push(copay);
        }
        return { ...state,
                ['copays']:copays,
                statusFingerTip:'GET_COPAY_SUCCESS'};
    case 'COPAY_CLEAR':
         return { ...state,
                copays:[] };
    default:
      return state;
  }
}