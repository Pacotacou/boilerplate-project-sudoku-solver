class SudokuSolver {
  // Validate if the puzzle string is 81 characters long and contains only valid characters (1-9 or '.')
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    const validChars = /^[1-9\.]{81}$/;
    return validChars.test(puzzleString);
  }

  // Check if a value can be placed in the given row without violating Sudoku rules
  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this._toGrid(puzzleString);
    return !grid[row].includes(value);
  }

  // Check if a value can be placed in the given column without violating Sudoku rules
  checkColPlacement(puzzleString, row, column, value) {
    const grid = this._toGrid(puzzleString);
    for (let r = 0; r < 9; r++) {
      if (grid[r][column] === value) {
        return false;
      }
    }
    return true;
  }

  // Check if a value can be placed in the 3x3 region without violating Sudoku rules
  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this._toGrid(puzzleString);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] === value) {
          return false;
        }
      }
    }
    return true;
  }

  // Solve the puzzle using a backtracking algorithm
  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      throw new Error("Invalid puzzle string");
    }

    const grid = this._toGrid(puzzleString);

    if (this._solveGrid(grid)) {
      return this._toString(grid);
    } else {
      throw new Error("Puzzle cannot be solved");
    }
  }

  // Convert the puzzle string into a 2D array (grid)
  _toGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < 81; i += 9) {
      grid.push(puzzleString.slice(i, i + 9).split(""));
    }
    return grid;
  }

  // Convert the 2D array (grid) back into a puzzle string
  _toString(grid) {
    return grid.map(row => row.join("")).join("");
  }

  // Recursive backtracking algorithm to solve the grid
  _solveGrid(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === ".") {
          for (let value = 1; value <= 9; value++) {
            const charValue = value.toString();
            if (
              this.checkRowPlacement(this._toString(grid), row, col, charValue) &&
              this.checkColPlacement(this._toString(grid), row, col, charValue) &&
              this.checkRegionPlacement(this._toString(grid), row, col, charValue)
            ) {
              grid[row][col] = charValue;

              if (this._solveGrid(grid)) {
                return true;
              }

              grid[row][col] = "."; // Backtrack if solution is invalid
            }
          }
          return false; // Trigger backtracking
        }
      }
    }
    return true; // Puzzle solved
  }
}

module.exports = SudokuSolver;
