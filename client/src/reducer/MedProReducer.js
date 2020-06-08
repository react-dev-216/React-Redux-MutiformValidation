
const GET_HCP_SUCCESS = 'GET_HCP_SUCCESS';
const GET_HCP_ASKED = 'GET_HCP_ASKED';
const GET_HCP_UNAUTHORIZED = 'GET_HCP_UNAUTHORIZED';
const GET_HCP_FAILED = 'GET_HCP_FAILED';

const initialResult = {
  HCPs: [],
  access_token:'',
  status:'',
  isLoading:false,
  isError:false
}

export default function searchHCPReducer(state=initialResult , action ) {
  //  console.log("searchHCPReducer : state =>",state);
  //  console.log("searchHCPReducer : action =>",action);
  switch(action.type) {
    case 'GET_HCP':
      return {...state,
        isLoading: true,
        isError: false
      }
    case 'GET_HCP_SUCCESS':
      return {...state,
        HCPs: action.data,
        isLoading: false,
        isError: false,
      }
    case 'GET_ACCESS_TOKEN':
      return {...state,
        access_token: action.data,
        isLoading: true,
        isError: false,
      }
    case 'TOKEN_FAILED':
      return {...state,
        isLoading: false,
        isError: true,
      }  
    case 'GET_HCP_STATUS':
      return {...state,
        status: action.data,
      }

    default:
      return state;
  }
}