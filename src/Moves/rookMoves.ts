interface Position {
    row: number;
    col: number;
}

export function generateRookMoves(): Array<Position> {
    const moves: Array<Position> = [];
    for (let i = -7; i <= 7; i++) {
        if (i !== 0) {
            moves.push({ row: i, col: 0 }, { row: 0, col: i });
        }
    }
    return moves;
}
