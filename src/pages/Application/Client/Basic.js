import React, { PureComponent } from "react";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Radio,
    RadioGroup
} from "@material-ui/core";
import { CLIENT_TYPE_TEXT } from "my/constants";
import CopyButton from "components/CopyButton";
import RevealButton from "components/RevealButton";
import Validator from "async-validator";
import http from "my/http";
import InputBox from "components/InputBox";
import { eventEmitter } from "my/utils";

const RULES = {
    name: [
        { required: true, message: "请输入" },
        { max: 50, message: "最多输入50字" }
    ],
    description: [{ max: 150, message: "最多输入150字" }]
};

class Basic extends PureComponent {
    state = {
        validation: {
            name: { text: null, error: false },
            description: { text: null, error: false }
        },
        values: {},
        hiddenSecret: true
    };

    componentDidMount() {
        const { client } = this.props;
        if (client.id) this.setState({ values: { ...client } });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { client } = this.props;
        if (client !== prevProps.client) this.setState({ values: { ...client } });
    }

    onSubmit = async () => {
        const { values } = this.state;
        const { client, onChange } = this.props;
        const validator = new Validator(RULES);
        try {
            await validator.validate(values, { first: true });
        } catch (e) {
            return;
        }

        await http.put("clients/" + client.id, values);
        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 });
        onChange(values);
    };

    toggleHideSecret = () => {
        this.setState(({ hiddenSecret }) => ({ hiddenSecret: !hiddenSecret }));
    };

    onChange = ({ target }) => {
        this.setState(({ values }) => ({ values: { ...values, [target.id]: target.value } }));
    };

    onTypeChange = ({ target: { value } }) => {
        this.setState(({ values }) => ({ values: { ...values, type: value } }));
    };

    validateField = async ({ target: { id: key, value } }) => {
        const { validation } = this.state;
        try {
            const validator = new Validator({ [key]: RULES[key] });
            await validator.validate({ [key]: value }, { first: true });

            validation[key].text = null;
            validation[key].error = false;
        } catch ({ errors }) {
            validation[key].text = errors[0].message;
            validation[key].error = true;
        } finally {
            this.setState({ validation: { ...validation } });
        }
    };

    render() {
        const { values, hiddenSecret, validation } = this.state;

        return (
            <form>
                <InputBox label="应用名称" required>
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
                <InputBox label="应用 ID">
                    <FormControl variant="outlined">
                        <OutlinedInput
                            id="id"
                            value={values.id || ""}
                            disabled
                            endAdornment={
                                <InputAdornment position="end">
                                    <CopyButton value={values.id} />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </InputBox>
                <InputBox label="应用 Secret">
                    <FormControl variant="outlined">
                        <OutlinedInput
                            id="secret"
                            value={values.secret || ""}
                            disabled
                            type={hiddenSecret ? "password" : "text"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <RevealButton
                                        tip="显示明文Secret"
                                        hidden={hiddenSecret}
                                        toggle={this.toggleHideSecret}
                                    />
                                    <CopyButton value={values.secret} />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </InputBox>
                <InputBox label="应用类型" radioGroup>
                    <FormControl variant="outlined">
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
                    </FormControl>
                </InputBox>
                <InputBox label="应用描述">
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
