import React, { Component } from 'react';
import MineField from '../MineField/MineField';
import './Minesweeper.css';

export default class Minesweeper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLevel: { level: 'Easy', multiplier: 1 },
            selectedSize: { size: '4 X 4', number: 4 },
            windowWidth: window.innerWidth
        }
    }

    render() {
        const { selectedLevel, selectedSize, windowWidth } = this.state;
        const levels = [{ level: 'Easy', multiplier: 1 }, { level: 'Medium', multiplier: 2 }, { level: 'Hard', multiplier: 3 }];
        const sizes = [{ size: '4 X 4', number: 4 }, { size: '8 X 8', number: 8 }, { size: '12 X 12', number: 12 }];

        const renderLevels = levels.map((level, i) => {
            return (
                <div className={selectedLevel.level.toLowerCase() === level.level.toLowerCase() ? 'active option' : 'option'} key={i} onClick={() => { this.setState({ selectedLevel: level }) }}>
                    <span>{level.level}</span>
                </div>
            )
        });

        const renderSizes = sizes.map((size, i) => {
            return (
                <div className={selectedSize.number === size.number ? 'active option' : 'option'} key={i} onClick={() => { this.setState({ selectedSize: size }) }}>
                    <span>{size.size}</span>
                </div>
            )
        });

        return (
            <div className="main">
                {
                    windowWidth > 700 ? 
                    <React.Fragment>
                    <div className="header">
                        <h3 className="title">Minesweeper</h3>
                    </div>
                    <div className="game-options">
                        <div className="game-option">
                            <div className="option-type">
                                <span>Level : </span>
                            </div>
                            {renderLevels}
                        </div>
                        <div className="game-option">
                            <div className="option-type">
                                <span>Size : </span>
                            </div>
                            {renderSizes}
                        </div>
                    </div>
                    <div className="game-block">
                        <MineField row={selectedSize.number} column={selectedSize.number} minesCount={selectedSize.number * selectedLevel.multiplier} />
                    </div>
                </React.Fragment>:
                <div className="warning-msg-blk">
                    <span className="warning-msg">Please reload page in landscape mode for better experience.</span>
                </div>
                }
                
            </div>
        )
    }
}