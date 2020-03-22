import React, { PureComponent } from "react";
import styles from "./index.module.css";
import Header from "./Header";

class Layout extends PureComponent {
    render() {
        const { children } = this.props;

        return (
            <div className={styles.layout}>
                <Header />
                <div className={styles.content}>{children}</div>
                <div className={styles.footer}>
                    &copy; 2015 - {new Date().getFullYear()} &nbsp; 深圳市友全科技有限公司 &nbsp;
                    All rights reserved.
                </div>
            </div>
        );
    }
}

export default Layout;
