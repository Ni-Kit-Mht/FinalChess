import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Board from './Board.tsx'
import { ChessProvider } from './ChessContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ChessProvider>
      <Board />
    </ChessProvider>
  </StrictMode>,
)
