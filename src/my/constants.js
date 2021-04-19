export const GENDER_TEXT = {
    MALE: "男",
    FEMALE: "女",
    OTHER: "其他"
};

export const IMG_UPLOAD_TIP = "JPG/PNG格式，长宽 >= 256像素";

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
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT_SHORT = "MM-DD HH:mm:ss";

export const AUTH_METHOD = {
    PASSWORD: "密码",
    OTP: "验证码",
    QR_CODE: "二维码",
    SSO: "保持登录"
};
