import React, { PureComponent } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    OutlinedInput,
    Radio,
    RadioGroup,
    Tooltip
} from "@material-ui/core";
import DialogClose from "components/DialogClose";
import InputBox from "components/InputBox";
import { CLIENT_TYPE_TEXT, IMG_UPLOAD_TIP } from "my/constants";
import styles from "./CreateDialog.module.css";
import Validator from "async-validator";
import { eventEmitter, transformImage } from "my/utils";
import http from "my/http";

const RULES = {
    name: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    type: { required: true, message: "请选择" },
    description: { max: 200, message: "最多输入200字" }
};

export default class extends PureComponent {
    state = {
        validation: { name: {}, type: {}, description: {} },
        values: {},
        iconDataUrl: null,
        filename: null
    };

    onUploadChange = async ({ target }) => {
        const { files } = target;

        if (!files.length) return;

        const file = files[0];
        target.value = null;
        const { blob, dataURL } = await transformImage(file);

        const formData = new FormData();
        formData.append("file", blob);
        const { filename } = await http.post("img", formData);

        this.setState({ filename, iconDataUrl: dataURL });
    };

    onChange = ({ target }) => {
        this.setState(({ values }) => ({ values: { ...values, [target.id]: target.value } }));
    };

    onTypeChange = ({ target: { value } }) => {
        this.setState(({ values }) => ({ values: { ...values, type: value } }));
        this.validateField({ target: { id: "type", value } });
    };

    validateField = async ({ target: { id: key, value } }) => {
        const { validation } = this.state;
        try {
            await new Validator({ [key]: RULES[key] }).validate({ [key]: value }, { first: true });
            validation[key] = { text: null, error: false };
        } catch ({ errors }) {
            validation[key] = { text: errors[0].message, error: true };
        }
        this.setState({ validation: { ...validation } });
    };

    submit = async () => {
        const { values, filename, validation } = this.state;
        const { onSave } = this.props;

        if (!filename) {
            eventEmitter.emit("app/openToast", { text: "请上传应用Icon", severity: "error" });
            return;
        }

        try {
            await new Validator(RULES).validate(values, { firstFields: true });
        } catch ({ errors }) {
            for (const e of errors) validation[e.field] = { text: e.message, error: true };

            return this.setState({ validation: { ...validation } });
        }

        values.filename = filename;
        await http.post("clients", values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onSave();
    };

    render() {
        const { open, onCancel } = this.props;
        const { validation, values, iconDataUrl } = this.state;

        return (
            <Dialog open={open}>
                <DialogTitle>
                    新建应用
                    <DialogClose onClose={onCancel} />
                </DialogTitle>
                <DialogContent className={styles.content}>
                    <InputBox label="应用 Icon" required vertical>
                        <div className={styles.uploadBox}>
                            <input
                                accept="image/jpeg,image/png"
                                id="upload"
                                type="file"
                                onChange={this.onUploadChange}
                            />
                            <Tooltip title={IMG_UPLOAD_TIP} placement="right">
                                <label htmlFor="upload">
                                    {iconDataUrl ? (
                                        <img src={iconDataUrl} alt="icon" />
                                    ) : (
                                        <span className="material-icons">blur_on</span>
                                    )}
                                    <span className={styles.uploadTip}>点击上传</span>
                                </label>
                            </Tooltip>
                        </div>
                    </InputBox>
                    <InputBox label="应用名称" required vertical>
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
                    <InputBox label="应用类型" vertical required>
                        <FormControl error={validation.type.error} variant="outlined">
                            <RadioGroup
                                row
                                id="type"
                                value={values.type || ""}
                                onChange={this.onTypeChange}
                            >
                                {Object.keys(CLIENT_TYPE_TEXT).map(key => (
                                    <FormControlLabel
                                        value={key}
                                        key={key}
                                        control={<Radio color="primary" />}
                                        label={CLIENT_TYPE_TEXT[key]}
                                    />
                                ))}
                            </RadioGroup>
                            <FormHelperText>{validation.type.text}</FormHelperText>
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
