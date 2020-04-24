import React from "react";

export default function({ success }) {
    if (success == null) return "-";

    return success ? (
        <span style={{ color: "#52c41a" }}>成功</span>
    ) : (
        <span style={{ color: "#f5222d" }}>失败</span>
    );
}
