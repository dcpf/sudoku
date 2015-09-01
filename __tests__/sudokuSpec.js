'use strict';

if (typeof jest !== 'undefined') {
    jest.dontMock('../src/Sudoku.js');
}

var Sudoku = require('../src/Sudoku.js');

describe('Sudoku Test Suite', function() {


  /*
  * Create and verify a new puzzleArray
  */
  it('Tests generatePuzzleArray()', function() {
    let puzzleArray = Sudoku.generatePuzzleArray();
    expect(puzzleArray.length).toEqual(9);
    let nonZeroNums = 0;
    puzzleArray.forEach(function(row) {
      expect(row.length).toEqual(9);
      row.forEach(function(elem) {
        if (elem) {
          nonZeroNums++;
        }
      });
    });
    expect(nonZeroNums).toEqual(81);
  });


  /*
  * Create and verify the strippedPuzzleArray
  */
  it('Tests stripPuzzle()', function() {
    let puzzleArray = Sudoku.generatePuzzleArray();
    let strippedPuzzleArray = Sudoku.stripPuzzle(puzzleArray);
    expect(strippedPuzzleArray.length).toEqual(9);
    let nonZeroNums = 0;
    strippedPuzzleArray.forEach(function(row, i) {
      expect(row.length).toEqual(9);
      row.forEach(function(elem, j) {
        if (elem) {
          // If the element exists, increment nonZeroNums and expect the element to equal the element at the same position in the original puzzle array.
          nonZeroNums++;
          expect(elem).toEqual(puzzleArray[i][j]);
        }
      });
    });
    expect(nonZeroNums).toBeGreaterThan(0);
  });


  /*
  * Create a puzzleArray and strippedPuzzleArray, then call solvePuzzle() and verify the solution == the original puzzleArray.
  */
  it('Tests solvePuzzle()', function() {
    let puzzleArray = Sudoku.generatePuzzleArray();
    let strippedPuzzleArray = Sudoku.stripPuzzle(puzzleArray);
    let solvedPuzzleArray = Sudoku.solvePuzzle(Sudoku.clonePuzzleArray(strippedPuzzleArray));
    expect(Sudoku.equals(puzzleArray, solvedPuzzleArray)).toBe(true);
  });


  /*
  * Create a puzzleArray and strippedPuzzleArray, then call solvePuzzle() and validate the solution.
  */
  it('Tests validateSolution()', function() {
    let puzzleArray = Sudoku.generatePuzzleArray();
    let strippedPuzzleArray = Sudoku.stripPuzzle(puzzleArray);
    let solvedPuzzleArray = Sudoku.solvePuzzle(Sudoku.clonePuzzleArray(strippedPuzzleArray));
    expect(Sudoku.validateSolution(solvedPuzzleArray)).toBe(true);
  });


  /*
  * Call validateSolution() with an invalid solution.
  */
  it('Tests validateSolution() with an invalid solution', function() {
    let puzzleArray = Sudoku.generatePuzzleArray();
    puzzleArray[8][7] = 1;
    puzzleArray[8][8] = 1;
    expect(Sudoku.validateSolution(puzzleArray)).toBe(false);
  });


  /*
  * Tests clonePuzzleArray() and equals()
  */
  it('Tests clonePuzzleArray() and equals()', function() {
    let puzzleArray = Sudoku.generatePuzzleArray();
    let clonedPuzzleArray = Sudoku.clonePuzzleArray(puzzleArray);
    expect(Sudoku.equals(puzzleArray, clonedPuzzleArray)).toBe(true);
  });


  /*
  * Calls generateRandomArrayIndex() many, many times, and makes sure that the result is always between 0 and 9.
  */
  it('Tests generateRandomArrayIndex()', function() {
    for (let i = 0; i < 10000; i++) {
      // Toggle arrayLength between null and 9
      let arrayLength = (i % 2 === 0) ? 9 : null;
      let x = Sudoku.generateRandomArrayIndex(arrayLength);
      expect(x >= 0 && x < 9).toBe(true);
    }
  });


  /*
  * Tests getEmptyPuzzleArray()
  */
  it('Tests getEmptyPuzzleArray()', function() {
    let puzzleArray = Sudoku.getEmptyPuzzleArray();
    expect(puzzleArray.length).toEqual(9);
    puzzleArray.forEach(function(row) {
      expect(row.length).toEqual(9);
    });
  });


  /*
  * Tests isFull() and isEmpty() against a full puzzle array
  */
  it('Tests isFull() and isEmpty() against a full puzzle array', function() {
    let puzzleArray = Sudoku.generatePuzzleArray();
    expect(Sudoku.isFull(puzzleArray)).toBe(true);
    expect(Sudoku.isEmpty(puzzleArray)).toBe(false);
  });


  /*
  * Tests isFull() and isEmpty() against an empty puzzle array
  */
  it('Tests isFull() and isEmpty() against an empty puzzle array', function() {
    let puzzleArray = Sudoku.getEmptyPuzzleArray();
    expect(Sudoku.isFull(puzzleArray)).toBe(false);
    expect(Sudoku.isEmpty(puzzleArray)).toBe(true);
  });


  /*
  * Tests examineRow()
  */
  describe('examineRow() tests', function() {

    let puzzleArray = Sudoku.generatePuzzleArray();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {

        (function(i,j) {

          it('Tests examineRow() with coords: ' + i + ', ' + j, function() {

            // Call the function and get the resulting array
            let arr = Sudoku.examineRow(puzzleArray, j, i);

            let row = puzzleArray[i];
            let missingNum = row[j];
            // Length should == 8
            expect(arr.length).toEqual(8);
            // The returned array should not contain the number at puzzle[i][j]
            expect(arr.indexOf(missingNum)).toEqual(-1);
            // The returned array should contain all numbers except the number at puzzle[i][j]
            row.forEach(function(elem, index, array) {
              if (elem !== missingNum) {
                expect(arr.indexOf(elem)).not.toEqual(-1);
              }
            });

          });

        })(i,j);

      }
    }

  });


  /*
  * Tests examineColumn()
  */
  describe('examineColumn() tests', function() {

    let puzzleArray = Sudoku.generatePuzzleArray();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {

        (function(i,j) {

          it('Tests examineColumn() with coords: ' + i + ', ' + j, function() {

            // Call the function and get the resulting array
            let arr = Sudoku.examineColumn(puzzleArray, j, i);

            // Get the column array in question
            let col = [];
            for (let k = 0; k < 9; k++) {
              col.push(puzzleArray[k, j]);
            }

            let missingNum = col[i];
            // Length should == 8
            expect(arr.length).toEqual(8);
            // The returned array should not contain the number at puzzle[i][j]
            expect(arr.indexOf(missingNum)).toEqual(-1);
            // The returned array should contain all numbers except the number at puzzle[i][j]
            col.forEach(function(elem, index, array) {
              if (elem !== missingNum) {
                expect(arr.indexOf(elem)).toEqual(-1);
              }
            });

          });

        })(i,j);

      }
    }

  });


  /*
  * Tests examineQuadrant()
  */
  describe('examineQuadrant() tests', function() {

    let puzzleArray = Sudoku.generatePuzzleArray();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {

        (function(i,j) {

          it('Tests examineQuadrant() with coords: ' + i + ', ' + j, function() {

            // Call the function and get the resulting array
            let arr = Sudoku.examineQuadrant(puzzleArray, j, i);

            let missingNum = puzzleArray[i][j];
            // Length should == 8
            expect(arr.length).toEqual(8);
            // The returned array should not contain the number at puzzle[i][j]
            expect(arr.indexOf(missingNum)).toEqual(-1);

          });

        })(i,j);

      }
    }

  });


  let testStrippedPuzzle = [
    [0,0,0,0,9,0,0,0,1],
    [0,0,0,0,0,8,0,7,0],
    [0,7,0,4,1,2,0,0,0],
    [0,0,0,5,0,0,1,4,0],
    [0,0,6,0,0,0,0,3,5],
    [0,0,3,0,0,7,0,2,0],
    [0,0,2,6,0,0,0,8,0],
    [0,5,0,0,7,3,0,0,0],
    [3,0,8,0,0,5,4,0,0]
  ];

  // Provides data for testing getPossibleNumbers() using the strippedPuzzle array
  // Format: [x, y, numbersArray]
  let cellStates = [
    [0,0,[2,4,5,6,8]], [0,1,[2,3,4,6,8]], [0,2,[4,5]], [0,3,[3,7]], [0,4,[3,5,6,9]], [0,5,[6]], [0,6,[2,3,5,6,8]], [0,7,[5,6]], [0,8,[1,2,3,4,6,8]],
    [1,0,[1,2,4,5,6,9]], [1,1,[1,2,3,4,6,9]], [1,2,[1,4,5,9]], [1,3,[3]], [1,4,[3,5,6]], [1,5,[6,8]], [1,6,[2,3,5,6,9]], [1,7,[5,6,7,9]], [1,8,[2,3,4,6,9]],
    [2,0,[,6,8,9]], [2,1,[3,6,7,8,9]], [2,2,[5,9]], [2,3,[3,4]], [2,4,[1,3,5,6]], [2,5,[2,6]], [2,6,[3,5,6,8,9]], [2,7,[5,6,9]], [2,8,[3,6,8,9]],
    [3,0,[2,7,8,9]], [3,1,[2,8,9]], [3,2,[7,9]], [3,3,[2,3,5,8,9]], [3,4,[2,3,6,8]], [3,5,[6,9]], [3,6,[1,6,7,8,9]], [3,7,[4,6,9]], [3,8,[6,7,8,9]],
    [4,0,[1,2,4,7,8,9]], [4,1,[1,2,4,8,9]], [4,2,[1,4,6,7,9]], [4,3,[1,2,8,9]], [4,4,[2,4,8]], [4,5,[1,4,9]], [4,6,[7,8,9]], [4,7,[3,9]], [4,8,[5,7,8,9]],
    [5,0,[1,4,5,8,9]], [5,1,[1,4,8,9]], [5,2,[1,3,4,5,9]], [5,3,[1,8,9]], [5,4,[4,6,8]], [5,5,[1,4,6,7,9]], [5,6,[6,8,9]], [5,7,[2,6,9]], [5,8,[6,8,9]],
    [6,0,[1,4,7,9]], [6,1,[1,4,9]], [6,2,[1,2,4,7,9]], [6,3,[1,6,9]], [6,4,[4]], [6,5,[1,4,9]], [6,6,[3,5,7,9]], [6,7,[1,5,8,9]], [6,8,[3,7,9]],
    [7,0,[1,4,6,9]], [7,1,[1,4,5,6,9]], [7,2,[1,4,9]], [7,3,[1,2,8,9]], [7,4,[2,4,7,8]], [7,5,[1,3,4,9]], [7,6,[2,6,9]], [7,7,[1,6,9]], [7,8,[2,6,9]],
    [8,0,[1,3,6,7,9]],  [8,1,[1,6,9]],  [8,2,[1,7,8,9]],  [8,3,[1,2,9]],  [8,4,[2]],  [8,5,[1,5,9]],  [8,6,[2,4,6,7,9]],  [8,7,[1,6,9]],  [8,8,[2,6,7,9]]
  ];


  /*
  * Tests getPossibleNumbers()
  */
  describe('getPossibleNumbers() tests', function() {
    cellStates.forEach(function(elem, index, array) {
      it('Tests getPossibleNumbers() with ' + elem, function() {
        let y = elem[0];
        let x = elem[1];
        let possibleNums = elem[2];
        let arr = Sudoku.getPossibleNumbers(testStrippedPuzzle, x, y);
        expect(arr.length).toEqual(possibleNums.length);
        possibleNums.forEach(function(elem){
          expect(arr.indexOf(elem)).not.toEqual(-1);
        });
      });
    });
  });


  // Provides data for testing getQuadrantCoords().
  // Format: [x, y, expectedX, expectedY]
  let quadrantCoords = [
    [0,0,0,0], [0,1,0,0], [0,2,0,0], [1,0,0,0], [1,1,0,0], [1,2,0,0], [2,0,0,0], [2,1,0,0], [2,2,0,0],
    [3,0,0,3], [3,1,0,3], [3,2,0,3], [4,0,0,3], [4,1,0,3], [4,2,0,3], [5,0,0,3], [5,1,0,3], [5,2,0,3],
    [6,0,0,6], [6,1,0,6], [6,2,0,6], [7,0,0,6], [7,1,0,6], [7,2,0,6], [8,0,0,6], [8,1,0,6], [8,2,0,6],
    [0,3,3,0], [0,4,3,0], [0,5,3,0], [1,3,3,0], [1,4,3,0], [1,5,3,0], [2,3,3,0], [2,4,3,0], [2,5,3,0],
    [3,3,3,3], [3,4,3,3], [3,5,3,3], [4,3,3,3], [4,4,3,3], [4,5,3,3], [5,3,3,3], [5,4,3,3], [5,5,3,3],
    [6,3,3,6], [6,4,3,6], [6,5,3,6], [7,3,3,6], [7,4,3,6], [7,5,3,6], [8,3,3,6], [8,4,3,6], [8,5,3,6],
    [0,6,6,0], [0,7,6,0], [0,8,6,0], [1,6,6,0], [1,7,6,0], [1,8,6,0], [2,6,6,0], [2,7,6,0], [2,8,6,0],
    [3,6,6,3], [3,7,6,3], [3,8,6,3], [4,6,6,3], [4,7,6,3], [4,8,6,3], [5,6,6,3], [5,7,6,3], [5,8,6,3],
    [6,6,6,6], [6,7,6,6], [6,8,6,6], [7,6,6,6], [7,7,6,6], [7,8,6,6], [8,6,6,6], [8,7,6,6], [8,8,6,6]
  ];


  /*
  * Tests getQuadrantCoords()
  */
  describe('getQuadrantCoords() tests', function() {
    quadrantCoords.forEach(function(elem, index, array) {
      it('Tests getQuadrantCoords() with ' + elem, function() {
        let coords = Sudoku.getQuadrantCoords(elem[0], elem[1]);
        expect(coords[0]).toEqual(elem[2]);
        expect(coords[1]).toEqual(elem[3]);
      });
    });
  });

});
