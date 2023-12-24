import { combineReducers } from "redux";

const defaultUser = {
    currentTab: "basic",
    // home
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    keyword: "",
    clientId: "all",
    orderBy: "firstDate",
    realOrderBy: "firstDate",
    // blacklist
    bl_list: [],
    bl_current: 1,
    bl_pageSize: 10,
    bl_total: 0,
    bl_keyword: ""
};

const defaultApplication = {
    currentTab: "basic"
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
    else return state;
}

function application(state = defaultApplication, { type, ...rest }) {
    if (type === "application") return { ...state, ...rest };
    else return state;
}

function role(state = defaultRole, { type, ...rest }) {
    if (type === "role") return { ...state, ...rest };
    else return state;
}

function myMessage(state = defaultMyMessage, { type, ...rest }) {
    if (type === "myMessage") return { ...state, ...rest };
    else return state;
}

export default combineReducers({
    user,
    application,
    role,
    myMessage
});
