import { Tooltip } from "@material-ui/core";
import React from "react";

export default function({ tip, hidden, toggle }) {
    return (
        <Tooltip title={tip}>
            <div className="inputEndButton" onClick={toggle}>
                <span className="material-icons" style={{ fontSize: 17 }}>
                    {hidden ? "visibility" : "visibility_off"}
                </span>
            </div>
        </Tooltip>
    );
}
