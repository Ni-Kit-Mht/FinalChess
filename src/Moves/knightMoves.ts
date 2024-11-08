interface Position {
    row: number;
    col: number;
}

export function generateKnightMoves(): Array<Position> {
    const possibleMoves = [
        { row: +2, col: +1 },
        { row: +2, col: -1 },
        { row: -2, col: +1 },
        { row: -2, col: -1 },
        { row: +1, col: +2 },
        { row: +1, col: -2 },
        { row: -1, col: +2 },
        { row: -1, col: -2 },
    ];

    // Filter out moves that are out of bounds
    return possibleMoves;
}
