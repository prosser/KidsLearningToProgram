'use strict';

const e = React.createElement;

const getInitialState = () => {
  return {
    currentPlayer: 'X',
    // the grid stores all of the moves in the game.
    // null = no move in the square
    // 'X' = the X player has moved here
    // 'O' = the O player has moved here
    grid: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  };
};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toIndex() {
    return this.y * 3 + this.x;
  }

  toString() {
    return `(${this.x}, ${this.y})`
  }
}

class TicTacToeGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();
  }

  // check for 3 in a row in any valid direction
  getWins(player) {
    // first we need to get all the lines that could be completed by moving here.
    // for example, if an X was just placed in the top left, then there are 3
    // possible lines:
    //    X | X | X      X |   |      X |   |   
    //   -----------    -----------  -----------
    //      |   |          | X |      X |   |   
    //   -----------    -----------  -----------
    //      |   |          |   | X    X |   |   

    // we know that we have 3 in a row if matches.length >= 3
    const wins = [];

    // check the horizontal line for 3 of a kind
    for (let y = 0; y < 3; y++) {
      this.addWins(wins, [new Point(0, y), new Point(1, y), new Point(2, y)], player);
    }

    // check the vertical line for 3 of a kind
    for (let x = 0; x < 3; x++) {
      this.addWins(wins, [new Point(x, 0), new Point(x, 1), new Point(x, 2)], player);
    }

    // check the diagonals
    this.addWins(wins, [new Point(0, 0), new Point(1, 1), new Point(2, 2)], player);
    this.addWins(wins, [new Point(0, 2), new Point(1, 1), new Point(2, 0)], player);

    return wins;
  }

  /** adds the matching coordinates if all of them match the current player */
  addWins(wins, squares, player) {
    // console.log(`checking for player '${player}' at [ ${squares.join(', ')} ]`)
    let count = 0;
    for (let i = 0; i < squares.length; i++) {
      if (this.getSquare(squares[i]) === player) {
        count++;
      }
    }

    if (count === 3) {
      wins.push(squares);
    }
  }

  /** Gets the move, if any, in a square */
  getSquare(p) {
    // get the array index of the square in the grid.
    // since each row has 3 cells in it, multiply the Y coordinate by 3, then add X
    return this.state.grid[p.toIndex()];
  }

  async move(p) {
    if (this.getSquare(p) === null) {
      // nobody has moved here yet
      const newState = { ...this.state };
      newState.grid[p.toIndex()] = this.state.currentPlayer;
      newState.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';

      this.setState(newState);
    }
  }

  renderSquare(p, winsX, winsO) {
    let xWon = false;
    let oWon = false;
    for (let i = 0; i < winsX.length && !xWon; i++) {
      xWon = winsX[i].filter(a => a.x === p.x && a.y === p.y).length > 0;
    }
    for (let i = 0; i < winsO.length && !oWon; i++) {
      oWon = winsO[i].filter(a => a.x === p.x && a.y === p.y).length > 0;
    }

    const value = this.getSquare(p);
    const winner = this.getWinner(winsX, winsO);

    const onClick = winner ? null : () => this.move(p);
    return (<div onClick={onClick} className={`col board-square board-square-x${p.x}y${p.y} ${xWon ? 'winX' : ''} ${oWon ? 'winO' : ''}`}>{value}&nbsp;</div>);
  }

  getWinner(winsX, winsO) {
    const winner = winsX.length ? 'X' : winsO.length ? 'O' : null;
    return winner;
  }

  resetGame() {
    this.setState(getInitialState());
  }

  renderHeader(winsX, winsO) {
    const winner = this.getWinner(winsX, winsO);
    if (winner) {
      return (
        <div>
          <h1>{winner} won!</h1>
          <button className='btn btn-primary' onClick={() => this.resetGame()}>Play again</button>
        </div>
      );
    }
    else {
      return (<div>
        <h1>{this.state.currentPlayer}, it's your turn!</h1>
        <h2>Click any spot to make your mark</h2>
        <button className='btn btn-primary' onClick={() => this.resetGame()}>Play again</button>
      </div>);
    }
  }

  render() {
    const winsX = this.getWins('X');
    const winsO = this.getWins('O');

    return (
      <div className="board">
        {this.renderHeader(winsX, winsO)}
          <div className="row">
            {this.renderSquare(new Point(0, 0), winsX, winsO)}
            {this.renderSquare(new Point(1, 0), winsX, winsO)}
            {this.renderSquare(new Point(2, 0), winsX, winsO)}
          </div>
          <div className="row">
            {this.renderSquare(new Point(0, 1), winsX, winsO)}
            {this.renderSquare(new Point(1, 1), winsX, winsO)}
            {this.renderSquare(new Point(2, 1), winsX, winsO)}
          </div>
          <div className="row">
            {this.renderSquare(new Point(0, 2), winsX, winsO)}
            {this.renderSquare(new Point(1, 2), winsX, winsO)}
            {this.renderSquare(new Point(2, 2), winsX, winsO)}
          </div>
      </div>
    );
  }
}

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    return this.state.liked
      ? <button onClick={() => this.setState({ liked: false })}>Unlike</button>
      : <button onClick={() => this.setState({ liked: true })}>Like</button>;
  }
}

const domContainer = document.querySelector('#react-container');
const root = ReactDOM.createRoot(domContainer);
// root.render(e(LikeButton));
root.render(e(TicTacToeGame));
