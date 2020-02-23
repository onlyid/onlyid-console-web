import { combineReducers } from "redux";

const defaultUserPool = {
    selectedKey: null
};

const defaultOrgManage = {
    orgNodes: [],
    showEmpty: false,
    selectedKey: null,
    selectedType: null,
    showUser: false
};

function userPool(state = defaultUserPool, action) {
    const { type, payload } = action;

    switch (type) {
        case "userPool/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

function orgManage(state = defaultOrgManage, action) {
    const { type, payload } = action;

    switch (type) {
        case "orgManage/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

export default combineReducers({ userPool, orgManage });
