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
import Validator from "async-validator";
import { eventEmitter } from "my/utils";
import http from "my/http";

const RULES = {
    name: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    description: { max: 200, message: "最多输入200字" }
};

export default class extends PureComponent {
    state = {
        validation: { name: {}, description: {} },
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
        const { onSave, clientId } = this.props;

        try {
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        await http.post("roles", { ...values, clientId });
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onSave();
    };

    render() {
        const { open, onCancel } = this.props;
        const { validation, values } = this.state;

        return (
            <Dialog open={open}>
                <DialogTitle>
                    新建角色
                    <DialogClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent style={{ width: 600 }}>
                    <InputBox label="角色名称" required vertical>
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
                    <InputBox label="应用描述" vertical>
                        <FormControl error={validation.description.error}>
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
