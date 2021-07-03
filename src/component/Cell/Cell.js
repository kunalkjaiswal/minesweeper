import React from 'react';
import './Cell.css'

const Cell = (props) => {
    const { value, onClick, contextMenu, postionAdjuster } = props;
    let cellClassName = "cell";
    if (!value.isRevealed)
        cellClassName = cellClassName + " hidden";
    if (value.isMine)
        cellClassName = cellClassName + " mine";
    if (value.isFlagged)
        cellClassName = cellClassName + " flag";

    const getValue = () => {
        const { value, gameStatus } = props;

        if (!value.isRevealed) {
            return value.isFlagged ? "🚩" : null;
        }
        if (value.isMine && gameStatus === 'You Won 😃') {
            return "💣";
        }
        if (value.isMine && gameStatus !== 'You Won 😃') {
            return "💥";
        }
        if (value.neighbour === 0) {
            return null;
        }
        return value.neighbour;
    }

    return (
        <div
            style={{ left: 22 - postionAdjuster }}
            className={cellClassName}
            onClick={onClick}
            onContextMenu={contextMenu}
        >
            {getValue()}
        </div>
    );
}

export default Cell;