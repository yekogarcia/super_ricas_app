import { types } from "../types/types";


export const setDataEdit = (data) => ({
    type: types.editItems,
    payload: data,
});

export const setProductAll = (data) => ({
    type: types.productAll,
    payload: data,
});

export const setEmptyDetails = (data) => ({
    type: types.emptyDetails,
    payload: data,
});