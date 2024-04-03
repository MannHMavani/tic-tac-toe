import "./styles.css";
import "./App.css";
import Square from "./square";
import Login from "./Login";
import Historypage from "./Historypage";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export default function App() {
  const [gameState, setGameState] = useState(renderFrom);
  const [player, setPlayer] = useState("circle");
  const [finished, setFinished] = useState(false);
  const [finishedArray, setFinishedArray] = useState([]);
  const [play, setPlay] = useState(false);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [login, setLogin] = useState(false);
  const [historypage, setHistorypage] = useState(false);

  const checkWinner = () => {
    for (let row = 0; row < gameState.length; row++) {
      if (
        gameState[row][0] !== null &&
        gameState[row][0] === gameState[row][1] &&
        gameState[row][1] === gameState[row][2]
      ) {
        setFinishedArray([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0];
      }
    }
    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] !== null &&
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArray([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }
    if (
      gameState[0][0] !== null &&
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2]
    ) {
      setFinishedArray([0, 4, 8]);
      return gameState[0][0];
    }
    if (
      gameState[0][2] !== null &&
      gameState[0][2] === gameState[1][1] &&
      gameState[1][1] === gameState[2][0]
    ) {
      setFinishedArray([2, 4, 6]);
      return gameState[0][2];
    }
    const isDraw = gameState.flat().every((square) => {
      if (square === "circle" || square === "cross") {
        return true;
      }
    });
    if (isDraw) {
      return "draw";
    }
    return null;
  };
  useEffect(() => {
    const winner = checkWinner();
    setFinished(winner);
  }, [gameState]);
  useEffect(() => {
    const fetchPlayerNames = async () => {
      if (!play) return;
      if (player1 && player2) return;

      const { value: name1 } = await Swal.fire({
        title: "Enter name of Player 1",
        input: "text",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });

      const { value: name2 } = await Swal.fire({
        title: "Enter name of Player 2",
        input: "text",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });

      setPlayer1(name1 || ""); // Fallback to empty string if name1 is falsy (e.g., if cancelled)
      setPlayer2(name2 || ""); // Fallback to empty string if name2 is falsy
    };

    fetchPlayerNames();
  }, [play]);
  const changePlay = () => {
    setPlay(true);
  };

  const res = () => {
    Swal.fire({
      title: "Logout Successful",
      icon: "success",
    });
    setLogin(false);
  };

  const history = () => {
    setHistorypage(true);
  };

  if (historypage) {
    return (
      <div>
        <Historypage />
      </div>
    );
  }

  if (!login) {
    return <Login setLogin={setLogin} login={login} />;
  }

  if (!play) {
    return (
      <div className="main-div">
        <button className="playbutton" onClick={changePlay}>
          START
        </button>
        <button className="reset-btn" onClick={res}>
          Logout
        </button>
        <button className="reset-btn" onClick={history}>
          History
        </button>
      </div>
    );
  } // Depend on `play` to trigger this effect.

  const resetPlay = () => {
    setGameState([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    setFinished(false);
    setPlayer("circle");
    setFinishedArray([]);
    setPlay(false);
    setPlayer1("");
    setPlayer2("");
  };

  const rematchPlay = () => {
    setGameState([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    setFinished(false);
    setPlayer("circle");
    setFinishedArray([]);
    setPlay(false);
  };

  return (
    <div className="main-div">
      <div className="move-detection">
        <div className={`left ${player === "circle" ? "player-back1" : ""}`}>
          {player1}
        </div>
        <div className={`right ${player === "cross" ? "player-back2" : ""}`}>
          {player2}
        </div>
      </div>
      <div>
        <h1
          className={`water-background game-heading ${
            finished === "circle" ? "player-back1" : ""
          } ${finished === "cross" ? "player-back2" : ""}`}
        >
          Tic Tac Toe
        </h1>
        <div className="square-wrapper">
          {gameState.map((square, rowindex) => {
            return square.map((square, colindex) => {
              return (
                <Square
                  finishedArray={finishedArray}
                  finished={finished}
                  player={player}
                  setPlayer={setPlayer}
                  setGameState={setGameState}
                  id={rowindex * 3 + colindex}
                  key={rowindex * 3 + colindex}
                />
              );
            });
          })}
        </div>
      </div>
      {!finished && player === "circle" && (
        <h3 className="finished-state">{player1}'s Turn.</h3>
      )}
      {!finished && player === "cross" && (
        <h3 className="finished-state">{player2}'s Turn.</h3>
      )}
      {finished && finished !== "draw" && finished === "circle" && (
        <h3 className="finished-state">{player1} won the game</h3>
      )}
      {finished && finished !== "draw" && finished === "cross" && (
        <h3 className="finished-state">{player2} won the game</h3>
      )}
      {finished && finished === "draw" && (
        <h3 className="finished-state">It's a Draw.</h3>
      )}
      {finished && (
        <button className="reset-btn" onClick={resetPlay}>
          Restart
        </button>
      )}
      {finished && (
        <button className="reset-btn" onClick={rematchPlay}>
          Rematch
        </button>
      )}
    </div>
  );
}
