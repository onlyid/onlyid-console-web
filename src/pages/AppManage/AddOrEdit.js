import React, { PureComponent } from "react";
import { Button, Form, Input, message, Radio, Tooltip, Upload } from "antd";
import http, { baseURL } from "my/http";
import { CLIENT_TYPE_TEXT, IMG_UPLOAD_TIP } from "my/constants";
import { connect } from "react-redux";
import { eventEmitter } from "my/utils";
import _ from "lodash";
import styles from "./index.module.css";

const { Item } = Form;
const { TextArea } = Input;

class AddOrEdit extends PureComponent {
    state = {
        iconUrl: null,
        filename: null
    };

    componentDidMount() {
        const { info } = this.props;

        if (info) {
            this.setState({ iconUrl: info.iconUrl });
        }
    }

    submit = () => {
        const { form, onSave, info } = this.props;
        const { filename } = this.state;

        form.validateFields(async (err, values) => {
            if (err) return;

            values.filename = filename;

            let select;
            // 编辑
            if (info) {
                await http.put("clients/" + info.id, values);
                select = "no";
            }
            // 新增
            else {
                if (!filename) {
                    message.error("请上传应用icon");
                    return;
                }

                await http.post("clients", values);
                select = "last";
            }

            message.success("保存成功");
            onSave();
            eventEmitter.emit("appManage/initAppMenu", select);
        });
    };

    beforeUpload = file => {
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            message.error("只能是PNG、JPG或JPEG格式");
            return false;
        }

        if (file.size > 350000) {
            message.error("不能大于 350 KB");
            return false;
        }

        return true;
    };

    onUploadChange = ({ file }) => {
        if (file.status === "error") {
            const msg = _.get(file, "response.error", "上传失败，请重试");
            message.error(msg);
        } else if (file.status === "done") {
            this.setState({
                iconUrl: URL.createObjectURL(file.originFileObj),
                filename: file.response.filename
            });
        }
    };

    render() {
        const { onCancel, form, info } = this.props;
        const { getFieldDecorator } = form;
        const { iconUrl } = this.state;

        const uploadIcon = (
            <Upload
                accept="image/jpeg,image/png"
                name="file"
                showUploadList={false}
                action={baseURL + "/img"}
                beforeUpload={this.beforeUpload}
                onChange={this.onUploadChange}
            >
                <Tooltip title={IMG_UPLOAD_TIP} className={styles.uploadBox}>
                    {iconUrl ? (
                        <img src={iconUrl} alt="icon" />
                    ) : (
                        <i className="material-icons">blur_on</i>
                    )}
                    <Button type="link">上传</Button>
                </Tooltip>
            </Upload>
        );

        return (
            <Form layout="vertical">
                <Item label="应用icon" required>
                    {uploadIcon}
                </Item>
                <Item label="应用名称">
                    {getFieldDecorator("name", {
                        initialValue: info && info.name,
                        rules: [
                            { required: true, message: "请填写" },
                            { max: 50, message: "最多输入50字" }
                        ]
                    })(<Input />)}
                </Item>
                <Item label="应用类型">
                    {getFieldDecorator("type", {
                        initialValue: info && info.type,
                        rules: [{ required: true, message: "请选择" }]
                    })(
                        <Radio.Group>
                            {Object.keys(CLIENT_TYPE_TEXT).map(key => (
                                <Radio value={key} key={key}>
                                    {CLIENT_TYPE_TEXT[key]}
                                </Radio>
                            ))}
                        </Radio.Group>
                    )}
                </Item>
                <Item label="应用描述">
                    {getFieldDecorator("description", {
                        initialValue: info && info.description,
                        rules: [{ max: 500, message: "最多输入500字" }]
                    })(<TextArea />)}
                </Item>
                <Item>
                    <Button type="primary" onClick={this.submit}>
                        保存
                    </Button>
                    <Button onClick={onCancel} style={{ marginLeft: 20 }}>
                        取消
                    </Button>
                </Item>
            </Form>
        );
    }
}

export default Form.create()(connect(({ appManage }) => ({ appManage }))(AddOrEdit));
