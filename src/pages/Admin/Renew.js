import React, { PureComponent } from "react";
import { Button, Descriptions, Modal, Radio } from "antd";
import Table from "components/Table";
import http from "my/http";
import moment from "moment";
import { DATE_TIME_FORMAT } from "my/constants";
import styles from "./index.module.css";

const { Item } = Descriptions;

class RenewDialog extends PureComponent {
    state = {
        yearNum: 3
    };

    submit = async () => {
        const { yearNum } = this.state;
        const { formHtml } = await http.post("admin/renew", { yearNum });
        document.body.innerHTML = formHtml;
        document.forms[0].submit();
    };

    onChange = e => {
        this.setState({ yearNum: e.target.value });
    };

    getNewExpires = (expireDate, yearNum) => {
        const now = moment();
        let expires = moment(expireDate);
        if (expires.isBefore(now)) expires = now;

        expires.add(yearNum, "y");
        return expires.format(DATE_TIME_FORMAT);
    };

    render() {
        const { visible, onCancel, expireDate } = this.props;
        const { yearNum } = this.state;

        return (
            <Modal
                visible={visible}
                title="续费"
                onOk={this.submit}
                okText="支付"
                onCancel={onCancel}
                width={600}
            >
                续费时长：
                <Radio.Group onChange={this.onChange} defaultValue={3}>
                    <Radio value={1}>1年</Radio>
                    <Radio value={2}>2年</Radio>
                    <Radio value={3}>3年</Radio>
                    <Radio value={4}>4年</Radio>
                    <Radio value={5}>5年</Radio>
                </Radio.Group>
                <table className={styles.renewTable}>
                    <thead>
                        <tr>
                            <td>待续费项</td>
                            <td>当前有效期</td>
                            <td>续费后有效期</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>统一账号和认证解决方案</td>
                            <td>{moment(expireDate).format(DATE_TIME_FORMAT)}</td>
                            <td>{this.getNewExpires(expireDate, yearNum)}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.renewFee}>
                    <p>
                        总计费用<span>{yearNum * 200}</span>元
                    </p>
                    <p className="tip" style={{ marginBottom: 0 }}>
                        点击“支付”后将跳转支付宝页面进行支付
                    </p>
                </div>
            </Modal>
        );
    }
}

class Renew extends PureComponent {
    columns = [
        {
            title: "订单ID",
            dataIndex: "id"
        },
        {
            title: "开发者ID",
            key: "uid",
            render: () => localStorage.getObj("userInfo").uid
        },
        {
            title: "续费时长",
            dataIndex: "yearNum",
            render: text => `${text} 年`
        },
        {
            title: "支付状态",
            dataIndex: "paid",
            render: (paid, record) => {
                if (paid) return <span style={{ color: "#52c41a" }}>成功</span>;

                const expiredDate = moment(record.createDate).add(1, "h");
                if (expiredDate.isBefore(moment())) return <span>已过期</span>;

                return <span style={{ color: "#faad14" }}>未支付</span>;
            }
        },
        {
            title: "创建日期",
            dataIndex: "createDate",
            render: d => moment(d).format(DATE_TIME_FORMAT)
        }
    ];

    state = {
        visible: false,
        list: [],
        loading: true
    };

    componentDidMount() {
        this.initData();
    }

    initData = async () => {
        this.setState({ loading: true });
        const list = await http.get("admin/trades");
        this.setState({ list, loading: false });
    };

    render() {
        const { visible, loading, list } = this.state;
        const { expireDate } = localStorage.getObj("tenantInfo");
        const dayCount = moment(expireDate).diff(moment(), "days");

        return (
            <>
                <Descriptions column={3} layout="vertical" colon={false}>
                    <Item label="产品信息">统一账号和认证解决方案</Item>
                    <Item label="有效期">{moment(expireDate).format(DATE_TIME_FORMAT)}</Item>
                    <Item label="状态">
                        {new Date(expireDate) < new Date() ? (
                            <span style={{ color: "#f5222d" }}>已过期</span>
                        ) : (
                            <>
                                <span style={{ color: "#52c41a" }}>正常</span>（{dayCount}天后到期）
                            </>
                        )}
                    </Item>
                </Descriptions>
                <Button
                    type="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => this.setState({ visible: true })}
                >
                    续费
                </Button>
                <span className="tip" style={{ marginLeft: 10 }}>
                    温馨提示：如果续费遇到问题，请联系客服处理。
                </span>
                <p className={styles.orderTitle}>订单历史</p>
                <Table
                    rowKey="id"
                    dataSource={list}
                    columns={this.columns}
                    pagination={false}
                    loading={loading}
                    size="middle"
                />
                <RenewDialog
                    expireDate={expireDate}
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                />
            </>
        );
    }
}

export default Renew;
