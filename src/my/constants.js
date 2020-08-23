export const TYPE_LABEL = {
    TOP_ORG: "组织机构",
    ORG: "组织机构",
    POSITION: "岗位",
    USER_GROUP: "用户组"
};

export const AUDIT_TYPE_LABEL = {
    ALL: "所有",
    ORG: "组织机构",
    POSITION: "岗位",
    USER_GROUP: "用户组",
    USER: "用户",
    CLIENT: "应用",
    RES: "权限资源",
    ROLE_GROUP: "角色组",
    ROLE: "角色"
};

export const OPERATION_TYPE_TEXT = {
    CREATE: "新增",
    DELETE: "删除",
    UPDATE: "修改",
    READ: "查询"
};

export const GENDER_TEXT = {
    MALE: "男",
    FEMALE: "女",
    OTHER: "其他"
};

export const IMG_UPLOAD_TIP = "JPG/PNG格式、不小于256像素";

export const REG_EXP = {
    mobile: /^1\d{10}$/
};

export const CLIENT_TYPE_TEXT = {
    WEB: "网站",
    APP: "APP",
    OTHER: "其他"
};

export const OTP_TYPE_TEXT = {
    NUMBER: "随机 数字（推荐）",
    NUMBER_LETTER_LOWERCASE: "随机 数字 + 小写字母",
    NUMBER_LETTER: "随机 数字 + 大小写字母"
};

export const OTP_LENGTH_TEXT = {
    4: "4位",
    6: "6位（推荐）",
    8: "8位（安全）"
};

export const OTP_EXPIRE_TEXT = {
    5: "5分钟（安全）",
    10: "10分钟（推荐）",
    20: "20分钟"
};

export const OTP_FAIL_TEXT = {
    5: "5次（安全）",
    10: "10次（推荐）",
    20: "20次"
};

export const OTP_TEMPLATE_TEXT = {
    383959: "APP的验证码为：Y，该验证码X分钟内有效，请勿泄露于他人",
    383106: "(Y)APP验证码。工作人员不会向您索要，请勿向任何人泄露，以免造成账户或资金损失",
    383105: "您的验证码是：Y。此验证码用于[APP]，有效期X分钟",
    383087: "(Y)APP验证码，X分钟内有效"
};

export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DATE_TIME_FORMAT_SHORT = "MM-DD HH:mm:ss";

export const ACTIVE_TYPE_TEXT = {
    SIGN_IN: "登录",
    SIGN_UP: "注册",
    RESET_PASSWORD: "重置密码"
};

export const AUTH_TYPE_TEXT = {
    PASSWORD: "密码",
    OTP: "验证码",
    SCAN: "扫二维码"
};

export const SENT_BY_TEXT = {
    OAUTH: "唯ID SSO",
    DEVELOPER: "开发者"
};
