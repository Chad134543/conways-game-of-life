import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {

    onSquareClick = () => {
        this.props.onSquareClick(this.props.rowId, this.props.columnId);
    }

    render() {
        return (
            <div
                className={this.props.squareClasses}
                onClick={this.onSquareClick}
            />
        );
    }

}

class Row extends React.Component {
    render() {
        let rowArr = [];

        for (let c=0; c<this.props.numbOfColumns; c++) {
            let key = this.props.rowId + "_" + c,
                squareClasses = this.props.gridData[this.props.rowId][c] ? "square is-alive" : "square is-dead";

            rowArr.push(
                <Square
                    key={key}
                    rowId={this.props.rowId}
                    columnId={c}
                    squareClasses={squareClasses}
                    onSquareClick={this.props.onSquareClick}
                    gridData={this.props.gridData}
                />
            );
        }
        return (
            <div className="row clearfix">{rowArr}</div>
        );
    }
}

class Grid extends React.Component {
    render() {
        let rowsArr = [];

        for (let r=0; r<this.props.numbOfRows; r++) {
            rowsArr.push(
                <Row
                    key={r}
                    rowId={r}
                    numbOfColumns={this.props.numbOfColumns}
                    onSquareClick={this.props.onSquareClick}
                    gridData={this.props.gridData}
                />
            );
        }
        return (
            <div className="grid">{rowsArr}</div>
        );
    }
}

class Buttons extends React.Component {
    render() {
        return (
            <div>
                <button onClick={this.props.playOrPause} className={this.props.currentlyPaused ? 'paused' : ''}>
                    <svg version="1.1" id="icon_play" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 28" enableBackground="new 0 0 24 28" xmlSpace="preserve">
                        <polygon points="0,0 24,14 0,28 " />
                    </svg>
                    <svg version="1.1" id="icon_pause" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 27 26" enableBackground="new 0 0 27 26" xmlSpace="preserve">
                        <rect width={11} height={26} />
                        <rect x={16} width={11} height={26} />
                    </svg>
                </button>
                <button onClick={this.props.reseed}>
                    <svg version="1.1" id="icon_reseed" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 31 30" enableBackground="new 0 0 31 30" xmlSpace="preserve">
                        <path d="M21.6,18.8c-1.1,2.2-3.2,3.7-5.7,4.1c-0.4,0.1-0.8,0.1-1.2,0.1c-3.7,0-7-2.8-7.6-6.5c-0.3-2,0.2-4,1.4-5.7
                            c1.2-1.7,3-2.7,5-3.1C15.4,7.4,17.4,7.9,19,9l-3.6,3.3l13.9,3L27.5,1.1l-3.4,3.2L23.8,4C20.7,1.5,16.5,0.3,12.5,1
                            C4.6,2.2-0.9,9.6,0.4,17.5c1.1,7,7.2,12.3,14.3,12.3c0.7,0,1.5-0.1,2.2-0.2c4.6-0.7,8.6-3.6,10.7-7.8l0.6-1.1l-6.1-3.1L21.6,18.8z" />
                    </svg>
                </button>
            </div>
        );
    }
}

class Main extends React.Component {

    constructor() {
        super();
        this.speed = 100;
        this.numbOfRows = 50;
        this.numbOfColumns = 50;
        this.state = {
            gridData: Array(this.numbOfRows).fill(Array(this.numbOfColumns).fill(false))﻿,
            currentlyPaused: true
        };
    }

    onSquareClick = (r, c) => {
        let gridData_copy = this.state.gridData.map(innerArray => innerArray.slice());
        
        gridData_copy[r][c] = !gridData_copy[r][c]; // If alive make dead, if dead make alive.
        this.setState({ gridData: gridData_copy });
    }

    seed = () => {
        let gridData_copy = this.state.gridData.map(innerArray => innerArray.slice()),
            density = Math.floor(Math.random()*3);

        switch(density) {
            case 1:
                density=3.33;  // 30% chance squares will seed alive.
                break;
            case 2:
                density=5;  // 20% chance squares will seed alive.
                break;
            default:
                density=10;  // 10% chance squares will seed alive.
        }
        for (let i=0; i<this.numbOfRows; i++) {
            for (let j=0; j<this.numbOfColumns; j++) {
                if (Math.floor(Math.random()*density) === 1) {
                    gridData_copy[i][j] = true;
                }
            }
        }
        this.setState({ gridData: gridData_copy });
    }

    playOrPause = () => {
        clearInterval(this.playIntervalId);
        if (this.state.currentlyPaused) {
            this.setState({ currentlyPaused: false});
            this.playIntervalId = setInterval(this.advanceAGeneration, this.speed);
        } else {
            this.setState({ currentlyPaused: true});
        }
    }

    advanceAGeneration = () => {
        let gridData = this.state.gridData,
            gridData_copy = this.state.gridData.map(innerArray => innerArray.slice());

        for (let r=0; r < this.numbOfRows; r++) {
            for (let c=0; c < this.numbOfColumns; c++) {
                let numbOfNeighbors = 0;

                if (r > 0) {
                    if (gridData[r-1][c]) { numbOfNeighbors++; }  // If a neighbor is at top.
                }
                if (r > 0 && c < this.numbOfColumns-1) {
                    if (gridData[r-1][c+1]) { numbOfNeighbors++; }  // If a neighbor is at top/right.
                }
                if (c < this.numbOfColumns-1) {
                    if (gridData[r][c+1]) { numbOfNeighbors++; }  // If a neighbor is at right.
                }
                if (r < this.numbOfRows-1 && this.numbOfColumns-1) {
                    if (gridData[r+1][c+1]) { numbOfNeighbors++; }  // If a neighbor is at bottom/right.
                }
                if (r < this.numbOfRows-1) {
                    if (gridData[r+1][c]) { numbOfNeighbors++; }  // If a neighbor is at bottom.
                }
                if (r < this.numbOfRows-1 && c>0) {
                    if (gridData[r+1][c-1]) { numbOfNeighbors++; }  // If a neighbor is at bottom/left.
                }
                if (c > 0) {
                    if (gridData[r][c-1]) { numbOfNeighbors++; }  // If a neighbor is at left.
                }
                if (r > 0 && c > 0) {
                    if (gridData[r-1][c-1]) { numbOfNeighbors++; }  // If a neighbor is at top/left.
                }

                // Evaluate Live Cell
                // 1) Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
                // 2) Any live cell with more than three live neighbours dies, as if by overpopulation.
                // 3) Any live cell with two or three live neighbours lives on to the next generation.
                if (gridData[r][c] && (numbOfNeighbors<2 || numbOfNeighbors>3)) {
                    gridData_copy[r][c] = false;
                }

                // Evaluate Dead Cell
                // 4) Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                if (!gridData[r][c] && numbOfNeighbors === 3) {
                    gridData_copy[r][c] = true;
                }
            }
        }
        this.setState({
            gridData: gridData_copy
        });
    }

    reseed = () => {
        let gridData = Array(this.numbOfRows).fill(Array(this.numbOfColumns).fill(false))﻿;

        clearInterval(this.playIntervalId);
        this.setState({gridData: gridData}, function(){
            this.seed();
            if (!this.state.currentlyPaused) {
                this.setState({ currentlyPaused: true});
            }
        });
    }

    render() {
        return (
            <div>
                <div className="header-area">
                    <div>
                        <div>
                            <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" className="title">Conway<span className="apostrophe">&#8217;</span>s Game <span className="of">of</span> Lif<span className="e">e</span></a>
                        </div>
                        <div>
                            <Buttons
                                playOrPause={this.playOrPause}
                                reseed={this.reseed}
                                currentlyPaused={this.state.currentlyPaused}
                            />
                        </div>
                    </div>
                </div>
                <Grid 
                    numbOfRows={this.numbOfRows}
                    numbOfColumns={this.numbOfColumns}
                    onSquareClick={this.onSquareClick}
                    gridData={this.state.gridData}
                />
            </div>
        );
    }

    componentDidMount() {
        this.seed();
    }

}

ReactDOM.render(<Main />, document.getElementById('root'));
