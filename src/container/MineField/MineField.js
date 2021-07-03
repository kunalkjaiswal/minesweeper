import React, { Component } from 'react';
import Cell from '../../component/Cell/Cell';
import './MineField.css'

export default class MineField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mineFieldData: this.initMineField(this.props.row, this.props.column, this.props.minesCount),
            gameStatus: '',
            minesCount: this.props.minesCount,
            widthMultiplier: this.props.column
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.row !== prevProps.row || this.props.minesCount !== prevProps.minesCount) {
            this.setState({
                mineFieldData: this.initMineField(this.props.row, this.props.column, this.props.minesCount),
                widthMultiplier: this.props.column,
                gameStatus: '',
                minesCount: this.props.minesCount
            });
        }
    }

    initMineField = (row, column, minesCount) => {
        let data = this.createEmptyField(row, column);
        data = this.addMines(data, row, column, minesCount);
        data = this.getNeighbourMines(data, row, column);
        return data;
    }

    createEmptyField = (row, column) => {
        let data = [];
        for (let i = 0; i < row; i++) {
            data.push([]);
            for (let j = 0; j < column; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isEmpty: false,
                    isFlagged: false,
                    isRevealed: false
                };
            }
        }
        return data;
    }

    addMines = (data, row, column, minesCount) => {
        let r, c, mines = 0;
        while (mines < minesCount) {
            r = Math.floor(Math.random() * row);
            c = Math.floor(Math.random() * column);
            if (!(data[r][c].isMine)) {
                data[r][c].isMine = true;
                mines++;
            }
        }
        return (data);
    }

    getNeighbourMines = (data, row, column) => {
        let tempData = data, i, j, k;
        for (i = 0; i < row; i++) {
            for (j = 0; j < column; j++) {
                if (!data[i][j].isMine) {
                    let mineCount = 0;
                    const traversalData = this.traverseMineField(data[i][j].x, data[i][j].y, data);
                    for (k = 0; k < traversalData.length; k++) {
                        if (traversalData[k].isMine) {
                            mineCount++;
                        }
                    }
                    if (mineCount === 0) {
                        tempData[i][j].isEmpty = true;
                    }
                    tempData[i][j].neighbour = mineCount;
                }
            }
        }

        return (tempData);
    };

    traverseMineField = (x, y, data) => {
        const { row, column } = this.props;
        const traversalData = [];

        if (x > 0) {
            traversalData.push(data[x - 1][y]);
        }

        if (x < row - 1) {
            traversalData.push(data[x + 1][y]);
        }

        if (x > 0 && y > 0) {
            traversalData.push(data[x - 1][y - 1]);
        }

        if (y > 0) {
            traversalData.push(data[x][y - 1]);
        }

        if (x < row - 1 && y > 0) {
            traversalData.push(data[x + 1][y - 1]);
        }

        if (x > 0 && y < column - 1) {
            traversalData.push(data[x - 1][y + 1]);
        }

        if (y < column - 1) {
            traversalData.push(data[x][y + 1]);
        }

        if (x < row - 1 && y < column - 1) {
            traversalData.push(data[x + 1][y + 1]);
        }

        return traversalData;
    }

    handleCellClick = (cellData) => {
        let x = cellData.x,
            y = cellData.y;

        if (this.state.mineFieldData[x][y].isRevealed || this.state.mineFieldData[x][y].isFlagged) return null;

        if (this.state.mineFieldData[x][y].isMine) {
            this.setState({ gameStatus: "You Lost 😩" });
            this.revealMineField();
        }

        let tempMineFieldData = this.state.mineFieldData;
        tempMineFieldData[x][y].isFlagged = false;
        tempMineFieldData[x][y].isRevealed = true;

        if (tempMineFieldData[x][y].isEmpty) {
            tempMineFieldData = this.revealEmptyCell(x, y, tempMineFieldData);
        }

        if (this.getHidden(tempMineFieldData).length === this.props.mines) {
            this.setState({ mineCount: 0, gameStatus: "You Won 😃" });
            this.revealMineField();
        }

        this.setState({
            mineFieldData: tempMineFieldData,
            minesCount: this.props.minesCount - this.getFlags(tempMineFieldData).length,
        });
    }

    handleContextMenu(e, rowData) {
        e.preventDefault();
        let x = rowData.x, y = rowData.y;
        let tempMineFieldData = this.state.mineFieldData;
        let mines = this.state.minesCount;

        if (tempMineFieldData[x][y].isRevealed) return;

        if (tempMineFieldData[x][y].isFlagged) {
            tempMineFieldData[x][y].isFlagged = false;
            mines++;
        } 
        else {
            tempMineFieldData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = this.getMines(tempMineFieldData);
            const flagArray = this.getFlags(tempMineFieldData);
            if (JSON.stringify(mineArray) === JSON.stringify(flagArray)) {
                this.setState({ mineCount: 0, gameStatus: "You Won 😃" });
                this.revealMineField();
            }
        }

        this.setState({
            mineFieldData: tempMineFieldData,
            minesCount: mines,
        });
    }

    revealMineField = () => {
        let tempMineFieldData = this.state.mineFieldData;
        let i, j;
        for (i = 0; i < tempMineFieldData.length; i++) {
            for (j = 0; j < tempMineFieldData[i].length; j++) {
                tempMineFieldData[i][j].isRevealed = true;
            }
        }
        this.setState({
            mineFieldData: tempMineFieldData
        })
    }

    revealEmptyCell = (x, y, tempMineFieldData) => {
        let traversalData = this.traverseMineField(x, y, tempMineFieldData);
        let i;
        for (i = 0; i < traversalData.length; i++) {
            if (!traversalData[i].isFlagged && !traversalData[i].isRevealed && (traversalData[i].isEmpty || !traversalData[i].isMine)) {
                tempMineFieldData[traversalData[i].x][traversalData[i].y].isRevealed = true;
                if (traversalData[i].isEmpty) {
                    this.revealEmptyCell(traversalData[i].x, traversalData[i].y, tempMineFieldData);
                }
            }
        }
        return tempMineFieldData;
    }

    getHidden = (tempMineFieldData) => {
        let revealedArray = [], i, j;

        for (i = 0; i < tempMineFieldData.length; i++) {
            for (j = 0; j < tempMineFieldData[i].length; j++) {
                if (!tempMineFieldData[i][j].isRevealed) {
                    revealedArray.push(tempMineFieldData[i][j]);
                }
            }
        };
        return revealedArray;
    }

    getMines = (data) => {
        let mineArray = [], i, j;

        for (i = 0; i < data.length; i++) {
            for (j = 0; j < data[i].length; j++) {
                if (data[i][j].isMine) {
                    mineArray.push(data[i][j]);
                }
            }
        }
        return mineArray;
    }

    getFlags = (data) => {
        let flagArray = [], i, j;

        for (i = 0; i < data.length; i++) {
            for (j = 0; j < data[i].length; j++) {
                if (data[i][j].isFlagged) {
                    flagArray.push(data[i][j]);
                }
            }
        }
        return flagArray;
    }

    renderMineField = (mineFieldData) => {
        return mineFieldData.map((dataRow) => {
            return dataRow.map((rowItem, i) => {
                return (
                    <div className="mine-field"
                        key={i}>
                        <Cell
                            onClick={() => this.handleCellClick(rowItem)}
                            contextMenu={(e) => this.handleContextMenu(e, rowItem)}
                            value={rowItem}
                            gameStatus={this.state.gameStatus}
                            postionAdjuster={this.state.widthMultiplier}
                        />
                    </div>
                );
            })
        });
    }

    handleResetButton = () => {
        this.setState({
            mineFieldData: this.initMineField(this.props.row, this.props.column, this.props.minesCount),
            widthMultiplier: this.props.column,
            gameStatus: '',
            minesCount: this.props.minesCount
        });
    }

    render() {
        const { mineFieldData, widthMultiplier, minesCount, gameStatus } = this.state;
        return (
            <div className="mine-field-main" style={{ maxWidth: (widthMultiplier + 1) * 45, minHeight: (widthMultiplier + 2.5) * 42 }}>
                <div className="info-blk">
                    {
                        gameStatus.length ?
                            <span className="info">
                                {gameStatus}
                            </span>
                            :
                            null
                    }

                    <span className="info">
                        Number of mines: {minesCount}
                    </span>
                </div>
                {this.renderMineField(mineFieldData)}
                <div className="button-blk">
                    <input type="button" className="button" value="Reset Game" onClick={this.handleResetButton} />
                </div>
            </div>
        );
    }
}