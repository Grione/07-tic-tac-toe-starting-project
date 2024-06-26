import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";

const INITIAL_PLAYERS = {
  X: 'Player 1',
  O: 'Player 2'
}

const INITIAL_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

function setActivePlayer(gameTurns) {
  let activePlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    activePlayer = 'O';
  }

  return activePlayer;
}

function deriveWinner(board, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = board[combination[0].row][combination[0].column];
    const secondSquareSymbol = board[combination[1].row][combination[1].column];
    const thirdquareSymbol = board[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function deriveBoard(gameTurns) {
  let board = [...INITIAL_BOARD].map(array => [...array]);

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    board[row][col] = player;
  }

  return board;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const currentPlayer = setActivePlayer(gameTurns);
  const board = deriveBoard(gameTurns);
  const winner = deriveWinner(board, players);

  let isDraw = gameTurns.length == 9 && !winner;

  function handlerOnChange(rowIndex, colIndex) {
    setGameTurns((prevGameTurns) => {
      const activePlayer = setActivePlayer(prevGameTurns);

      const updatedGameTurns = [
        {
          square: { row: rowIndex, col: colIndex },
          player: activePlayer
        },
        ...prevGameTurns
      ]

      return updatedGameTurns;
    })
  }

  function handlerRestartGame() {
    setGameTurns([]);
  }

  function handleSetPlayers(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName
      }
    })
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName={INITIAL_PLAYERS['X']} isActive={currentPlayer === 'X'} symbol="X" onPlayerChange={handleSetPlayers} />
          <Player initialName={INITIAL_PLAYERS['O']} isActive={currentPlayer === 'O'} symbol="O" onPlayerChange={handleSetPlayers} />
        </ol>
        {(winner || isDraw) && <GameOver winner={winner} onRestart={handlerRestartGame} />}
        <GameBoard onChange={handlerOnChange} board={board} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
