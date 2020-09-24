
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, } from 'react-bootstrap';

class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}

class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 14);
		var rowsArr = [];

		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;

				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}

class Buttons extends React.Component {

	handleSelect = (evt) => {
		this.props.gridSize(evt);
		console.log(evt)
	}
	handleDefault = (evt) => {
		evt = "2"
		this.props.gridSize(evt)
	}

	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
					  Clear
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
					  Fast
					</button>
					<button className="btn btn-default" onClick={this.props.seed}>
					  Seed
					</button>
					{/* <button className="btn btn-default" onClick={this.handleSelect} key="1">20x10</button>
					<button className="btn btn-default" onClick={this.handleSelect} eventKey="2">50x30</button>
					<button className="btn btn-default" onClick={this.handleSelect} eventKey="3">70x50</button>
					 */}
					 <button className="btn btn-default" onClick={this.handleSelect}>50x70</button>
					 <button className="btn btn-default" onClick={this.handleDefault}>30x50</button>
					</ButtonToolbar>
			</div>
			)
	}
}

class Main extends React.Component {
  constructor(){
    super();
    this.speed = 100;
    this.rows = 30
	this.cols = 50
	this.size = true
    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }

  selectBox = (row, col) => {
		let gridCopy = arrayClone(this.state.gridFull);
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({
			gridFull: gridCopy
		});
  }

  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++ ) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
          this.setState({
            gridFull: gridCopy
          });
        }
      }
    }
  }

  playButton = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.play, this.speed);
  }

  slow = () => {
    this.speed = 1000;
    this.playButton()
  }

  fast = () => {
    this.speed = 100;
    this.playButton()
  }

  pauseButton = () => {
    clearInterval(this.intervalId)
  }

  clear = () => {
    var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    clearInterval(this.intervalId)
    this.setState({
      gridFull: grid,
      generation: 0
    })
  }

  gridSize = (size) => {
	switch (size) {
		case "1":
			this.cols = 20;
			this.rows = 10;
			console.log("selected")
		break;
		case "2":
			this.cols = 50;
			this.rows = 30;
			
		break;
		default:
			this.cols = 70;
			this.rows = 50;
			
	}
	this.size = false
	this.clear();

}
defaultSize = (size) => {
	switch (size) {
		case "1":
			this.cols = 20;
			this.rows = 10;
			console.log("selected")
		break;
		case "2":
			this.cols = 50;
			this.rows = 30;
		break;
		default:
			this.cols = 50;
			this.rows = 30;
	}

	this.size = true
	this.clear();

}

  play = () => {
    let g = this.state.gridFull
    let g2 = arrayClone(this.state.gridFull)

    for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});
  }

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render () {
    return (
      <div>
		<div className="left">
        <h1>The Game Of Life</h1>
        <Buttons 
        playButton={this.playButton}
        pauseButton={this.pauseButton}
        slow={this.slow}
        fast={this.fast}
        clear={this.clear}
        seed={this.seed}
        gridSize={this.gridSize}
        />
        <Grid
        gridFull={this.state.gridFull}
        rows={this.rows}
        cols={this.cols}
        selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
		</div>
		<div className={"right" + (this.state.gridSize ? "top" : "")}>
			<div className="rulesContainer">
				<h2>Rules:</h2>
				<ul>
					<li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
					<li>Any live cell with two or three live neighbours lives on to the next generation.</li>
					<li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
					<li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
				</ul>
			</div>
		</div>
      </div>
    )
  }
}

function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(<Main />, document.getElementById('root'));

