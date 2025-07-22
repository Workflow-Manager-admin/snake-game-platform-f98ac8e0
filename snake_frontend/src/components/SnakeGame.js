import React, { useState, useEffect, useCallback } from "react";

/**
 * SnakeGame component.
 * Handles the core gameplay interface and logic (UI-side only).
 * Props:
 *   - token: string (JWT token for authenticated API calls)
 *   - onScore: function (callback(score) when new score updated)
 * PUBLIC_INTERFACE
 */
function SnakeGame({ token, onScore }) {
  // Board settings
  const BOARD_SIZE = 20; // 20x20 grid
  const SPEED = 120; // ms per movement

  // State
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([12, 12]);
  const [direction, setDirection] = useState("right");
  const [nextDirection, setNextDirection] = useState("right");
  const [isAlive, setIsAlive] = useState(true);
  const [score, setScore] = useState(0);

  // API: Optionally, attach backend session for real-time gameplay later
  useEffect(() => {
    onScore(score);
  }, [score, onScore]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e) => {
      if (!isAlive) return;
      const key = e.key;
      let newDir = direction;
      if (["ArrowUp", "w", "W"].includes(key) && direction !== "down") {
        newDir = "up";
      } else if (["ArrowDown", "s", "S"].includes(key) && direction !== "up") {
        newDir = "down";
      } else if (["ArrowLeft", "a", "A"].includes(key) && direction !== "right") {
        newDir = "left";
      } else if (["ArrowRight", "d", "D"].includes(key) && direction !== "left") {
        newDir = "right";
      }
      setNextDirection(newDir);
    },
    [direction, isAlive]
  );

  useEffect(() => {
    if (!isAlive) return;
    window.addEventListener("keydown", handleKeyDown);
    const interval = setInterval(move, SPEED);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [snake, direction, isAlive, nextDirection, food, score]);

  // Move snake logic
  const move = () => {
    if (!isAlive) return;
    let [x, y] = snake[0];
    let dir = nextDirection;
    setDirection(dir);
    if (dir === "up") y -= 1;
    else if (dir === "down") y += 1;
    else if (dir === "left") x -= 1;
    else if (dir === "right") x += 1;

    let newHead = [x, y];
    // Check wall collision
    if (
      x < 0 ||
      y < 0 ||
      x >= BOARD_SIZE ||
      y >= BOARD_SIZE ||
      snake.slice(1).some(([sx, sy]) => sx === x && sy === y)
    ) {
      setIsAlive(false);
      return;
    }

    let newSnake;
    let ateFood = x === food[0] && y === food[1];
    if (ateFood) {
      newSnake = [newHead, ...snake];
      setScore((prev) => prev + 1);
      setFood(spawnFood(newSnake));
    } else {
      newSnake = [newHead, ...snake.slice(0, -1)];
    }
    setSnake(newSnake);
  };

  // Food spawning, avoid snake body
  const spawnFood = (snakePositions) => {
    while (true) {
      let fx = Math.floor(Math.random() * BOARD_SIZE);
      let fy = Math.floor(Math.random() * BOARD_SIZE);
      if (!snakePositions.some(([sx, sy]) => sx === fx && sy === fy)) {
        return [fx, fy];
      }
    }
  };

  // Reset game
  const handleRestart = () => {
    setSnake([[8, 8]]);
    setFood([12, 12]);
    setDirection("right");
    setNextDirection("right");
    setIsAlive(true);
    setScore(0);
  };

  // Drawing the board
  return (
    <div className="snake-game-panel">
      <div
        className="snake-board"
        style={{
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
        tabIndex={0}
      >
        {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
          const row = Math.floor(i / BOARD_SIZE);
          const col = i % BOARD_SIZE;
          const isSnake = snake.some(([sx, sy]) => sx === col && sy === row);
          const isHead = snake.length > 0 && snake[0][0] === col && snake[0][1] === row;
          const isFood = food[0] === col && food[1] === row;
          return (
            <div
              key={i}
              className={
                "snake-cell" +
                (isHead ? " snake-head" : "") +
                (isSnake && !isHead ? " snake-body" : "") +
                (isFood ? " snake-food" : "")
              }
            ></div>
          );
        })}
      </div>
      <div className="game-controls">
        <div className="score-display">
          <span>Score:&nbsp;</span>
          <strong>{score}</strong>
        </div>
        {!isAlive && (
          <div className="game-over-panel">
            <span className="game-over-text">Game Over</span>
            <button className="btn-restart" onClick={handleRestart}>
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SnakeGame;
