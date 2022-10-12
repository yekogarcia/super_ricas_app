import { combineReducers } from 'redux';
import { editReducer } from './actionReducer';
import { authReducer } from './authReducers';

export const rootReducer = combineReducers({
    auth: authReducer,
    edit: editReducer
})
