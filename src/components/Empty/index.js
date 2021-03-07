import React from "react";
import { ReactComponent as EmptyDefault } from "assets/empty-default.svg";
import { ReactComponent as EmptySimple } from "assets/empty-simple.svg";
import styles from "./index.module.css";
import classNames from "classnames";

export default function({ description, simple }) {
    return (
        <div className={classNames(styles.root, { [styles.simple]: simple })}>
            {simple ? <EmptySimple /> : <EmptyDefault />}
            <p>{description}</p>
        </div>
    );
}
