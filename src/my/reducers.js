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

const defaultAppManage = {
    selectedKey: null
};

const defaultResManage = {
    resNodes: [],
    selectedApp: null,
    selectedKey: null,
    showEmpty: false
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

function appManage(state = defaultAppManage, action) {
    const { type, payload } = action;

    switch (type) {
        case "appManage/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

function resManage(state = defaultResManage, action) {
    const { type, payload } = action;

    switch (type) {
        case "resManage/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

export default combineReducers({ userPool, orgManage, appManage, resManage });
