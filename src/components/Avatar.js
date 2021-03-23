import React, { PureComponent } from "react";
import styles from "./Avatar.module.css";
import defaultAvatar from "assets/default-avatar.svg";

class Avatar extends PureComponent {
    render() {
        const { url, width = 80, style = {} } = this.props;

        return (
            <img
                src={url || defaultAvatar}
                alt="avatar"
                className={styles.img}
                width={width}
                height={width}
                style={style}
            />
        );
    }
}

export default Avatar;
