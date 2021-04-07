import React, { PureComponent } from "react";
import { Button, FormControl, FormHelperText, OutlinedInput } from "@material-ui/core";
import Validator from "async-validator";
import styles from "./Add.module.css";
import { Add as AddIcon } from "@material-ui/icons";
import { eventEmitter } from "my/utils";
import http from "my/http";

const RULES = {
    resource: [
        { required: true, message: "请输入" },
        { max: 40, message: "最多输入40字" }
    ],
    operation: { max: 40, message: "最多输入40字" },
    description: { max: 100, message: "最多输入100字" }
};

export default class extends PureComponent {
    state = {
        validation: { resource: {}, operation: {}, description: {} },
        values: {}
    };

    onChange = ({ target }) => {
        this.setState(({ values }) => ({ values: { ...values, [target.id]: target.value } }));
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
        const { values, validation } = this.state;
        const { onAdd, clientId } = this.props;

        try {
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        await http.post("permissions", { ...values, clientId });
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onAdd();
    };

    render() {
        const { validation, values } = this.state;

        return (
            <>
                <h2>添加权限</h2>
                <p>定义这个应用需要使用的权限。</p>
                <form className={styles.form1}>
                    <div className={styles.inputBox}>
                        <label className="required">资源</label>
                        <FormControl error={validation.resource.error} variant="outlined" fullWidth>
                            <OutlinedInput
                                id="resource"
                                onChange={this.onChange}
                                onBlur={this.validateField}
                                value={values.resource || ""}
                                placeholder="appointments"
                            />
                            <FormHelperText>{validation.resource.text}</FormHelperText>
                        </FormControl>
                    </div>
                    <div className={styles.inputBox}>
                        <label>操作</label>
                        <FormControl
                            error={validation.operation.error}
                            variant="outlined"
                            fullWidth
                        >
                            <OutlinedInput
                                id="operation"
                                onChange={this.onChange}
                                onBlur={this.validateField}
                                value={values.operation || ""}
                                placeholder="read"
                            />
                            <FormHelperText>{validation.operation.text}</FormHelperText>
                        </FormControl>
                    </div>
                    <div className={styles.inputBox} style={{ flexGrow: 1.5 }}>
                        <label>描述</label>
                        <FormControl
                            error={validation.description.error}
                            variant="outlined"
                            fullWidth
                        >
                            <OutlinedInput
                                id="description"
                                onChange={this.onChange}
                                onBlur={this.validateField}
                                value={values.description || ""}
                            />
                            <FormHelperText>{validation.description.text}</FormHelperText>
                        </FormControl>
                    </div>
                    <div style={{ marginTop: 35, marginLeft: 20 }}>
                        <Button
                            color="primary"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={this.submit}
                        >
                            添 加
                        </Button>
                    </div>
                </form>
            </>
        );
    }
}
