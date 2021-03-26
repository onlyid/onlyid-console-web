import { combineReducers } from "redux";

const defaultUser = {
    currentTab: "basic"
};

const defaultApplication = {
    currentTab: "basic"
};

const defaultResManage = {
    resNodes: [],
    selectedApp: null,
    selectedKey: null,
    showEmpty: false
};

const defaultRoleManage = {
    selectedApp: null,
    selectedKey: null,
    showEmpty: false,
    groupId: null // groupId有值 则当前选中的是role 否则选中的是role group
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

function resManage(state = defaultResManage, action) {
    const { type, payload } = action;

    switch (type) {
        case "resManage/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

function roleManage(state = defaultRoleManage, action) {
    const { type, payload } = action;

    switch (type) {
        case "roleManage/save":
            return { ...state, ...payload };
        default:
            return state;
    }
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
    resManage,
    roleManage,
    auditLog,
    admin,
    message
});
