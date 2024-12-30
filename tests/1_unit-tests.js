const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

suite('Unit Tests', () => {
  // Logic handles a valid puzzle string of 81 characters
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.validate(puzzle), 'The puzzle string should be valid');
    assert.equal(puzzle.length, 81, 'The puzzle string should have a length of 81');
  });

  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.36X4.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.validate(invalidPuzzle), 'The puzzle string should be invalid due to invalid characters');
    assert.match(invalidPuzzle, /[^1-9.]/, 'The puzzle string contains invalid characters');
  });

  // Logic handles a puzzle string that is not 81 characters in length
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1.';
    const longPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.123';
    assert.isFalse(solver.validate(shortPuzzle), 'The puzzle string should be invalid (too short)');
    assert.isFalse(solver.validate(longPuzzle), 'The puzzle string should be invalid (too long)');
  });

  // Logic handles a valid row placement
  test('Logic handles a valid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '3'), 'Value 3 should be valid in row 0');
  });

  // Logic handles an invalid row placement
  test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '5'), 'Value 5 should be invalid in row 0');
  });

  // Logic handles a valid column placement
  test('Logic handles a valid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkColPlacement(puzzle, 1, 2, '8'), 'Value 8 should be valid in column 3');
  });

  // Logic handles an invalid column placement
  test('Logic handles an invalid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkColPlacement(puzzle, 8, 6, '7'), 'Value 7 should be invalid in column 7');
  });

  // Logic handles a valid region (3x3 grid) placement
  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 1, '4'), 'Value 4 should be valid in the top-left 3x3 grid');
  });

  // Logic handles an invalid region (3x3 grid) placement
  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '2'), 'Value 2 should be invalid in the top-left 3x3 grid');
  });

  // Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(puzzle);
    assert.isString(solution, 'The solver should return a valid solution string');
    assert.equal(solution.length, 81, 'The solution string should have a length of 81');
  });

  // Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.36X4.3.7.2..9.47...8..1..16....926914.37.';
    assert.throws(() => solver.solve(invalidPuzzle), Error, 'Invalid puzzle string', 'The solver should throw an error for invalid puzzle strings');
  });

  // Solver returns the expected solution for an incomplete puzzle
  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    assert.equal(solver.solve(puzzle), solution, 'The solver should return the correct solution for the puzzle');
  });
});
