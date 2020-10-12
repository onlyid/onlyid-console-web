import { combineReducers } from "redux";

const defaultUserPool = {
    selectedKey: null,
    isCreator: true
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

const defaultRoleManage = {
    selectedApp: null,
    selectedKey: null,
    showEmpty: false,
    groupId: null // groupId有值 则当前选中的是role 否则选中的是role group
};

const defaultStatistics = {
    selectedKey: null
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

function roleManage(state = defaultRoleManage, action) {
    const { type, payload } = action;

    switch (type) {
        case "roleManage/save":
            return { ...state, ...payload };
        default:
            return state;
    }
}

function statistics(state = defaultStatistics, action) {
    const { type, payload } = action;

    switch (type) {
        case "statistics/save":
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
    userPool,
    orgManage,
    appManage,
    resManage,
    roleManage,
    statistics,
    auditLog,
    admin,
    message
});
