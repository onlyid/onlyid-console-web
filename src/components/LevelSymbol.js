import React from "react";
import styles from "./LevelSymbol.module.css";

export default function({ important }) {
    return (
        <div className={styles.root}>
            {important ? (
                <>
                    <span className="material-icons" style={{ color: "#f44336" }}>
                        flag
                    </span>
                    重要
                </>
            ) : (
                <>
                    <span className="material-icons" style={{ color: "#2196f3" }}>
                        info_outline
                    </span>
                    普通
                </>
            )}
        </div>
    );
}
