import React, { PureComponent } from "react";
import InputBox from "components/InputBox";
import { Button, FormControl, FormHelperText, OutlinedInput } from "@material-ui/core";
import Validator from "async-validator";
import http from "my/http";
import { eventEmitter } from "my/utils";

const RULES_APP = {
    packageName: { max: 50, message: "最多输入50字" },
    bundleId: { max: 50, message: "最多输入50字" }
};

const RULE_URL = { type: "url", message: "存在不合法的url" };

class OAuth extends PureComponent {
    state = {
        validation: {
            packageName: { text: null, error: false },
            bundleId: { text: null, error: false },
            redirectUris: { text: null, error: false }
        },
        packageName: "",
        bundleId: "",
        redirectUris: ""
    };

    componentDidMount() {
        const { client } = this.props;
        if (client.id) this.init(client);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { client } = this.props;
        if (client !== prevProps.client) this.init(client);
    }

    init = ({ packageName, bundleId, redirectUris }) => {
        this.setState({ packageName, bundleId, redirectUris: redirectUris.join(";\n") });
    };

    onChange = ({ target }) => {
        this.setState({ [target.id]: target.value });
    };

    validateField = async ({ target: { id: key, value } }) => {
        const { validation } = this.state;
        const { client } = this.props;
        try {
            if (client.type === "APP") {
                const validator = new Validator({ [key]: RULES_APP[key] });
                await validator.validate({ [key]: value }, { first: true });
            } else {
                await this.validateUris(this.getUriArray(value));
            }
            validation[key].text = null;
            validation[key].error = false;
        } catch ({ errors }) {
            validation[key].text = errors[0].message;
            validation[key].error = true;
        } finally {
            this.setState({ validation: { ...validation } });
        }
    };

    getUriArray = value =>
        value
            .replace(/[\n\s]/g, "")
            .split(";")
            .filter(item => item);

    validateUris = async uris => {
        if (!uris.length) {
            const err = new Error();
            err.errors = [{ message: "请输入" }];
            throw err;
        }

        const validator = new Validator({ item: RULE_URL });
        for (const item of uris) {
            await validator.validate({ item }, { first: true });
        }
    };

    onSubmit = async () => {
        const { packageName, bundleId, redirectUris } = this.state;
        const { client, onChange } = this.props;
        let values;
        if (client.type === "APP") {
            if (!packageName && !bundleId) {
                eventEmitter.emit("app/openToast", {
                    text: "应用包名或Bundle ID至少填一项",
                    severity: "warning"
                });
                return;
            }
            const validator = new Validator(RULES_APP);
            try {
                await validator.validate({ packageName, bundleId }, { first: true });
            } catch (e) {
                return;
            }
            values = { packageName, bundleId };
        } else {
            const uris = this.getUriArray(redirectUris);
            try {
                await this.validateUris(uris);
            } catch (e) {
                return;
            }
            values = { redirectUris: uris };
        }

        await http.put(`clients/${client.id}/oauth-config`, values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onChange(values);
    };

    render() {
        const { packageName, bundleId, redirectUris, validation } = this.state;
        const { client } = this.props;

        return (
            <form>
                {client.type === "APP" ? (
                    <>
                        <InputBox label="Android 应用包名">
                            <FormControl
                                fullWidth
                                error={validation.packageName.error}
                                variant="outlined"
                            >
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
                            <FormControl
                                fullWidth
                                error={validation.bundleId.error}
                                variant="outlined"
                            >
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
                    <InputBox label="应用回调 URI" required>
                        <FormControl
                            fullWidth
                            error={validation.redirectUris.error}
                            variant="outlined"
                        >
                            <OutlinedInput
                                id="redirectUris"
                                onChange={this.onChange}
                                onBlur={this.validateField}
                                value={redirectUris}
                                multiline
                                rows={5}
                            />
                            <FormHelperText>{validation.redirectUris.text}</FormHelperText>
                            <FormHelperText error={false}>
                                用户登录后，只允许重定向到这里指定的网址，以保证安全性；你可以用分号分隔多个网址（一般用于不同环境，如测试环境）；必须以http://或https://开头。
                            </FormHelperText>
                        </FormControl>
                    </InputBox>
                )}
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

export default OAuth;
