import { combineReducers } from 'redux'
import { userInfoReducer } from './UserInfoReducer'
import searchHCPReducer from './MedProReducer'
import healthCareReducer from './HealthCareReducer'
import fingerTipReducer from './FingerTipReducer'

export default combineReducers({
  userInfoReducer,
  searchHCPReducer,
  healthCareReducer,
  fingerTipReducer
})