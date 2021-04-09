import React, { PureComponent } from "react";
import { Button, FormControl, FormHelperText, OutlinedInput } from "@material-ui/core";
import Validator from "async-validator";
import http from "my/http";
import InputBox from "components/InputBox";
import { eventEmitter } from "my/utils";

const RULES = {
    name: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    description: { max: 200, message: "最多输入200字" }
};

class Basic extends PureComponent {
    state = {
        validation: { name: {}, description: {} },
        values: {}
    };

    componentDidMount() {
        const { role } = this.props;
        if (role.id) this.setState({ values: { ...role } });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { role } = this.props;
        if (role !== prevProps.role) this.setState({ values: { ...role } });
    }

    onSubmit = async () => {
        const { values, validation } = this.state;
        const { role, onSave } = this.props;

        try {
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        await http.put("roles/" + role.id, values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onSave();
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

    render() {
        const { values, validation } = this.state;

        return (
            <form>
                <InputBox label="角色名称" required>
                    <FormControl error={validation.name.error} variant="outlined">
                        <OutlinedInput
                            id="name"
                            onChange={this.onChange}
                            onBlur={this.validateField}
                            value={values.name || ""}
                        />
                        <FormHelperText>{validation.name.text}</FormHelperText>
                    </FormControl>
                </InputBox>
                <InputBox label="角色描述">
                    <FormControl error={validation.description.error} variant="outlined">
                        <OutlinedInput
                            id="description"
                            onChange={this.onChange}
                            onBlur={this.validateField}
                            value={values.description || ""}
                            multiline
                            rows={3}
                        />
                        <FormHelperText>{validation.description.text}</FormHelperText>
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
