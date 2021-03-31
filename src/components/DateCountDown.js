import React from "react";
import moment from "moment";

export default function({ date }) {
    let unit, count;
    count = moment(date).diff(moment(), "hour");
    if (count > 24) {
        unit = "天";
        count = Math.floor(count / 24);
    } else {
        unit = "小时";
    }

    return (
        <span>
            {count === 0 ? (
                <>
                    剩余不到 <span style={{ color: "#f50057" }}>1</span> 小时
                </>
            ) : (
                <>
                    剩余 <span style={{ color: "#f50057" }}>{count}</span> {unit}
                </>
            )}
        </span>
    );
}
