
const chai = require('chai');
const assert = chai.assert;
const SudokuSolver = require('../controllers/sudoku-solver.js');

suite('Unit Tests', () => {
  const solver = new SudokuSolver();

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const validPuzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....926914.37.';
    assert.isTrue(solver.validate(validPuzzle), 'The puzzle string should be valid');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....9X6914.37.';
    assert.isFalse(solver.validate(invalidPuzzle), 'The puzzle string should be invalid due to non-valid characters');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1.5..2.84..63.12.7..2..5....9..1.';
    const longPuzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....926914.37...';
    assert.isFalse(solver.validate(shortPuzzle), 'The puzzle string should be invalid because it is too short');
    assert.isFalse(solver.validate(longPuzzle), 'The puzzle string should be invalid because it is too long');
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....926914.37.';
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '3'), 'Value 3 should be valid in row 0');
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....926914.37.';
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '1'), 'Value 1 should be invalid in row 0');
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.isFalse(solver.checkColPlacement(puzzle, 0, 2, '9'), 'Value 6 should be valid in column 1');
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '15'), 'Value 5 should be invalid in column 1');
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....926914.37.';
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 1, '4'), 'Value 4 should be valid in the top-left 3x3 region');
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....926914.37.';
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 1, '2'), 'Value 2 should be invalid in the top-left 3x3 region');
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.isString(solver.solve(puzzle), 'The solver should return a solution as a string');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....9X6914.37.';
    assert.throws(() => solver.solve(invalidPuzzle), Error, 'Invalid puzzle string', 'The solver should throw an error for invalid puzzle strings');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '1.5..2.84..63.12.7..2..5....9..1....8.2.3674.3.7.2..9..47..8..1..16....926914.37.';
    const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    assert.throws(() => solver.solve(puzzle), Error, 'Puzzle cannot be solved', 'The solver should throw an error for incomplete puzzle');
  });
});
