import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from "../../referee/Referee";
import { VAXIS, HAXIS, GRID_SIZE, Piece, TeamType, PieceType, initialBoardState, Position, samePosition } from '../../Constants';

export default function Chessboard() {
    const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
    const [activePiece, setActivePiece] = useState<HTMLDivElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState); // [state, function]
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();

    function grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLDivElement;
        if (element.classList.contains('chess-piece') && chessboard) {
            element.style.position = 'absolute';
            const gridx = Math.floor((e.clientX - chessboardRef.current!.offsetLeft) / GRID_SIZE);
            const gridy = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition({x: gridx, y: gridy});
            const x = e.clientX - GRID_SIZE / 2;
            const y = e.clientY - GRID_SIZE / 2;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            setActivePiece(element);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - GRID_SIZE/4;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - GRID_SIZE;
            const minY = chessboard.offsetTop - GRID_SIZE/4;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - GRID_SIZE;

            const x = e.clientX - GRID_SIZE/2;
            const y = e.clientY - GRID_SIZE/2;

            if (x < minX) {
                activePiece.style.left = `${minX}px`;
                activePiece.style.top = `${y}px`;
            }
            else if (x > maxX) {
                activePiece.style.left = `${maxX}px`;
                activePiece.style.top = `${y}px`;
            }
            else {
                activePiece.style.left = `${x}px`;
                activePiece.style.top = `${y}px`;
            }

            if (y < minY) {
                activePiece.style.left = `${x}px`;
                activePiece.style.top = `${minY}px`;
            }
            else if (y > maxY) {
                activePiece.style.left = `${x}px`;
                activePiece.style.top = `${maxY}px`;
            }
        }
    }

    function releasePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboardRef.current!.offsetLeft) / GRID_SIZE);
            const y = Math.abs(
                Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE)
              );
            const currentPiece = pieces.find(p => samePosition(p.position, grabPosition));
            if (currentPiece) {
                const direction = currentPiece.team === TeamType.WHITE ? 1 : -1;
                const validMove = referee.isValidMove(grabPosition, {x: x, y: y}, currentPiece!.type, currentPiece!.team, pieces);
                const isEnPassant = referee.isEnPassant(grabPosition, {x: x, y: y}, currentPiece!.type, currentPiece!.team, pieces);
                if (isEnPassant) {
                    const newPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        }
                        else if (!(piece.position.x === x && piece.position.y === y-direction)) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    }, [] as Piece[]);
                    setPieces(newPieces);
                }
                else if (validMove) {
                    const newPieces = pieces.reduce((results, piece) => {
                        if (samePosition(piece.position, grabPosition)) {
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        }
                        else if (!(samePosition(piece.position, {x, y}))) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }
                        return results;
                    }, [] as Piece[]);

                    setPieces(newPieces);
                }
                else {
                    activePiece.style.removeProperty('position');
                    activePiece.style.removeProperty('left');
                    activePiece.style.removeProperty('top');
                }  
            }

            setActivePiece(null);
        }
    }

    let board = [];
    for (let j = 7; j >= 0; j--){
        for (let i = 0; i < 8; i++) {
            const num = j + i + 2;
            const piece = pieces.find(p => samePosition(p.position, {x: i, y: j}));
            let image = piece ? piece.image : undefined;
            board.push(<Tile key={`${j}${i}`} image={image} number={num}/>);
        }
    }

  return (
    <div 
        onMouseMove={e => movePiece(e)} 
        onMouseDown={e => grabPiece(e)} 
        onMouseUp ={e => releasePiece(e)} 
        id="chessboard"
        ref={chessboardRef}
        >
        {board}
    </div>
  )
}

