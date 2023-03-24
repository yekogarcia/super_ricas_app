import { types } from "../types/types";


export const setDataEdit = (data) => ({
    type: types.editItems,
    payload: data,
});