import React, { PureComponent } from "react";
import styles from "./index.module.css";
import defaultAvatar from "assets/default-avatar.svg";

class Avatar extends PureComponent {
    render() {
        const { url, width = 80, cursorPointer, style = {} } = this.props;

        if (cursorPointer) style.cursor = "pointer";

        return (
            <img
                src={url || defaultAvatar}
                alt="avatar"
                className={styles.img}
                width={width}
                style={style}
            />
        );
    }
}

export default Avatar;
