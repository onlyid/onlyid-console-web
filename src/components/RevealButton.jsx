import { Tooltip } from "@mui/material"

export default function RevealButton({ tip, hidden, toggle }) {
    return (
        <Tooltip title={tip}>
            <div className="inputEndButton" onClick={toggle}>
                <span className="material-icons" style={{ fontSize: 17 }}>
                    {hidden ? "visibility" : "visibility_off"}
                </span>
            </div>
        </Tooltip>
    )
}
