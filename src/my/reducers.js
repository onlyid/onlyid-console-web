import { combineReducers } from "redux";

const defaultUser = {
    currentTab: "basic",
    // home
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    keyword: "",
    type1: "sso",
    clientId: "all",
    orderBy: "firstDate",
    activated: "all",
    realType: "sso",
    realOrderBy: "firstDate"
};

const defaultApplication = {
    currentTab: "basic"
};

const defaultPermission = {
    clientId: null
};

const defaultRole = {
    currentTab: "basic",
    // home
    current: 1,
    pageSize: 10,
    total: 0,
    clientId: "all",
    list: []
};

const defaultMyMessage = {
    unreadCount: 0,
    totalCount: 0,
    // home
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    keyword: ""
};

function user(state = defaultUser, { type, ...rest }) {
    if (type === "user") return { ...state, ...rest };

    return state;
}

function application(state = defaultApplication, { type, ...rest }) {
    if (type === "application") return { ...state, ...rest };

    return state;
}

function permission(state = defaultPermission, { type, ...rest }) {
    if (type === "permission") return { ...state, ...rest };

    return state;
}

function role(state = defaultRole, { type, ...rest }) {
    if (type === "role") return { ...state, ...rest };

    return state;
}

function myMessage(state = defaultMyMessage, { type, ...rest }) {
    if (type === "myMessage") return { ...state, ...rest };

    return state;
}

export default combineReducers({
    user,
    application,
    permission,
    role,
    myMessage
});
