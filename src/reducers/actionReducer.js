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
