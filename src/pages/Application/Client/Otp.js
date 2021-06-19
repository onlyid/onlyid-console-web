import React, { PureComponent } from "react";
import http from "my/http";
import { withRouter } from "react-router-dom";
import InputBox from "components/InputBox";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup
} from "@material-ui/core";
import { OTP_EXPIRE_TEXT, OTP_FAIL_TEXT, OTP_LENGTH_TEXT } from "my/constants";
import styles from "./index.module.css";
import { eventEmitter } from "my/utils";
import tipBox from "components/TipBox.module.css";

class Otp extends PureComponent {
    state = {
        values: {}
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;

        const values = await http.get(`clients/${match.params.id}/otp-config`);
        this.setState({ values });
    };

    onChange = ({ target }) => {
        this.setState(({ values }) => ({ values: { ...values, [target.name]: target.value } }));
    };

    onSubmit = async () => {
        const { match } = this.props;
        const { values } = this.state;

        await http.put(`clients/${match.params.id}/otp-config`, values);

        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
    };

    render() {
        const { values } = this.state;

        return (
            <form className={styles.otpForm}>
                <InputBox label="验证码长度" radioGroup>
                    <FormControl variant="outlined">
                        <RadioGroup
                            row
                            id="length"
                            value={values.length ? String(values.length) : ""}
                            onChange={this.onChange}
                        >
                            {Object.keys(OTP_LENGTH_TEXT).map(key => (
                                <FormControlLabel
                                    value={key}
                                    key={key}
                                    control={<Radio name="length" color="primary" />}
                                    label={OTP_LENGTH_TEXT[key]}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </InputBox>
                <InputBox label="验证码有效期" radioGroup>
                    <FormControl variant="outlined">
                        <RadioGroup
                            row
                            id="expireMin"
                            value={values.expireMin ? String(values.expireMin) : ""}
                            onChange={this.onChange}
                        >
                            {Object.keys(OTP_EXPIRE_TEXT).map(key => (
                                <FormControlLabel
                                    value={key}
                                    key={key}
                                    control={<Radio name="expireMin" color="primary" />}
                                    label={OTP_EXPIRE_TEXT[key]}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </InputBox>
                <InputBox label="最多失败次数" radioGroup>
                    <FormControl variant="outlined">
                        <RadioGroup
                            row
                            id="maxFailCount"
                            value={values.maxFailCount ? String(values.maxFailCount) : ""}
                            onChange={this.onChange}
                        >
                            {Object.keys(OTP_FAIL_TEXT).map(key => (
                                <FormControlLabel
                                    value={key}
                                    key={key}
                                    control={<Radio name="maxFailCount" color="primary" />}
                                    label={OTP_FAIL_TEXT[key]}
                                />
                            ))}
                        </RadioGroup>
                        <FormHelperText>
                            当某条验证码校验失败次数达到该值后，标记验证码失效，后续校验都直接返回失败，不再尝试校验。
                        </FormHelperText>
                    </FormControl>
                </InputBox>
                <InputBox label="是否重用" radioGroup>
                    <FormControl variant="outlined">
                        <RadioGroup
                            row
                            id="reuse"
                            value={values.reuse !== undefined ? String(values.reuse) : ""}
                            onChange={this.onChange}
                        >
                            <FormControlLabel
                                value="true"
                                control={<Radio name="reuse" color="primary" />}
                                label="是（推荐）"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio name="reuse" color="primary" />}
                                label="否"
                            />
                        </RadioGroup>
                        <FormHelperText>
                            当发送给某用户的一条验证码未过期时再发送一条，会重用前一条验证码，并更新有效期，可以避免用户在短时间收到多条不一样的验证码。
                        </FormHelperText>
                    </FormControl>
                </InputBox>
                <InputBox>
                    <div style={{ marginTop: 5 }}>
                        <Button variant="contained" color="primary" onClick={this.onSubmit}>
                            保 存
                        </Button>
                    </div>
                </InputBox>
                <div className={tipBox.root}>
                    <p>提示：</p>
                    <ol>
                        <li>
                            在发送单条验证码时，也可以直接通过API传参的方式自定义，且优先级更高，请参阅使用OTP的相关文档。
                        </li>
                    </ol>
                </div>
            </form>
        );
    }
}

export default withRouter(Otp);
