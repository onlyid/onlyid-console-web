import React from "react";

export default function({ success }) {
    if (success == null) return "-";

    return success ? (
        <span style={{ color: "#4caf50" }}>成功</span>
    ) : (
        <span style={{ color: "#f44336" }}>失败</span>
    );
}
