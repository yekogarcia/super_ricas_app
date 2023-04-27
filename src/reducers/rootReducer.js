import { combineReducers } from 'redux';
import { editReducer, emptyReducer, productsReducer } from './actionReducer';
import { authReducer } from './authReducers';

export const rootReducer = combineReducers({
    auth: authReducer,
    products: productsReducer,
    edit: editReducer,
    empty: emptyReducer
})
