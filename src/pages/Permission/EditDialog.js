import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    OutlinedInput
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import InputBox from "components/InputBox";
import { eventEmitter } from "my/utils";
import http from "my/http";
import Validator from "async-validator";

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

    componentDidMount() {
        const {
            permission: { resource, operation, description }
        } = this.props;

        this.setState({ values: { resource, operation, description } });
    }

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
        const { onSave, permission } = this.props;

        try {
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        await http.put("permissions/" + permission.id, values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onSave();
    };

    render() {
        const { open, onCancel } = this.props;
        const { validation, values } = this.state;

        return (
            <Dialog open={open}>
                <DialogTitle>
                    编辑权限
                    <DialogClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent style={{ width: 500 }}>
                    <InputBox label="资源" required vertical>
                        <FormControl error={validation.resource.error} variant="outlined">
                            <OutlinedInput
                                id="resource"
                                onChange={this.onChange}
                                onBlur={this.validateField}
                                value={values.resource || ""}
                                placeholder="appointment"
                            />
                            <FormHelperText>{validation.resource.text}</FormHelperText>
                        </FormControl>
                    </InputBox>
                    <InputBox label="操作" vertical>
                        <FormControl error={validation.operation.error} variant="outlined">
                            <OutlinedInput
                                id="operation"
                                onChange={this.onChange}
                                onBlur={this.validateField}
                                value={values.operation || ""}
                                placeholder="read"
                            />
                            <FormHelperText>{validation.operation.text}</FormHelperText>
                        </FormControl>
                    </InputBox>
                    <InputBox label="描述" vertical>
                        <FormControl error={validation.description.error} variant="outlined">
                            <OutlinedInput
                                id="description"
                                onChange={this.onChange}
                                onBlur={this.validateField}
                                value={values.description || ""}
                                multiline
                                rows={2}
                            />
                            <FormHelperText>{validation.description.text}</FormHelperText>
                        </FormControl>
                    </InputBox>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>取 消</Button>
                    <Button onClick={this.submit} color="primary">
                        保 存
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
