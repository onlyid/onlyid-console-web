import React, { PureComponent } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link } from "@material-ui/core";
import DialogClose from "components/DialogClose";
import styles from "./index.module.css";
import ParamTable from "components/ParamTable";
import http from "my/http";

export default class extends PureComponent {
    state = {
        step: 1,
        loading: false,
        logUrl: "",
        totalCount: 0,
        failCount: 0
    };

    next = () => {
        this.setState({ step: 2 });
        setTimeout(() => window.Prism.highlightAll(), 0);
    };

    onChange = async e => {
        this.setState({ loading: true });

        const { files } = e.target;

        if (!files.length) return;

        const file = files[0];
        e.target.value = null;

        const formData = new FormData();
        formData.append("file", file);
        const { logUrl, totalCount, failCount } = await http.post("users/import", formData);

        this.setState({ logUrl, totalCount, failCount, step: 3, loading: false });
    };

    render() {
        const { open, onCancel, onSave } = this.props;
        const { step, logUrl, loading, totalCount, failCount } = this.state;

        if (step === 1)
            return (
                <Dialog open={open} onClose={onCancel}>
                    <DialogTitle>
                        请注意
                        <DialogClose onClose={onCancel} />
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <p style={{ marginTop: 0 }}>
                            当你的应用接入唯ID SSO后，登录的用户会自动出现在用户管理页。因此，
                            <span style={{ color: "#f50057" }}>
                                你通常不需要手工导入用户账号数据。
                            </span>
                        </p>
                        <p>导入功能主要用于：</p>
                        <ol className={styles.ol1}>
                            <li>
                                已上线应用之前自建身份认证系统，现在准备迁移到唯ID，可以批量导入存量用户账号数据，方便老用户首次登录。
                            </li>
                            <li>
                                正在开发的应用目标用户已经确定，如：企业内部信息系统，可以批量导入全体员工账号数据，方便员工首次登录。
                            </li>
                        </ol>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onCancel}>取 消</Button>
                        <Button onClick={this.next} color="primary">
                            明白了，继续导入
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        else if (step === 2) {
            const param = [
                {
                    name: "avatarUrl",
                    type: "否，字符串",
                    desc: "头像URL，JPG/PNG格式，建议长宽 >= 256像素"
                },
                { name: "nickname", type: "是，字符串", desc: "昵称，要 <= 20字符" },
                { name: "mobile", type: "否，字符串", desc: "手机号，11位中国大陆手机号码" },
                {
                    name: "email",
                    type: "否，字符串",
                    desc: "邮箱，注意：手机号和邮箱至少要填一项"
                },
                {
                    name: "gender",
                    type: "否，枚举字符串",
                    desc: "性别，可选值：MALE、FEMALE、OTHER，分别代表男性、女性、其他"
                },
                { name: "birthDate", type: "否，时间字符串", desc: "出生日期，格式：YYYY-MM-DD" },
                {
                    name: "province",
                    type: "否，字符串",
                    desc: "所在省份，包括直辖市和香港、澳门"
                },
                {
                    name: "city",
                    type: "否，字符串",
                    desc: "所在城市，包括直辖市和香港、澳门的区（如朝阳区）"
                },
                {
                    name: "bio",
                    type: "否，字符串",
                    desc: "用户简介，要 <= 200字符"
                }
            ];

            return (
                <Dialog open={open} maxWidth="lg">
                    <DialogTitle>
                        上传文件
                        <DialogClose onClose={onCancel} />
                    </DialogTitle>
                    <DialogContent>
                        <p style={{ marginTop: 0 }}>
                            上传文件默认以UTF-8编码JSON格式解析（后缀名不限），要求是JSON数组，内含表示用户账号的JSON对象：
                        </p>
                        <ParamTable data={param} />
                        <p>示例：</p>
                        <pre style={{ margin: 0 }}>
                            <code className="language-javascript">
                                {`[{
    "avatarUrl": "http://www.example.com/xxxxx.jpeg",
    "nickname": "王语嫣",
    "mobile": "18588000000",
    "email": null,
    "gender": null,
    "birthDate": "1999-09-09",
    "province": "广西壮族自治区",
    "city": "玉林市",
    "bio": null
}]`}
                            </code>
                        </pre>
                        <div className="tipBox">
                            <p>提示：</p>
                            <ol>
                                <li>
                                    用户头像会上传到唯ID的服务器，在经过处理后会生成新的avatarUrl。
                                </li>
                                <li>
                                    用户首次使用导入的账号时，唯ID会引导用户验证手机号/邮箱并设置登录密码（称为激活账号）。
                                </li>
                                <li>
                                    单次导入用户数量不能超过一万，对于规模较大的应用迁移到唯ID，请直接联系我们。
                                </li>
                            </ol>
                        </div>
                    </DialogContent>
                    <DialogActions key={Date()}>
                        <Button onClick={onCancel}>取 消</Button>
                        <input
                            id="upload"
                            type="file"
                            style={{ display: "none" }}
                            onChange={this.onChange}
                            disabled={loading}
                        />
                        <label htmlFor="upload">
                            <Button color="primary" component="span" disabled={loading}>
                                {loading ? "处理中..." : "上传文件"}
                            </Button>
                        </label>
                    </DialogActions>
                </Dialog>
            );
        } else
            return (
                <Dialog open={open} onClose={onSave}>
                    <DialogTitle>
                        处理结果
                        <DialogClose onClose={onSave} />
                    </DialogTitle>
                    <DialogContent style={{ width: 600 }}>
                        <p style={{ marginTop: 0 }}>
                            上传文件共包含
                            <span style={{ color: "#f50057" }}> {totalCount} </span>
                            项数据。
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            其中导入成功
                            <span style={{ color: "#f50057" }}> {totalCount - failCount} </span>
                            项，导入失败<span style={{ color: "#f50057" }}> {failCount} </span>
                            项，查看{" "}
                            <Link href={logUrl} target="_blank">
                                错误日志
                            </Link>
                            。
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onSave} color="primary">
                            关 闭
                        </Button>
                    </DialogActions>
                </Dialog>
            );
    }
}
