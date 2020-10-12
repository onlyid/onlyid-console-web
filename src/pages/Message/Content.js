import React, { PureComponent } from "react";
import { Button, Empty, Modal, message as antMessage } from "antd";
import NoCard from "components/NoCard";
import { connect } from "react-redux";
import http from "my/http";
import styles from "./index.module.css";
import { eventEmitter } from "my/utils";

class Content extends PureComponent {
    state = {
        html: null
    };

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            message: { selectedKey }
        } = this.props;

        if (prevProps.message.selectedKey !== selectedKey) this.initData();
    }

    initData = async () => {
        const {
            message: { selectedKey }
        } = this.props;

        if (selectedKey) {
            const { html, isRead } = await http.get(`messages/${selectedKey}`);
            const userInfo = localStorage.getObj("userInfo");
            this.setState({ html: html.replace("#nickname#", userInfo.nickname) });

            if (!isRead) {
                await http.put(`messages/${selectedKey}/mark-read`);
                eventEmitter.emit("message/onMarkRead", selectedKey);
            }
        } else {
            this.setState({ html: null });
        }
    };

    delete1 = () => {
        Modal.confirm({
            content: "删除后不可恢复，确定删除？",
            okType: "danger",
            onOk: async () => {
                const {
                    message: { selectedKey }
                } = this.props;
                await http.delete("messages/" + selectedKey);
                eventEmitter.emit("message/onDelete");
                antMessage.success("删除成功");
            }
        });
    };

    render() {
        const { html } = this.state;

        if (!html)
            return (
                <div className={styles.emptyBox}>
                    <Empty description="" />
                </div>
            );

        return (
            <NoCard
                title="消息详情"
                right={
                    <Button
                        onClick={this.delete1}
                        icon="delete"
                        shape="circle"
                        type="danger"
                        className="buttonPlain"
                    />
                }
            >
                <div dangerouslySetInnerHTML={{ __html: html }} className={styles.contentBox} />
            </NoCard>
        );
    }
}

export default connect(({ message }) => ({ message }))(Content);
