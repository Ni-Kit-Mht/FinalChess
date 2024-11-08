import { useState } from 'react';
import { useChessContext } from './ChessContext';
import ChessPiece from './Pieces';
import { ChessPieceKeys } from './Pieces';

let capturedPieces: string[] = [];
type Move = {
    row: number;
    col: number;
};

declare const currentPlayerColor: "white" | "black";
declare const piece: string | null;
let possibleMovesGlobal: Move[] = [];

// Loop through rows and columns to generate all 64 squares
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        possibleMovesGlobal.push({ row, col });
    }
}

let boardLayout: Array<Array<string>> = [
    ['R1', 'N1', 'B1', 'Q1', 'K1', 'B2', 'N2', 'R2'], // White pieces
    ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'], // White pawns
    Array(8).fill(''), // Empty row
    Array(8).fill(''), // Empty row
    Array(8).fill(''), // Empty row
    Array(8).fill(''), // Empty row
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'], // Black pawns
    ['r1', 'n1', 'b1', 'q1', 'k1', 'b2', 'n2', 'r2'], // Black pieces
];
let currentPlayerColorGlobla: "white" | "black" = "white";

function Board() {
    const { squareSize } = useChessContext();
    const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
    const [highlightedSquares, setHighlightedSquares] = useState<Array<{ row: number, col: number }>>([]);
    const [currentPlayerColor, setCurrentPlayerColor] = useState<"white" | "black">("white");

    const isCurrentPlayerColor = (piece: string) => {
        const isWhite = piece === piece.toUpperCase();
        return isWhite ? currentPlayerColor === "white" : currentPlayerColor === "black";
    };
    let [pieceMoves, setPieceMoves] = useState<Record<string, Array<{ row: number, col: number }>>>({
        'R1': generateRookMovesIndividual(0, 0),
        'R2': generateRookMovesIndividual(0, 7),
        'N1': generateKnightMovesIndividual(0, 1),
        'N2': generateKnightMovesIndividual(0, 6),
        'B1': generateBishopMovesIndividual(0, 2),
        'B2': generateBishopMovesIndividual(0, 5),
        'Q1': generateQueenMovesIndividual(0, 3),
        'K1': generateKingMovesIndividual(0, 4),
        'P1': generatePawnMovesIndividual(1, 0, true),
        'P2': generatePawnMovesIndividual(1, 1, true),
        'P3': generatePawnMovesIndividual(1, 2, true),
        'P4': generatePawnMovesIndividual(1, 3, true),
        'P5': generatePawnMovesIndividual(1, 4, true),
        'P6': generatePawnMovesIndividual(1, 5, true),
        'P7': generatePawnMovesIndividual(1, 6, true),
        'P8': generatePawnMovesIndividual(1, 7, true),
      
        // Black Pieces (initial positions)
        'r1': generateRookMovesIndividual(7, 0),
        'r2': generateRookMovesIndividual(7, 7),
        'n1': generateKnightMovesIndividual(7, 1),
        'n2': generateKnightMovesIndividual(7, 6),
        'b1': generateBishopMovesIndividual(7, 2),
        'b2': generateBishopMovesIndividual(7, 5),
        'q1': generateQueenMovesIndividual(7, 3),
        'k1': generateKingMovesIndividual(7, 4),
        'p1': generatePawnMovesIndividual(6, 0, false),
        'p2': generatePawnMovesIndividual(6, 1, false),
        'p3': generatePawnMovesIndividual(6, 2, false),
        'p4': generatePawnMovesIndividual(6, 3, false),
        'p5': generatePawnMovesIndividual(6, 4, false),
        'p6': generatePawnMovesIndividual(6, 5, false),
        'p7': generatePawnMovesIndividual(6, 6, false),
        'p8': generatePawnMovesIndividual(6, 7, false),
    });
    
    const handleSquareClick = (rowIndex: number, colIndex: number) => {
        pieceMoves;
        // Loop through rows and columns to generate all 64 squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                possibleMovesGlobal.push({ row, col });
            }
        }
        const piece = boardLayout[rowIndex][colIndex];
        if (piece === piece.toUpperCase()) {
            currentPlayerColorGlobla = "white"
        } else {
            currentPlayerColorGlobla = "black"
        }
        updatePieceMoves(piece, rowIndex, colIndex);

        const clickedSquareValue = boardLayout[rowIndex][colIndex];        
        if (selectedSquare) {
            const selectedSquareValue = boardLayout[selectedSquare.row][selectedSquare.col];
            if (clickedSquareValue && isSameColor(selectedSquareValue, clickedSquareValue)) {
                console.log("Invalid move: Cannot move into a square occupied by your own piece.");
                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        possibleMovesGlobal.push({ row, col });
                    }
                }                
                setHighlightedSquares([]); // Clear highlights if user clicked on an invalid square
                setSelectedSquare(null);
                return;
            }
    
            if (clickedSquareValue) {
                if (isPiece(clickedSquareValue)) {
                    capturePiece(selectedSquare, { row: rowIndex, col: colIndex });
                    for (let row = 0; row < 8; row++) {
                        for (let col = 0; col < 8; col++) {
                            possibleMovesGlobal.push({ row, col });
                        }
                    }                    
                } else {
                    invalidMove();
                }
            } else {

                movePiece(selectedSquare, { row: rowIndex, col: colIndex });
    
                if ((selectedSquareValue === 'P' && rowIndex === 7) || (selectedSquareValue === 'p' && rowIndex === 0)) {
                    promotePawn(selectedSquare, { row: rowIndex, col: colIndex });
                }
    
                if (isEnPassant(selectedSquare, { row: rowIndex, col: colIndex })) {
                    captureEnPassant(selectedSquare, { row: rowIndex, col: colIndex });
                }
    
                // Toggle the player color after a successful move
                setCurrentPlayerColor(currentPlayerColor === "white" ? "black" : "white");
            }
            setHighlightedSquares([]);
            setSelectedSquare(null);
        } else {
            if (isPiece(clickedSquareValue)) {
                if (isCurrentPlayerColor(clickedSquareValue)) {
                    setSelectedSquare({ row: rowIndex, col: colIndex });
                    const piece = boardLayout[rowIndex][colIndex];
                    updatePieceMoves(piece, rowIndex, colIndex);            
                    if (possibleMovesGlobal) {
                        setHighlightedSquares(possibleMovesGlobal.map(move => ({ row: move.row, col: move.col })));
                    } else {
                        console.error(`No moves defined for piece: ${clickedSquareValue}`);
                    }
                } else {
                    console.log("Invalid selection: Not your turn.");
                    for (let row = 0; row < 8; row++) {
                        for (let col = 0; col < 8; col++) {
                            possibleMovesGlobal.push({ row, col });
                        }
                    }                    
                }
            }
        }
    };
        
    const isSameColor = (piece1: string, piece2: string) => {
        if (!piece1 || !piece2) return false; // If either piece is missing, they can't be the same color.
        const isWhite = (piece: string) => piece.toUpperCase() === piece;
        return isWhite(piece1) === isWhite(piece2); // True if both are either uppercase (white) or lowercase (black).
    };
    const isPiece = (value: string) => value !== '';

    const isEnPassant = (from: { row: number; col: number }, to: { row: number; col: number }) => {
        console.log(from, to)
        return false
    };

    const promotePawn = (from: { row: number; col: number }, to: { row: number; col: number }) => {
        console.log(`Pawn promoted from ${JSON.stringify(from)} to ${JSON.stringify(to)}`);
    };

    const captureEnPassant = (from: { row: number; col: number }, to: { row: number; col: number }) => {
        console.log(`En passant capture from ${JSON.stringify(from)} to ${JSON.stringify(to)}`);
    };
    const [movingPiece, setMovingPiece] = useState<{
        piece: string;
        from: { row: number; col: number };
        to: { row: number; col: number };
      } | null>(null);
    
    const movePiece = (from: { row: number; col: number }, to: { row: number; col: number }) => {
        const piece = boardLayout[from.row][from.col];
        setMovingPiece({ piece, from, to });
        setTimeout(() => {
            boardLayout[to.row][to.col] = piece;
            boardLayout[from.row][from.col] = '';
            setMovingPiece(null);
            console.log(boardLayout)
        }, 500);
    };
    
    
      
    const pieceStyle = (row: number, col: number) => {
        if (movingPiece && movingPiece.from.row === row && movingPiece.from.col === col) {
          const dx = (movingPiece.to.col - movingPiece.from.col) * squareSize; // Adjust based on your squareSize
          const dy = (movingPiece.to.row - movingPiece.from.row) * squareSize;
          return {
            transform: `translate(${dx}px, ${dy}px)`,
            transition: 'transform 0.5s ease', // Match this to your preferred animation speed
          };
        }
        return {};
      };
        
    const capturePiece = (from: { row: number; col: number }, to: { row: number; col: number }) => {
        console.log(`Capture piece from ${JSON.stringify(from)} at ${JSON.stringify(to)}`);
    
        // Check if the target square contains an opposing piece
        const targetPiece = boardLayout[to.row][to.col];
    
        if (targetPiece && !isCurrentPlayerColor(targetPiece)) {
            // Capture the opponent's piece
            console.log(`Captured piece: ${targetPiece}`);
    
            // You could store the captured piece here or perform other actions as needed
            capturedPieces.push(targetPiece);
    
            // Update the board by removing the captured piece
            boardLayout[to.row][to.col] = ''; // Empty the target square
            movePiece({row:from.row, col:from.col}, { row: to.row, col: to.col });
            setCurrentPlayerColor(currentPlayerColor === "white" ? "black" : "white")
        } else {
            console.log('No opponent piece to capture or invalid capture.');
        }
    };
    

    const invalidMove = () => {
        console.log('Invalid move!');
    };    


    const updatePieceMoves = (piece: string, newRow: number, newCol: number) => {
        console.log(`Updating moves for ${piece} to position (${newRow}, ${newCol})`);
    
        let newMoves: Array<{ row: number, col: number }> = [];
    
        switch (piece) {
            case 'R1':
            case 'R2':
                newMoves = generateRookMovesIndividual(newRow, newCol);
                break;
            case 'N1':
            case 'N2':
                newMoves = generateKnightMovesIndividual(newRow, newCol);
                break;
            case 'B1':
            case 'B2':
                newMoves = generateBishopMovesIndividual(newRow, newCol);
                break;
            case 'Q1':
                newMoves = generateQueenMovesIndividual(newRow, newCol);
                break;
            case 'K1':
                newMoves = generateKingMovesIndividual(newRow, newCol);
                break;
            case 'P1':
            case 'P2':
            case 'P3':
            case 'P4':
            case 'P5':
            case 'P6':
            case 'P7':
            case 'P8':
                newMoves = generatePawnMovesIndividual(newRow, newCol, true);
                break;
            case 'r1':
            case 'r2':
                newMoves = generateRookMovesIndividual(newRow, newCol);
                break;
            case 'n1':
            case 'n2':
                newMoves = generateKnightMovesIndividual(newRow, newCol);
                break;
            case 'b1':
            case 'b2':
                newMoves = generateBishopMovesIndividual(newRow, newCol);
                break;
            case 'q1':
                newMoves = generateQueenMovesIndividual(newRow, newCol);
                break;
            case 'k1':
                newMoves = generateKingMovesIndividual(newRow, newCol);
                break;
            case 'p1':
            case 'p2':
            case 'p3':
            case 'p4':
            case 'p5':
            case 'p6':
            case 'p7':
            case 'p8':
                newMoves = generatePawnMovesIndividual(newRow, newCol, false);
                break;
            default:
                console.log("Invalid piece:", piece); // Log invalid piece case
                return; // No valid piece found
        }
    
        // Log the new moves for the piece
        console.log(`New valid moves for ${piece}:`, newMoves);
        possibleMovesGlobal = newMoves;
        // Update the state with the new moves for the piece
        setPieceMoves(prevMoves => ({
            ...prevMoves,
            [piece]: newMoves
        }));
    };


    // Function to handle when the user starts dragging a piece
    const handleSquareDrag = (event: React.DragEvent, rowIndex: number, colIndex: number) => {
        const piece = boardLayout[rowIndex][colIndex]; // Get the piece being dragged
    
        // Store the dragged piece in the event data
        event.dataTransfer.setData('piece', piece);
        event.dataTransfer.setData('fromRow', rowIndex.toString());
        event.dataTransfer.setData('fromCol', colIndex.toString());
    
        // Optional: Set up drag visual feedback (ghost image or styling)
        event.dataTransfer.effectAllowed = 'move'; // Define the allowed effect (move)
    
        // Set selected square and calculate possible moves for the piece
        setSelectedSquare({ row: rowIndex, col: colIndex });
        updatePieceMoves(piece, rowIndex, colIndex); // Update `possibleMovesGlobal` based on the piece's possible moves
    
        // Highlight possible moves on the board
        if (possibleMovesGlobal) {
            setHighlightedSquares(possibleMovesGlobal.map(move => ({ row: move.row, col: move.col })));
        } else {
            console.error(`No moves defined for piece: ${piece}`);
        }
    
        console.log(`Started dragging piece: ${piece} from (${rowIndex}, ${colIndex})`);
    };
    
    const handleSquareDrop = (event: React.DragEvent, rowIndex: number, colIndex: number) => {
        event.preventDefault(); // Allow the drop event
    
        // Retrieve the dragged piece and its original position
        const draggedPiece = event.dataTransfer.getData('piece');
        const fromRow = parseInt(event.dataTransfer.getData('fromRow'), 10);
        const fromCol = parseInt(event.dataTransfer.getData('fromCol'), 10);
    
        if (!draggedPiece || isNaN(fromRow) || isNaN(fromCol)) {
            console.error("Drag data missing or incorrect");
            return;
        }
    
        // Verify if the target square is valid
        if (possibleMovesGlobal.some(move => move.row === rowIndex && move.col === colIndex)) {
            const targetSquareValue = boardLayout[rowIndex][colIndex];
            const selectedSquareValue = boardLayout[fromRow][fromCol];
    
            // Prevent capturing own piece
            if (targetSquareValue && isSameColor(selectedSquareValue, targetSquareValue)) {
                console.log("Invalid move: Cannot capture your own piece.");
                return;
            }
    
            // Handle capture if there’s an enemy piece
            if (targetSquareValue && isPiece(targetSquareValue)) {
                capturePiece({ row: fromRow, col: fromCol }, { row: rowIndex, col: colIndex });
            }
    
            // Move the piece
            movePiece({ row: fromRow, col: fromCol }, { row: rowIndex, col: colIndex });
    
            // Special rules for pawn promotion and en passant
            if ((selectedSquareValue === 'P' && rowIndex === 7) || (selectedSquareValue === 'p' && rowIndex === 0)) {
                promotePawn({ row: fromRow, col: fromCol }, { row: rowIndex, col: colIndex });
            }
            if (isEnPassant({ row: fromRow, col: fromCol }, { row: rowIndex, col: colIndex })) {
                captureEnPassant({ row: fromRow, col: fromCol }, { row: rowIndex, col: colIndex });
            }
    
            // Toggle player color after a valid move
            setCurrentPlayerColor(currentPlayerColor === "white" ? "black" : "white");
            currentPlayerColorGlobla = currentPlayerColorGlobla === "white" ? "black" : "white";
    
            setHighlightedSquares([]);
            setSelectedSquare(null);
            console.log(`Dropped piece: ${draggedPiece} to (${rowIndex}, ${colIndex})`);
        } else {
            console.log('Invalid drop target');
        }
    };    
    
    
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridTemplateRows: 'repeat(8, 1fr)',
                width: '100vmin',
                height: '100vmin',
                maxWidth: '100%',
                maxHeight: '100%',
            }}
        >
            {boardLayout.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                    const isSelectedSquare = selectedSquare && selectedSquare.row === rowIndex && selectedSquare.col === colIndex;
                    const isHighlighted = highlightedSquares.some(move => move.row === rowIndex && move.col === colIndex);

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            draggable={true} // Make the square draggable
                            onDragStart={(event) => {
                                // Begin drag only if the piece belongs to the current player and the square has a piece
                                if (isCurrentPlayerColor(boardLayout[rowIndex][colIndex])) {
                                    handleSquareDrag(event, rowIndex, colIndex);
                                }
                            }}
                            onDragOver={(event) => {
                                // Allow drop only if the target square is within the list of possible moves
                                if (possibleMovesGlobal.some(move => move.row === rowIndex && move.col === colIndex)) {
                                    event.preventDefault();
                                }
                            }}
                            onDrop={(event) => {
                                // Only proceed with drop if the target is a valid move
                                if (possibleMovesGlobal.some(move => move.row === rowIndex && move.col === colIndex)) {
                                    handleSquareDrop(event, rowIndex, colIndex);
                                }
                            }}
                            onClick={() => {
                                // Only handle click if the square is in the list of possible moves
                                if (possibleMovesGlobal.some(move => move.row === rowIndex && move.col === colIndex)) {
                                    handleSquareClick(rowIndex, colIndex);
                                }
                            }}                            
                            style={{
                                boxShadow: isHighlighted
                                    ? 'inset 0 0 0 3px rgba(255, 255, 255, 1)' // Yellow inset shadow for highlighted squares
                                    : isSelectedSquare
                                    ? 'inset 0 0 0 3px rgba(0, 255, 255, 1)' // Aqua inset shadow for selected squares
                                    : 'none',
                                backgroundColor: isHighlighted ? 'rgba(214, 130, 10, 0.7)' : isSelectedSquare ? 'rgba(255, 255, 0, 0.4)' : (rowIndex + colIndex) % 2 === 0 ? '#f0d9b5' : '#b58863',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: `${squareSize}px`,
                                height: `${squareSize}px`,
                                transition: 'transform 0.5s ease',  // Smooth transition animation
                            }}
                        >
                            {piece && 
                                <ChessPiece
                                    piece={piece as ChessPieceKeys}
                                    style={pieceStyle(rowIndex, colIndex)} // Pass style for movement
                                />
                            }
                        </div>
                    );
                })
            )}
        </div>
    );
}

function isValidMove(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isOccupied(row: number, col: number): boolean {
    return boardLayout[row][col] !== '';
}
function isEnemyPiece(row: number, col: number): boolean {
    const piece = boardLayout[row][col];

    if (!piece) return false; // No piece at the position, so not an enemy

    // Check if piece belongs to the enemy based on its case and current player color
    if (currentPlayerColorGlobla === "white") {
        return piece === piece.toLowerCase(); // Enemy piece if lowercase (black)
    } else {
        return piece === piece.toUpperCase(); // Enemy piece if uppercase (white)
    }
}

function generateRookMovesIndividual(row: number, col: number): Array<{ row: number, col: number }> {
    const moves: Array<{ row: number, col: number }> = [];
    const directions = [
        { row: 1, col: 0 },   // down
        { row: -1, col: 0 },  // up
        { row: 0, col: 1 },   // right
        { row: 0, col: -1 },  // left
    ];
    moves.push( {row:row,col:col})
    for (let direction of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = row + direction.row * i;
            const newCol = col + direction.col * i;

            if (isValidMove(newRow, newCol)) {
                if (isOccupied(newRow, newCol)) {
                    // Check if occupied by an enemy piece
                    if (isEnemyPiece(newRow, newCol)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break; // Stop after encountering any piece
                } else {
                    // Add empty squares as valid moves
                    moves.push({ row: newRow, col: newCol });
                }
            } else {
                break; // Stop if out of bounds
            }
        }
    }

    return moves;
}


function generateKnightMovesIndividual(row: number, col: number): Array<{ row: number, col: number }> {
    const moves: Array<{ row: number, col: number }> = [];
    const knightMoves = [
        { row: 2, col: 1 },
        { row: 2, col: -1 },
        { row: -2, col: 1 },
        { row: -2, col: -1 },
        { row: 1, col: 2 },
        { row: 1, col: -2 },
        { row: -1, col: 2 },
        { row: -1, col: -2 },
    ];
    moves.push( {row:row,col:col})

    for (let move of knightMoves) {
        const newRow = row + move.row;
        const newCol = col + move.col;

        if (isValidMove(newRow, newCol)) {
            if (isOccupied(newRow, newCol)) {
                // If occupied, add the move only if it's an enemy piece
                if (isEnemyPiece(newRow, newCol)) {
                    moves.push({ row: newRow, col: newCol });
                }
            } else {
                // If not occupied, add the empty square as a valid move
                moves.push({ row: newRow, col: newCol });
            }
        }
    }

    return moves;
}


function generateBishopMovesIndividual(row: number, col: number): Array<{ row: number, col: number }> {
    const moves: Array<{ row: number, col: number }> = [];
    const directions = [
        { row: 1, col: 1 },   // down-right
        { row: -1, col: 1 },  // up-right
        { row: 1, col: -1 },  // down-left
        { row: -1, col: -1 }, // up-left
    ];
    moves.push( {row:row,col:col})

    for (let direction of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = row + direction.row * i;
            const newCol = col + direction.col * i;
            if (isValidMove(newRow, newCol)) {
                if (isOccupied(newRow, newCol)) {
                    // Check if occupied by an enemy piece
                    if (isEnemyPiece(newRow, newCol)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break; // Stop after encountering any piece
                } else {
                    // Add empty squares as valid moves
                    moves.push({ row: newRow, col: newCol });
                }
            } else {
                break; // Stop if out of bounds
            }
        }
    }

    return moves;
}

function generateQueenMovesIndividual(row: number, col: number): Array<{ row: number, col: number }> {
    const moves: Array<{ row: number, col: number }> = [];
    const rookDirections = [
        { row: 1, col: 0 },   // down
        { row: -1, col: 0 },  // up
        { row: 0, col: 1 },   // right
        { row: 0, col: -1 },  // left
    ];
    const bishopDirections = [
        { row: 1, col: 1 },   // down-right
        { row: -1, col: 1 },  // up-right
        { row: 1, col: -1 },  // down-left
        { row: -1, col: -1 }, // up-left
    ];
    moves.push( {row:row,col:col})

    // Combine rook and bishop directions
    const directions = [...rookDirections, ...bishopDirections];

    for (let direction of directions) {
        for (let i = 1; i < 8; i++) {
            const newRow = row + direction.row * i;
            const newCol = col + direction.col * i;
            if (isValidMove(newRow, newCol)) {
                if (isOccupied(newRow, newCol)) {
                    // Check if occupied by an enemy piece
                    if (isEnemyPiece(newRow, newCol)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break; // Stop after encountering any piece
                } else {
                    // Add empty squares as valid moves
                    moves.push({ row: newRow, col: newCol });
                }
            } else {
                break; // Stop if out of bounds
            }
        }
    }

    return moves;
}

function generateKingMovesIndividual(row: number, col: number): Array<{ row: number, col: number }> {
    const moves: Array<{ row: number, col: number }> = [];
    const kingMoves = [
        { row: 1, col: 0 },
        { row: -1, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: -1 },
        { row: 1, col: 1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: -1, col: -1 },
    ];
    moves.push( {row:row,col:col})

    for (let direction of kingMoves) {
        const newRow = row + direction.row;
        const newCol = col + direction.col;

        // Check if the new position is within bounds
        if (isValidMove(newRow, newCol)) {
            if (isOccupied(newRow, newCol)) {
                // Check if occupied by an enemy piece
                if (isEnemyPiece(newRow, newCol)) {
                    moves.push({ row: newRow, col: newCol });
                }
                // No `break` here since we want to check all directions
            } else {
                // Add empty squares as valid moves
                moves.push({ row: newRow, col: newCol });
            }
        }
    }

    return moves;
}

function generatePawnMovesIndividual(row: number, col: number, isWhite: boolean): Array<{ row: number, col: number }> {
    const moves: Array<{ row: number, col: number }> = [];
    const direction = isWhite ? 1 : -1;

    // Standard forward move (1 step)
    const forwardRow = row + direction;
    if (isValidMove(forwardRow, col) && !isOccupied(forwardRow, col)) {
        moves.push({ row: forwardRow, col });
    }

    // Double move (2 steps) only from the starting position, and both squares must be empty
    if ((isWhite && row === 1) || (!isWhite && row === 6)) {
        const doubleForwardRow = row + 2 * direction;
        if (isValidMove(doubleForwardRow, col) && !isOccupied(doubleForwardRow, col) && !isOccupied(forwardRow, col)) {
            moves.push({ row: doubleForwardRow, col });
        }
    }

    // Capture moves (diagonal) only if there's an enemy piece
    const captureMoves = [
        { row: forwardRow, col: col - 1 },
        { row: forwardRow, col: col + 1 }
    ];
    moves.push( {row:row,col:col})

    for (let move of captureMoves) {
        if (isValidMove(move.row, move.col) && isOccupied(move.row, move.col) && isEnemyPiece(move.row, move.col)) {
            moves.push(move);
        }
    }
    return moves;
}

export default Board;
