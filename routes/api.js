'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  // Route to check placement validity
  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (puzzle.length !== 81){
        return res.json({error: 'Expected puzzle to be 81 characters long'});
      }

      if (/[^1-9\.]/.test(puzzle)){
        return res.json({error:'Invalid characters in puzzle'});
      }

      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid puzzle string' });
      }

      if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      const row = coordinate[0].toUpperCase().charCodeAt(0) - 65; // Convert letter to row index (0-8)
      const col = parseInt(coordinate[1], 10) - 1; // Convert column to index (0-8)

      if (row < 0 || row > 8 || col < 0 || col > 8 || isNaN(col)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const currentCellValue = puzzle[row * 9 + col];
      if(currentCellValue === value){
        return res.json({valid:true});
      }

      const validRow = solver.checkRowPlacement(puzzle, row, col, value);
      const validCol = solver.checkColPlacement(puzzle, row, col, value);
      const validRegion = solver.checkRegionPlacement(puzzle, row, col, value);

      const conflicts = [];
      if(!validRow) conflicts.push('row');
      if(!validCol) conflicts.push('column');
      if(!validRegion) conflicts.push('region');

      if(conflicts.length > 0){
        return res.json({valid:false, conflict: conflicts});
      }

      return res.json({ valid: validRow && validCol && validRegion });
    });

  // Route to solve the puzzle
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if(/[^1-9\.]/.test(puzzle)){
        return res.json({error: 'Invalid characters in puzzle'});
      }

      if (!solver.validate(puzzle)) {
        return res.json({ error: 'Invalid puzzle string' });
      }

      try {
        const solution = solver.solve(puzzle);
        return res.json({ solution });
      } catch (error) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
    });
};
