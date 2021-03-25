import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    OutlinedInput,
    Radio,
    RadioGroup,
    Tooltip
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import InputBox from "components/InputBox";
import { DATE_FORMAT, GENDER_TEXT, IMG_UPLOAD_TIP, REG_EXP } from "my/constants";
import styles from "./index.module.css";
import Avatar from "components/Avatar";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import RegionInput from "components/RegionInput";
import { eventEmitter, transformImage } from "my/utils";
import http from "my/http";
import Validator from "async-validator";

const RULES = {
    nickname: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    mobile: { pattern: REG_EXP.mobile, message: "手机号格式不正确" },
    email: [
        { max: 50, message: "最多输入50字" },
        { type: "email", message: "邮箱格式不正确" }
    ],
    bio: { max: 200, message: "最多输入200字" }
};

export default class extends PureComponent {
    state = {
        validation: { nickname: {}, mobile: {}, email: {}, bio: {} },
        values: {},
        avatarUrl: null,
        filename: null,
        region: null,
        birthDate: null,
        step: 1
    };

    next = () => {
        this.setState({ step: 2 });
    };

    onUploadChange = async ({ target }) => {
        const { files } = target;

        if (!files.length) return;

        const file = files[0];
        target.value = null;
        const { blob, dataURL } = await transformImage(file);

        const formData = new FormData();
        formData.append("file", blob);
        const { filename } = await http.post("img", formData);

        this.setState({ filename, avatarUrl: dataURL });
    };

    onChange = ({ target }) => {
        this.setState(({ values }) => ({ values: { ...values, [target.id]: target.value } }));
    };

    onGenderChange = ({ target: { value } }) => {
        this.setState(({ values }) => ({ values: { ...values, gender: value } }));
    };

    validateField = async ({ target: { id: key, value } }) => {
        const { validation } = this.state;
        try {
            await new Validator({ [key]: RULES[key] }).validate({ [key]: value }, { first: true });
            validation[key] = {};
        } catch ({ errors }) {
            validation[key] = { text: errors[0].message, error: true };
        }
        this.setState({ validation: { ...validation } });
    };

    submit = async () => {
        const { values, filename, region, birthDate, validation } = this.state;
        const { onSave } = this.props;

        try {
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        if (!values.mobile && !values.email)
            return eventEmitter.emit("app/openToast", {
                text: "手机号和邮箱至少要填一项",
                severity: "warning"
            });

        values.filename = filename;
        values.gender = values.gender || null;
        if (region) {
            values.province = region[0];
            values.city = region[1];
        }
        if (birthDate) {
            values.birthDate = birthDate.format(DATE_FORMAT);
        }

        await http.post("users", values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onSave();
    };

    render() {
        const { open, onCancel } = this.props;
        const { validation, values, avatarUrl, step, region, birthDate } = this.state;

        if (step === 1)
            return (
                <Dialog open={open} onClose={onCancel}>
                    <DialogTitle>
                        请注意
                        <DialogClose onClose={onCancel} />
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <p style={{ marginTop: 0 }}>
                            当你的应用接入唯ID SSO后，登录的用户会自动出现在用户管理页。因此，
                            <span style={{ color: "#f50057" }}>你通常不需要手工新建用户账号。</span>
                        </p>
                        <p>新建用户主要用于：</p>
                        <ol className={styles.ol1}>
                            <li>
                                应用迁移到唯ID，使用批量导入功能迁移大部分用户后，有少量用户因各种原因无法自动导入，需手工新建处理。
                            </li>
                            <li>
                                应用已接入SSO，偶尔有新用户因各种原因（如老年人不会打字）无法在认证中心完成注册，可协助用户新建账号。
                            </li>
                        </ol>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onCancel}>取 消</Button>
                        <Button onClick={this.next} color="primary">
                            继续新建
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        else
            return (
                <Dialog open={open}>
                    <DialogTitle>
                        新建用户（账号）
                        <DialogClose onClose={onCancel} />
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <InputBox label="用户头像" vertical>
                            <div>
                                <input
                                    accept="image/jpeg,image/png"
                                    id="upload"
                                    type="file"
                                    onChange={this.onUploadChange}
                                    style={{ display: "none" }}
                                />
                                <Tooltip title={IMG_UPLOAD_TIP} placement="right">
                                    <label htmlFor="upload">
                                        <Avatar url={avatarUrl} style={{ cursor: "pointer" }} />
                                        <span className={styles.uploadTip}>点击上传</span>
                                    </label>
                                </Tooltip>
                            </div>
                        </InputBox>
                        <InputBox label="用户昵称" required vertical>
                            <FormControl error={validation.nickname.error} variant="outlined">
                                <OutlinedInput
                                    id="nickname"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={values.nickname || ""}
                                />
                                <FormHelperText>{validation.nickname.text}</FormHelperText>
                            </FormControl>
                        </InputBox>
                        <InputBox label="用户手机号" vertical>
                            <FormControl error={validation.mobile.error} variant="outlined">
                                <OutlinedInput
                                    id="mobile"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={values.mobile || ""}
                                />
                                <FormHelperText>{validation.mobile.text}</FormHelperText>
                                <FormHelperText error={false}>
                                    手机号或邮箱至少填一项，作为登录账号。
                                </FormHelperText>
                            </FormControl>
                        </InputBox>
                        <InputBox label="用户邮箱" vertical>
                            <FormControl error={validation.email.error} variant="outlined">
                                <OutlinedInput
                                    id="email"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={values.email || ""}
                                />
                                <FormHelperText>{validation.email.text}</FormHelperText>
                            </FormControl>
                        </InputBox>
                        <InputBox label="用户性别" vertical>
                            <FormControl variant="outlined">
                                <RadioGroup
                                    row
                                    id="gender"
                                    value={values.gender || ""}
                                    onChange={this.onGenderChange}
                                >
                                    {Object.keys(GENDER_TEXT).map(key => (
                                        <FormControlLabel
                                            value={key}
                                            key={key}
                                            control={<Radio color="primary" />}
                                            label={GENDER_TEXT[key]}
                                        />
                                    ))}
                                    <FormControlLabel
                                        value=""
                                        key="empty"
                                        control={<Radio color="primary" />}
                                        label="暂不设置"
                                    />
                                </RadioGroup>
                                <FormHelperText />
                            </FormControl>
                        </InputBox>
                        <InputBox label="用户生日" vertical>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DatePicker
                                    clearLabel="暂不设置"
                                    cancelLabel="取 消"
                                    okLabel={null}
                                    fullWidth
                                    id="date-picker"
                                    format="YYYY-MM-DD"
                                    value={birthDate}
                                    onChange={value => this.setState({ birthDate: value })}
                                    disableFuture
                                    disableToolbar
                                    openTo="year"
                                    clearable
                                    autoOk
                                    inputVariant="outlined"
                                />
                            </MuiPickersUtilsProvider>
                        </InputBox>
                        <InputBox label="用户地区" vertical>
                            <RegionInput
                                value={region}
                                onChange={value => this.setState({ region: value })}
                            />
                        </InputBox>
                        <InputBox label="用户简介" vertical>
                            <FormControl error={validation.bio.error}>
                                <OutlinedInput
                                    id="bio"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={values.bio || ""}
                                    multiline
                                    rows={3}
                                />
                                <FormHelperText>{validation.bio.text}</FormHelperText>
                            </FormControl>
                        </InputBox>
                        <div className="tipBox">
                            <p>提示：</p>
                            <ol>
                                <li>
                                    通过控制台新建用户账号不设置密码，用户首次使用该账号时，唯ID会引导用户验证手机号/邮箱并设置登录密码（称为激活账号）。
                                </li>
                            </ol>
                        </div>
                    </DialogContent>
                    <DialogActions key="0">
                        <Button onClick={onCancel}>取 消</Button>
                        <Button onClick={this.submit} color="primary">
                            保 存
                        </Button>
                    </DialogActions>
                </Dialog>
            );
    }
}
