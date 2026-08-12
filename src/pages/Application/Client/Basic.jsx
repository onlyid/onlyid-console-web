import { useState, useEffect } from "react"
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Radio,
    RadioGroup
} from "@material-ui/core"
import { CLIENT_TYPE_TEXT } from "@/my/constants"
import CopyButton from "@/components/CopyButton"
import RevealButton from "@/components/RevealButton"
import Validator from "async-validator"
import request from "@/my/request"
import InputBox from "@/components/InputBox"
import { eventEmitter } from "@/my/utils"

const RULES = {
    name: [
        { required: true, message: "请输入" },
        { max: 20, message: "最多输入20字" }
    ],
    description: { max: 200, message: "最多输入200字" }
}

export default function Basic({ client, onSave }) {
    const [validation, setValidation] = useState({
        name: {},
        description: {}
    })
    const [values, setValues] = useState({})
    const [hiddenSecret, setHiddenSecret] = useState(true)

    useEffect(() => {
        // mount的时候，不用执行
        if (client.id) setValues({ ...client })
    }, [client])

    const onSubmit = async () => {
        try {
            await new Validator(RULES).validate(values, { firstFields: true })
        } catch ({ errors }) {
            const v = { ...validation }

            for (const e of errors) v[e.field] = { text: e.message, error: true }

            return setValidation(v)
        }

        await request.put("clients/" + client.id, values)

        eventEmitter.emit("app/openToast", { text: "保存成功", timeout: 2000 })
        onSave()
    }

    const toggleHideSecret = () => {
        setHiddenSecret((prev) => !prev)
    }

    const onChange = ({ target }) => {
        setValues((values) => ({ ...values, [target.id]: target.value }))
    }

    const onTypeChange = ({ target: { value } }) => {
        setValues((values) => ({ ...values, type: value }))
    }

    const validateField = async ({ target: { id: key, value } }) => {
        const v = { ...validation }
        try {
            await new Validator({ [key]: RULES[key] }).validate({ [key]: value }, { first: true })
            v[key] = {}
        } catch ({ errors }) {
            v[key] = { text: errors[0].message, error: true }
        }
        setValidation(v)
    }

    return (
        <form>
            <InputBox label="应用名称" required>
                <FormControl error={validation.name.error} variant="outlined">
                    <OutlinedInput
                        id="name"
                        onChange={onChange}
                        onBlur={validateField}
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
                    <FormHelperText />
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
                                    toggle={toggleHideSecret}
                                />
                                <CopyButton value={values.secret} />
                            </InputAdornment>
                        }
                    />
                    <FormHelperText />
                </FormControl>
            </InputBox>
            <InputBox label="应用类型" radioGroup>
                <FormControl variant="outlined">
                    <RadioGroup row id="type" value={values.type || ""} onChange={onTypeChange}>
                        {Object.keys(CLIENT_TYPE_TEXT).map((key) => (
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
                        onChange={onChange}
                        onBlur={validateField}
                        value={values.description || ""}
                        multiline
                        rows={3}
                    />
                    <FormHelperText>{validation.description.text}</FormHelperText>
                </FormControl>
            </InputBox>
            <InputBox>
                <div style={{ marginTop: 5 }}>
                    <Button variant="contained" color="primary" onClick={onSubmit}>
                        保 存
                    </Button>
                </div>
            </InputBox>
        </form>
    )
}
