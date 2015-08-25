'use strict';

describe('Sudoku View Test Suite', function() {
    
    it('Tests buildSudokuBoard()', function() {
        let parent = document.createElement('body');
        buildSudokuBoard(parent);
        let table = parent.firstChild;
        expect(table.tagName).toEqual('TABLE');
        let tbody = table.firstChild;
        expect(tbody.tagName).toEqual('TBODY');
        let rows = tbody.children;
        expect(rows.length).toEqual(9);
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let cells = row.children;
            expect(cells.length).toEqual(9);
            for (let j = 0; j < cells.length; j++) {
                let cell = cells[j];
                expect(cell.id).toEqual('cell' + i + j);
                expect(typeof cell.onkeypress).toBe('function');
            }
        }
    });
    
});
