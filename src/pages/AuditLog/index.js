import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Empty } from "antd";
import styles from "./index.module.css";
import LogTable from "./LogTable";
import AppMenu1 from "components/AppMenu";

const AppMenu = connect(
    state => ({ selectedKey: state.auditLog.selectedKey }),
    dispatch => ({ savePayload: payload => dispatch({ type: "auditLog/save", payload }) })
)(AppMenu1);

class AuditLog extends PureComponent {
    state = {
        showEmpty: false
    };

    render() {
        const { showEmpty } = this.state;

        return (
            <div className={styles.root}>
                {showEmpty ? (
                    <div className="emptyBox">
                        <Empty description="暂无应用，请到应用管理页新建" />
                    </div>
                ) : (
                    <>
                        <div>
                            <AppMenu
                                type="audit"
                                onShowEmptyChange={showEmpty => this.setState({ showEmpty })}
                            />
                        </div>
                        <LogTable />
                    </>
                )}
            </div>
        );
    }
}

export default connect(({ auditLog }) => ({ auditLog }))(AuditLog);
