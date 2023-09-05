import React, { PureComponent } from "react";
import InputBox from "components/InputBox";
import { Button, FormControl, FormHelperText, Link, OutlinedInput } from "@material-ui/core";
import Validator from "async-validator";
import http from "my/http";
import { eventEmitter } from "my/utils";
import { withRouter } from "react-router-dom";
import tipBox from "components/TipBox.module.css";

const getArray = (value) =>
    value
        .replace(/[\n]/g, "")
        .split(";")
        .filter((item) => item)
        .map((item) => item.trim());

const RULES_APP = {
    packageName: { max: 50, message: "最多输入50字" },
    bundleId: { max: 50, message: "最多输入50字" }
};

const RULES_WEB = {
    redirectUris: {
        type: "array",
        required: true,
        message: "请输入",
        defaultField: { type: "url", message: "存在不合法的url" },
        transform: getArray
    },
    background: {
        type: "array",
        defaultField: {
            validator: (rule, value) => value.startsWith("background"),
            message: "存在前缀不是background的CSS属性"
        },
        transform: getArray
    }
};

const RULES_COM = {
    termsUrl: { type: "url", message: "不是合法的url" },
    privacyUrl: { type: "url", message: "不是合法的url" }
};

class OAuth extends PureComponent {
    state = {
        validation: {
            packageName: {},
            bundleId: {},
            redirectUris: {},
            background: {},
            termsUrl: {},
            privacyUrl: {}
        },
        packageName: "",
        bundleId: "",
        redirectUris: "",
        background: "",
        previewUrl: null,
        termsUrl: "",
        privacyUrl: ""
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const { match } = this.props;

        const clientId = match.params.id;
        const data = await http.get(`clients/${clientId}/oauth-config`);

        const { redirectUris, background, ...rest } = data;
        const previewUrl =
            "https://www.onlyid.net/oauth?client-id=" +
            clientId +
            "&redirect-uri=" +
            encodeURIComponent(redirectUris[0]);
        this.setState({
            redirectUris: redirectUris.join(";\n"),
            background: background.join(";\n"),
            previewUrl,
            ...rest
        });
    };

    onChange = ({ target }) => {
        this.setState({ [target.id]: target.value });
    };

    validateField = async ({ target: { id: key, value } }) => {
        const { validation } = this.state;
        const rules = { ...RULES_APP, ...RULES_WEB, ...RULES_COM };
        const validator = new Validator({ [key]: rules[key] });
        try {
            await validator.validate({ [key]: value }, { first: true });
            validation[key] = {};
        } catch ({ errors }) {
            validation[key] = { text: errors[0].message, error: true };
        }
        this.setState({ validation: { ...validation } });
    };

    onSubmit = async () => {
        const {
            packageName,
            bundleId,
            redirectUris,
            background,
            termsUrl,
            privacyUrl,
            validation
        } = this.state;
        const { clientType, match } = this.props;

        if (clientType === "APP" && !packageName && !bundleId) {
            const text = "应用包名和Bundle ID至少要填一项";
            eventEmitter.emit("app/openToast", { text, severity: "warning" });
            return;
        }

        let rules, source;
        if (clientType === "APP") {
            rules = { ...RULES_APP, ...RULES_COM };
            source = { packageName, bundleId, termsUrl, privacyUrl };
        } else {
            rules = { ...RULES_WEB, ...RULES_COM };
            source = { redirectUris, background, termsUrl, privacyUrl };
        }

        try {
            await new Validator(rules).validate(source, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        const values = {
            packageName,
            bundleId,
            redirectUris: getArray(redirectUris),
            background: getArray(background),
            termsUrl,
            privacyUrl
        };
        await http.put(`clients/${match.params.id}/oauth-config`, values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        this.initData();
    };

    render() {
        const {
            packageName,
            bundleId,
            redirectUris,
            background,
            previewUrl,
            validation,
            termsUrl,
            privacyUrl
        } = this.state;
        const { clientType } = this.props;

        return (
            <form>
                {clientType === "APP" ? (
                    <>
                        <InputBox label="Android 应用包名">
                            <FormControl error={validation.packageName.error} variant="outlined">
                                <OutlinedInput
                                    id="packageName"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={packageName || ""}
                                />
                                <FormHelperText>{validation.packageName.text}</FormHelperText>
                            </FormControl>
                        </InputBox>
                        <InputBox label="iOS Bundle ID">
                            <FormControl error={validation.bundleId.error} variant="outlined">
                                <OutlinedInput
                                    id="bundleId"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={bundleId || ""}
                                />
                                <FormHelperText>{validation.bundleId.text}</FormHelperText>
                            </FormControl>
                        </InputBox>
                    </>
                ) : (
                    <>
                        <InputBox label="应用回调 URI" required>
                            <FormControl error={validation.redirectUris.error} variant="outlined">
                                <OutlinedInput
                                    id="redirectUris"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={redirectUris}
                                    placeholder="https://www.example.com/my-app/oauth-callback"
                                    multiline
                                    rows={5}
                                />
                                <FormHelperText>{validation.redirectUris.text}</FormHelperText>
                                <FormHelperText error={false}>
                                    用户登录后，只允许重定向到这里指定的网址，以保证安全性；可以用分号分隔多个网址（一般用于不同环境，如测试环境）；必须以http://或https://开头。
                                </FormHelperText>
                            </FormControl>
                        </InputBox>
                        <InputBox label="登录页背景">
                            <FormControl error={validation.background.error} variant="outlined">
                                <OutlinedInput
                                    id="background"
                                    onChange={this.onChange}
                                    onBlur={this.validateField}
                                    value={background}
                                    placeholder="background-color: #fefefe"
                                    multiline
                                    rows={5}
                                />
                                <FormHelperText>{validation.background.text}</FormHelperText>
                                <FormHelperText error={false}>
                                    支持background前缀的CSS属性，用分号分隔多行代码；图片背景请自行host静态文件（必须是https），建议使用半透明图片。
                                    <Link href={previewUrl} target="_blank">
                                        预览
                                    </Link>
                                </FormHelperText>
                            </FormControl>
                        </InputBox>
                    </>
                )}
                <InputBox label="服务协议 URL">
                    <FormControl error={validation.termsUrl.error} variant="outlined">
                        <OutlinedInput
                            id="termsUrl"
                            onChange={this.onChange}
                            onBlur={this.validateField}
                            value={termsUrl || ""}
                            placeholder="https://www.example.com/my-app/terms.html"
                        />
                        <FormHelperText>{validation.termsUrl.text}</FormHelperText>
                        <FormHelperText error={false}>
                            登录页勾选框展示相应链接，当用户勾选同意后才能继续。
                        </FormHelperText>
                    </FormControl>
                </InputBox>
                <InputBox label="隐私政策 URL">
                    <FormControl error={validation.privacyUrl.error} variant="outlined">
                        <OutlinedInput
                            id="privacyUrl"
                            onChange={this.onChange}
                            onBlur={this.validateField}
                            value={privacyUrl || ""}
                            placeholder="https://www.example.com/my-app/privacy.html"
                        />
                        <FormHelperText>{validation.privacyUrl.text}</FormHelperText>
                        <FormHelperText error={false}>
                            登录页勾选框展示相应链接，当用户勾选同意后才能继续。
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
                    <p>不提供更多登录页自定义的说明：</p>
                    <ol>
                        <li>
                            OAuth登录页之前曾提供主题样式和显示界面的自定义，这些选项已在2021年6月版本全部移除。
                        </li>
                        <li>
                            单个应用对登录页过多的自定义，会让用户疑惑不解甚至怀疑是假冒网站，唯ID未来也没有引入更多自定义选项（比如主题色自定义）的计划。
                        </li>
                    </ol>
                </div>
            </form>
        );
    }
}

export default withRouter(OAuth);
