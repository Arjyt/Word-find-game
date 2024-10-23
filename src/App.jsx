import React, { useState, useEffect } from 'react';
import './App.css';
import Confetti from 'react-confetti'



function App() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState([]);
  const [foundCell, setFoundCell] = useState([]);
  const [game, setGame] = useState(0);
  const [activeCategory, setActiveCategory] = useState("fruits");


  const countries= ["GERMANY", "FRANCE", "ITALY", "AUSTRALIA", "JAPAN", "INDIA", "CHINA"];
  const fruits= ["APPLE", ]
  const animals= ["TIGER", "LION", "ELEPHANT", "RABBIT", "KANGAROO", "MONKEY"]
  const birds= ["CROW", "PEACOCK", "EAGLE", "DUCK", "PIGEON", "OSTRICH"]
  
  const [words,setwords]=useState(fruits)



  useEffect(() => {
    createGrid(13, 13);
  }, [game,words]);

  const createGrid = (row, col) => {
    const newGrid = Array.from({ length: row }, () => Array(col).fill(''));
    words.forEach(word => {
      placeIntoGrid(word, newGrid);
    });
    fillEmptyCells(newGrid);
    setGrid(newGrid);
  };

  const placeIntoGrid = (word, grid) => {
    const directions = [
      { x: 0, y: 1 }, // vertical
      { x: 1, y: 0 }, // horizontal
      { x: 1, y: 1 }, // diagonal down-right
      { x: -1, y: 1 } // diagonal up-right
    ];
    let placed = false;

    while (!placed) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * grid.length);
      const startY = Math.floor(Math.random() * grid[0].length);

      if (canPlaceWord(word, startX, startY, dir, grid)) {
        for (let i = 0; i < word.length; i++) {
          grid[startX + i * dir.x][startY + i * dir.y] = word[i];
        }
        placed = true;
      }
    }
  };

  const canPlaceWord = (word, startX, startY, dir, grid) => {
    for (let i = 0; i < word.length; i++) {
      const x = startX + i * dir.x;
      const y = startY + i * dir.y;
      if (
        x < 0 || x >= grid.length || 
        y < 0 || y >= grid[0].length || 
        grid[x][y] !== ''
      ) {
        return false;
      }
    }
    return true;
  };

  const fillEmptyCells = (grid) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
  };

  const handleClick = (row, col) => {
    const cellIndex = selected.findIndex(cell => cell.row === row && cell.col === col);

    if (cellIndex !== -1) {
      const newSelected = [...selected];
      newSelected.splice(cellIndex, 1);
      setSelected(newSelected);
    } else {
      const newSelected = [...selected, { row, col }];
      setSelected(newSelected);

      const selectedWord = newSelected.map(({ row, col }) => grid[row][col]).join('');

      if (words.includes(selectedWord)) {
        setFound(prev => [...prev, selectedWord]);

        const newFoundWordCells = newSelected.map(({ row, col }) => ({ row, col }));
        setFoundCell(prev => [...prev, ...newFoundWordCells]);

        setSelected([]);
      }
    }
  };

  const isSelected = (row, col) => 
    selected.some(cell => cell.row === row && cell.col === col);

  const isFound = (row, col) => 
    foundCell.some(cell => cell.row === row && cell.col === col);

  const restart = () => {
    setGame(game + 1);
    setFound([]);
    setFoundCell([]);
    setSelected([]);
  };

  return (
    <div className="App">
      <h1>Word Search Game</h1>
      <div className="game-container">
        <div className="grid">
          {grid.map((row, rowIndex) =>
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${isSelected(rowIndex, colIndex) ? 'selected' : ''} ${isFound(rowIndex, colIndex) ? 'found' : ''}`}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {letter}
              </div>
            ))
          )}
        </div>
        <div className="words-list">
        <button onClick={() => { setwords(countries); setActiveCategory("countries"); }} className={activeCategory === "countries" ? "active" : ""}>Countries</button>
          <button onClick={() => { setwords(animals); setActiveCategory("animals"); }} className={activeCategory === "animals" ? "active" : ""}>Animals</button>
          <button onClick={() => { setwords(fruits); setActiveCategory("fruits"); }} className={activeCategory === "fruits" ? "active" : ""}>Fruits</button>
          <button onClick={() => { setwords(birds); setActiveCategory("birds"); }} className={activeCategory === "birds" ? "active" : ""}>Birds</button>
          <h2>Words to Find:</h2>
          <ul>
            {words.map(word => (
              <li key={word} className={found.includes(word) ? 'found' : ''}>
                {word}
              </li>
            ))}
          </ul>
          {words.length === found.length && (
        <div className="win-container">
             <Confetti
             width="1500px"
            height="1000px"
             />
          <h2 className="win-message">You Win!</h2>
          <button className='btn' onClick={restart}>Restart</button>
        </div>
      )}
        </div>
    
      </div>
      <p style={{padding:"20px"}}>© Arjun</p>
    </div>
  );
}

export default App;
