/**
 * Created by Administrator on 2018/2/26.
 */
import { createStore, combineReducers } from 'redux'
import {loggedUserReducer,updateUserAuthReducer} from './reducers/users'
import {UpdateEstateAllocationReducer} from './reducers/estateAllocation'
const reducers = combineReducers({
	loggedUserState:loggedUserReducer,
	updateUserAuthState:updateUserAuthReducer,
	updateEstateAllocationState:UpdateEstateAllocationReducer,
});
const store = createStore(reducers);
export default  store;