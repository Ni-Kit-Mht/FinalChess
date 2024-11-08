import { useChessContext } from './ChessContext'; // Import the custom hook

// Importing chess piece images directly
import K from './chess-game/K.png';
import Q from './chess-game/Q.png';
import R from './chess-game/R.png';
import B from './chess-game/B.png';
import N from './chess-game/N.png';
import P from './chess-game/P.png';
import k from './chess-game/k1.png';
import q from './chess-game/q1.png';
import r from './chess-game/r1.png';
import b from './chess-game/b1.png';
import n from './chess-game/n1.png';
import p from './chess-game/M.png';

// Define the type for chess pieces
export type ChessPieceKeys = typeof K | typeof Q | typeof R | typeof B | typeof N | typeof P | typeof k | typeof q | typeof r | typeof b | typeof n | typeof p;

// Map chess piece keys to their image paths
const chessPieces: Record<string, ChessPieceKeys> = {
    // White Pieces
    'K1': K,  // White King
    'Q1': Q,  // White Queen
    'R1': R,  // White Rook
    'R2': R,  // White Rook
    'N1': N,  // White Knight
    'N2': N,  // White Knight
    'B1': B,  // White Bishop
    'B2': B,  // White Bishop
    'P1': P,  // White Pawn
    'P2': P,
    'P3': P,
    'P4': P,
    'P5': P,
    'P6': P,
    'P7': P,
    'P8': P,  // White Pawn

    // Black Pieces
    'k1': k,  // Black King
    'q1': q,  // Black Queen
    'r1': r,  // Black Rook
    'r2': r,  // Black Rook
    'n1': n,  // Black Knight
    'n2': n,  // Black Knight
    'b1': b,  // Black Bishop
    'b2': b,  // Black Bishop
    'p1': p,  // Black Pawn
    'p2': p,
    'p3': p,
    'p4': p,
    'p5': p,
    'p6': p,
    'p7': p,
    'p8': p,  // Black Pawn
};
// Define the props for the ChessPiece component
interface ChessPieceProps {
    piece: ChessPieceKeys;
    style?: React.CSSProperties;
}

// Create the ChessPiece component

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, style }) => {
    const imagePath = chessPieces[piece];
    const { squareSize } = useChessContext(); // Get the square size from context

    return (
        <img 
            src={imagePath} 
            alt={`${piece} piece`} 
            style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`,
                transition: 'transform 0.3s ease',  // Smooth transition animation
                ...style, // Apply additional style from props for movement
            }}
        />
    );
};

// Export the ChessPiece component for use in other parts of the application
export default ChessPiece;
