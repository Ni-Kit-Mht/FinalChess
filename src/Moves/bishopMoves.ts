export function generateBishopMoves(): Array<{ row: number, col: number }> {
    const moves: Array<{ row: number, col: number }> = [];
    for (let i = -7; i <= 7; i++) {
        if (i !== 0) {
            moves.push({ row: i, col: i }, { row: i, col: -i });
        }
    }
    return moves;
}
