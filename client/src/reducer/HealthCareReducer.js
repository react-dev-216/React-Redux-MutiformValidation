export const GET_HEALTH = 'GET_HEALTH';
export const GET_HEALTH_SUCCESS = 'GET_HEALTH_SUCCESS';
export const GET_HEALTH_TOKEN = 'GET_HEALTH_TOKEN';
export const GET_HEALTH_TOKEN_SUCCESS = 'GET_HEALTH_TOKEN_SUCCESS';
export const GET_HEALTH_FAILED = 'GET_HEALTH_FAILED';
export const GET_HEALTH_STATUS = 'GET_HEALTH_STATUS';
export const GET_HEALTH_ELIGIBILITY_SUCCESS = 'GET_HEALTH_ELIGIBILITY_SUCCESS';
export const STATUS_HEALTH_CLEAR = 'STATUS_HEALTH_CLEAR';
export const COMMAND_HEALTH_CLEAR = 'COMMAND_HEALTH_CLEAR';
export const SET_HEALTH_COMMAND ='SET_HEALTH_COMMAND';

const initialHealthCareData = {
  data:[],
  eligibilityData:{},
  access_token:'',
  status:'',
  command:'',
  isLoading:false,  
  isError:false
}

export default function healthCareReducer(state=initialHealthCareData , action ) {
  // console.log("healthCareReducer : state =>",state);
  // console.log("healthCareReducer : action =>",action);
  switch(action.type) {
    case GET_HEALTH:
      return {...state,
        data:'',
        isLoading: true,
        isError: false,
        status:'GET_HEALTH',
      }
    case GET_HEALTH_TOKEN:
      return {...state,
        access_token:'',
        isLoading: true,
        isError: false,
        status:'GET_HEALTH_TOKEN',
      }
    case GET_HEALTH_TOKEN_SUCCESS:
      return {...state,
        access_token: action.data,
        isLoading: false,
        isError: false,
        status:'GET_TOKEN_SUCCESS',
      }
    case GET_HEALTH_SUCCESS:
      return {...state,
        data: action.data,
        isLoading: false,
        isError: false,
        status:'GET_HEALTH_SUCCESS',
      }
    case GET_HEALTH_ELIGIBILITY_SUCCESS:
      return {...state,
        eligibilityData: action.data,
        isLoading: false,
        isError: false,
        status:'GET_ELIGIBILITY_SUCCESS',
      }
    case GET_HEALTH_FAILED:
      return {...state,
        isLoading: false,
        isError: true,
        status:'GET_HEALTH_FAILED',
      }  
    case GET_HEALTH_STATUS:
      return {...state,
        status: action.data,
      }
    case STATUS_HEALTH_CLEAR:
      return {...state,
        status: '',
      }
    case SET_HEALTH_COMMAND:
      return {...state,
        command: action.data
      }
    case COMMAND_HEALTH_CLEAR:
      return {...state,
        command: ''
      }
    default:
      return state;
  }
}