import React, { PureComponent } from "react";
import http from "my/http";
import { withRouter } from "react-router-dom";
import { Button, FormControl, FormHelperText, OutlinedInput } from "@material-ui/core";
import InputBox from "components/InputBox";
import Validator from "async-validator";
import { eventEmitter } from "my/utils";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";

const RULE = [
    {
        max: 1000,
        message: "最多输入1000字"
    },
    {
        validator: (rule, value, callback) => {
            // 为空认为是合法值
            if (!value) return callback();

            try {
                const obj = JSON.parse(value);
                if (Array.isArray(obj)) throw new Error();

                callback();
            } catch (err) {
                callback("必须是JSON格式");
            }
        }
    }
];

class Extra extends PureComponent {
    state = {
        validation: { extra: {} },
        extra: "",
        updateDate: null
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;
        const userExtra = await http.get(`users/${match.params.id}/extra`);
        if (userExtra) {
            const extra = userExtra.extra && JSON.stringify(userExtra.extra, null, 4);
            this.setState({ extra, updateDate: userExtra.updateDate });
        }
    };

    onChange = ({ target: { value } }) => {
        this.setState({ extra: value });
    };

    validateExtra = async () => {
        const { validation, extra } = this.state;
        try {
            await new Validator({ extra: RULE }).validate({ extra }, { first: true });
            validation.extra = {};
            return true;
        } catch ({ errors }) {
            validation.extra = { text: errors[0].message, error: true };
            return false;
        } finally {
            this.setState({ validation: { ...validation } });
        }
    };

    submit = async () => {
        const { match } = this.props;
        const { extra } = this.state;

        if (!(await this.validateExtra())) return;

        // 转成对象，如果为空，需要转成null
        const obj = extra ? JSON.parse(extra) : null;

        await http.put(`users/${match.params.id}/extra`, { extra: obj });

        if (extra) this.setState({ extra: JSON.stringify(obj, null, 4) });

        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
    };

    render() {
        const { extra, validation, updateDate } = this.state;

        return (
            <form>
                <InputBox label="用户附加信息">
                    <FormControl error={validation.extra.error} variant="outlined">
                        <OutlinedInput
                            id="extra"
                            onChange={this.onChange}
                            onBlur={this.validateExtra}
                            value={extra || ""}
                            multiline
                            rows={10}
                            placeholder={`{"themePreference": "dark", "blogUrl": "www.example.com", ...}`}
                        />
                        <FormHelperText>{validation.extra.text}</FormHelperText>
                        <FormHelperText error={false}>
                            {updateDate && (
                                <span>
                                    上次更新时间：
                                    {moment(updateDate).format(DATE_TIME_FORMAT)}；
                                </span>
                            )}
                            保存时内容会自动格式化，无需手工处理。
                        </FormHelperText>
                    </FormControl>
                </InputBox>
                <InputBox>
                    <div style={{ marginTop: 5 }}>
                        <Button variant="contained" color="primary" onClick={this.submit}>
                            保 存
                        </Button>
                    </div>
                </InputBox>
                <div className="tipBox">
                    <p>提示：</p>
                    <ol>
                        <li>
                            附加信息是对标准账号信息的个性化补充。两者区别：标准账号信息跨租户共享，你不能修改，而附加信息每个租户独立，可以随意修改。
                        </li>
                        <li>
                            要求是JSON格式，且总长度不超过1000字符；在获取用户信息时，会以extra字段补充到标准账号信息。
                        </li>
                        <li>
                            一些适合存储在extra的数据包括：标准账号没提供但你需要的用户信息、用户在你的应用的偏好设置、你对某个用户的特殊备注等等。
                        </li>
                    </ol>
                </div>
            </form>
        );
    }
}

export default withRouter(Extra);
