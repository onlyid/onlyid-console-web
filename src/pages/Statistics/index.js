import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Empty } from "antd";
import styles from "./index.module.css";
import App from "./App";
import AppMenu1 from "components/AppMenu";

const AppMenu = connect(
    state => ({ selectedKey: state.statistics.selectedKey }),
    dispatch => ({ savePayload: payload => dispatch({ type: "statistics/save", payload }) })
)(AppMenu1);

class Statistics extends PureComponent {
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
                                showAll
                                onShowEmptyChange={showEmpty => this.setState({ showEmpty })}
                            />
                        </div>
                        <App />
                    </>
                )}
            </div>
        );
    }
}

export default connect(({ statistics }) => ({ statistics }))(Statistics);
