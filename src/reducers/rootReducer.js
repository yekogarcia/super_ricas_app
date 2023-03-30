import { combineReducers } from 'redux';
import { editReducer, productsReducer } from './actionReducer';
import { authReducer } from './authReducers';

export const rootReducer = combineReducers({
    auth: authReducer,
    products: productsReducer,
    edit: editReducer
})
