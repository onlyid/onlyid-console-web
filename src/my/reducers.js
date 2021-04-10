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
    loading: true,
    showEmpty: false,
    realType: "sso",
    realOrderBy: "firstDate"
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

const defaultAuditLog = {
    selectedKey: null
};

const defaultAdmin = {
    tenantExpired: false
};

const defaultMessage = {
    selectedKey: null,
    unreadCount: 0,
    total: 0
};

function user(state = defaultUser, { type, ...rest }) {
    if (type === "user") return { ...state, ...rest };

    return state;
}

function application(state = defaultApplication, { type, ...rest }) {
    if (type === "application") return { ...state, ...rest };

    return state;
}

function role(state = defaultRole, { type, ...rest }) {
    if (type === "role") return { ...state, ...rest };

    return state;
}

function auditLog(state = defaultAuditLog, action) {
    const { type, payload } = action;

    switch (type) {
        case "auditLog/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

function admin(state = defaultAdmin, action) {
    const { type, payload } = action;

    switch (type) {
        case "admin/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

function message(state = defaultMessage, action) {
    const { type, payload } = action;

    switch (type) {
        case "message/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

export default combineReducers({
    user,
    application,
    role,
    auditLog,
    admin,
    message
});
