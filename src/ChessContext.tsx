import React, { createContext, useEffect, useState, ReactNode } from 'react';

// Define the context type
interface ChessContextType {
    squareSize: number;
}

// Create the context
const ChessContext = createContext<ChessContextType | undefined>(undefined);

// Create a provider component
export const ChessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [squareSize, setSquareSize] = useState(Math.min(window.innerWidth, window.innerHeight) / 8);

    useEffect(() => {
        const handleResize = () => {
            setSquareSize(Math.min(window.innerWidth, window.innerHeight) / 8);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <ChessContext.Provider value={{ squareSize }}>
            {children}
        </ChessContext.Provider>
    );
};

// Create a custom hook to use the ChessContext
export const useChessContext = () => {
    const context = React.useContext(ChessContext);
    if (!context) {
        throw new Error('useChessContext must be used within a ChessProvider');
    }
    return context;
};
