import React from "react"
import EmptyDefault from "@/assets/empty-default.svg?react"
import EmptySimple from "@/assets/empty-simple.svg?react"
import styles from "./Empty.module.css"
import classNames from "classnames"

export default function Empty({ description, simple }) {
    return (
        <div className={classNames(styles.root, { [styles.simple]: simple })}>
            {simple ? <EmptySimple /> : <EmptyDefault />}
            <p>{description}</p>
        </div>
    )
}
