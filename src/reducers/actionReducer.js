import { types } from "../types/types";

const initialState = {
    editable: false
}

export const editReducer = (state = false, action) => {
    switch (action.type) {
        case types.editItems:
            return {
                ...state,
                eventEdit: action.payload,
                editable: true
            }
        case types.editNotItems:
            return {
                ...state,
                eventEdit: false,
                editable: false
            }
        default:
            return state;
    }
}

export const productsReducer = (state = false, action) => {
    switch (action.type) {
        case types.productAll:
            return {
                ...state,
                products: action.payload,
            }
        case types.notProductAll:
            return {
                ...state,
                products: [],
            }
        default:
            return state;
    }
}

export const emptyReducer = (state = false, action) => {
    switch (action.type) {
        case types.emptyDetails:
            return {
                ...state,
                details: action.payload,
            }
        case types.notEmptyDetails:
            return {
                ...state,
                details: {
                    products: false,
                    incomes: false,
                    devolutions: false,
                    balances: false,
                },
            }
        default:
            return {
                ...state,
                details: {
                    products: false,
                    incomes: false,
                    devolutions: false,
                    balances: false,
                },
            };
    }
}
