export function generatePawnMoves(isWhite: boolean): Array<{ row: number, col: number }> {
    const direction = isWhite ? 1 : -1;
    const startingRow = isWhite ? 1 : 6; // 1 for white, 6 for black
    const moves = [
        { row: direction, col: 0 },  // Move forward
        { row: direction, col: -1 }, // Capture left
        { row: direction, col: 1 },  // Capture right
    ];

    // Hardcoded logic for current white pawn row
    if (isWhite && startingRow === 1) {
        moves.unshift({ row: direction * 2, col: 0 }); // Two squares forward for white
    } else if (!isWhite && startingRow === 6) {
        moves.unshift({ row: direction * 2, col: 0 }); // Two squares forward for black
    }

    return moves;
}
