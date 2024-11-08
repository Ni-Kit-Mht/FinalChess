import { generateRookMoves } from './rookMoves'; // Adjust the path based on your file structure
import { generateBishopMoves } from './bishopMoves'; // Import the bishop moves function

export function generateQueenMoves(): Array<{ row: number, col: number }> {
    return [...generateRookMoves(), ...generateBishopMoves()];
}
