import CloseIcon from "@mui/icons-material/Close"
import { IconButton } from "@mui/material"
import styles from "./DialogClose.module.css"

export default function DialogClose({ onClose }) {
    return (
        <IconButton className={styles.root} onClick={onClose}>
            <CloseIcon />
        </IconButton>
    )
}
