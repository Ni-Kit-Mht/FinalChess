export function generateKingMoves(): Array<{ row: number, col: number }> {
    return [
        { row: 1, col: 0 }, { row: -1, col: 0 },
        { row: 0, col: 1 }, { row: 0, col: -1 },
        { row: 1, col: 1 }, { row: 1, col: -1 },
        { row: -1, col: 1 }, { row: -1, col: -1 },
    ];
}
