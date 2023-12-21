import React from "react";
import { Close as CloseIcon } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import styles from "./DialogClose.module.css";

export default function DialogClose({ onClose }) {
    return (
        <IconButton className={styles.root} onClick={onClose}>
            <CloseIcon />
        </IconButton>
    );
}
