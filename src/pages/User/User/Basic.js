import React, { PureComponent } from "react";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    OutlinedInput,
    Radio,
    RadioGroup
} from "@material-ui/core";
import { DATE_FORMAT, GENDER_TEXT, REG_EXP } from "my/constants";
import Validator from "async-validator";
import http from "my/http";
import InputBox from "components/InputBox";
import { eventEmitter } from "my/utils";
import Info from "./Info";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import RegionInput from "components/RegionInput";
import moment from "moment";

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

class Basic extends PureComponent {
    state = {
        validation: { nickname: {}, mobile: {}, email: {}, bio: {} },
        values: {},
        region: null,
        birthDate: null
    };

    componentDidMount() {
        const { user } = this.props;
        if (user.id) this.initData(user);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { user } = this.props;
        if (user !== prevProps.user) this.initData(user);
    }

    initData = ({ nickname, mobile, email, gender, bio, province, city, birthDate }) => {
        this.setState({ values: { nickname, mobile, email, gender, bio } });

        if (province) this.setState({ region: [province, city] });

        if (birthDate) this.setState({ birthDate: moment(birthDate) });
    };

    onSubmit = async () => {
        const { values, region, birthDate, validation } = this.state;
        const { onChange, user } = this.props;

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

        values.gender = values.gender || null;

        if (region) {
            values.province = region[0];
            values.city = region[1];
        } else {
            values.province = null;
            values.city = null;
        }

        if (birthDate) {
            values.birthDate = birthDate.format(DATE_FORMAT);
        } else {
            values.birthDate = null;
        }

        await http.put("users/" + user.id, values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onChange(values);
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

    render() {
        const { values, validation, region, birthDate } = this.state;
        const { user } = this.props;

        if (user.activated) return <Info user={user} />;

        return (
            <form>
                <InputBox label="用户昵称" required>
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
                <InputBox label="用户手机号">
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
                <InputBox label="用户邮箱">
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
                <InputBox label="用户性别">
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
                <InputBox label="用户生日">
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
                <InputBox label="用户地区">
                    <RegionInput
                        value={region}
                        onChange={value => this.setState({ region: value })}
                    />
                </InputBox>
                <InputBox label="用户简介">
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
                <InputBox>
                    <div style={{ marginTop: 5 }}>
                        <Button variant="contained" color="primary" onClick={this.onSubmit}>
                            保 存
                        </Button>
                    </div>
                </InputBox>
            </form>
        );
    }
}

export default Basic;
