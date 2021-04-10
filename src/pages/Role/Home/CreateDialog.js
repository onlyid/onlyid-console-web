import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    MenuItem,
    OutlinedInput,
    Select
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import InputBox from "components/InputBox";
import Validator from "async-validator";
import { eventEmitter } from "my/utils";
import http from "my/http";
import { Alert } from "@material-ui/lab";

const RULES = {
    name: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    description: { max: 200, message: "最多输入200字" },
    clientId: { required: true, message: "请选择" }
};

export default class extends PureComponent {
    state = {
        validation: { name: {}, description: {}, clientId: {} },
        values: {},
        list: [],
        noClientError: false
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        const list = await http.get("clients");
        this.setState({ list });

        if (!list.length) this.setState({ noClientError: true });
    };

    onChange = ({ target }) => {
        this.setState(({ values }) => ({ values: { ...values, [target.id]: target.value } }));
    };

    onClientChange = ({ target }) => {
        this.setState(({ values }) => ({ values: { ...values, clientId: target.value } }));
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
        const { onSave } = this.props;

        try {
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        await http.post("roles", values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onSave();
    };

    render() {
        const { open, onCancel } = this.props;
        const { validation, values, list, noClientError } = this.state;

        return (
            <Dialog open={open}>
                <DialogTitle>
                    新建角色
                    <DialogClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent style={{ width: 600 }}>
                    {noClientError && (
                        <Alert severity="error" style={{ marginBottom: 15 }}>
                            角色以应用维度划分，请先到应用管理新建应用
                        </Alert>
                    )}
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
                    <InputBox label="所属应用" vertical required>
                        <FormControl error={validation.clientId.error} variant="outlined">
                            <Select
                                id="client-select"
                                value={values.clientId || ""}
                                onChange={this.onClientChange}
                                variant="outlined"
                            >
                                {list.map(client => (
                                    <MenuItem key={client.id} value={client.id}>
                                        {client.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{validation.clientId.text}</FormHelperText>
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
