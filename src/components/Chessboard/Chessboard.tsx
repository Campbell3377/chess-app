import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from "../../referee/Referee";

const hAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const vAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];

export interface Piece {
    image: string,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    enPassant?: boolean
}

export enum TeamType {
    WHITE,
    BLACK
}

export enum PieceType {
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    QUEEN,
    KING
}

// const pieces: Piece[] = [];

//useRef
// const chessboardRef = useRef(null);

const initialBoardState: Piece[] = [];

for (let i = 0; i < 2; i++) {
    const team = i === 0 ? TeamType.BLACK : TeamType.WHITE;
    const type = i === 0 ? "b" : "w";
    const y = i === 0 ? 7 : 0;

    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 0, y: y, type: PieceType.ROOK, team: team});
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 1, y: y, type: PieceType.KNIGHT, team: team});
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 2, y: y, type: PieceType.BISHOP, team: team});
    initialBoardState.push({image: `assets/images/queen_${type}.png`, x: 3, y: y, type: PieceType.QUEEN, team: team});
    initialBoardState.push({image: `assets/images/king_${type}.png`, x: 4, y: y, type: PieceType.KING, team: team});
    initialBoardState.push({image: `assets/images/bishop_${type}.png`, x: 5, y: y, type: PieceType.BISHOP, team: team});
    initialBoardState.push({image: `assets/images/knight_${type}.png`, x: 6, y: y, type: PieceType.KNIGHT, team: team});
    initialBoardState.push({image: `assets/images/rook_${type}.png`, x: 7, y: y, type: PieceType.ROOK, team: team});
}



for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: 'assets/images/pawn_b.png', x: i, y: 6, type: PieceType.PAWN, team: TeamType.BLACK});
}

for (let i = 0; i < 8; i++) {
    initialBoardState.push({image: 'assets/images/pawn_w.png', x: i, y: 1, type: PieceType.PAWN, team: TeamType.WHITE});
}


export default function Chessboard() {
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [activePiece, setActivePiece] = useState<HTMLDivElement | null>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState); // [state, function]
    const chessboardRef = useRef<HTMLDivElement>(null);
    const referee = new Referee();
    
    //let activePiece: HTMLDivElement | null = null;


    function grabPiece(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLDivElement;
        if (element.classList.contains('chess-piece') && chessboard) {
            element.style.position = 'absolute';
            // element.style.zIndex = '1000';
            // element.style.cursor = 'grabbing';
            let test = e.clientX - chessboardRef.current!.offsetLeft;
            const gridx = Math.floor((e.clientX - chessboardRef.current!.offsetLeft) / 100);
            const gridy = Math.abs(
                Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)
              );
            console.log(gridx, test);
            setGridX(gridx);
            setGridY(gridy);
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            setActivePiece(element);

            // document.addEventListener('mousemove', movePiece);
            // document.addEventListener('mouseup', dropPiece);
        }
    }

    function movePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 25;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 100;
            const minY = chessboard.offsetTop - 25;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 100;

            const x = e.clientX - 50;
            const y = e.clientY - 50;

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
            // else {
            //     activePiece.style.left = `${x}px`;
            //     activePiece.style.top = `${y}px`;
            // }

            // activePiece.style.left = (x < minX) ? `${minX}px` : `${x}px`;

            // activePiece.style.top = (y < minY) ? `${minY}px` : `${y}px`;
        }
    }

    function releasePiece(e: React.MouseEvent) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboardRef.current!.offsetLeft) / 100);
            const y = Math.abs(
                Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)
              );
            console.log(gridX, gridY);

            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);
            const attackedPiece = pieces.find(p => p.x === x && p.y === y);
            const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece!.type, currentPiece!.team, pieces);
            if (currentPiece) {
                const direction = currentPiece.team === TeamType.WHITE ? 1 : -1;
                const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece!.type, currentPiece!.team, pieces);
                const isEnPassant = referee.isEnPassant(gridX, gridY, x, y,currentPiece!.type, currentPiece!.team, pieces);
                if (isEnPassant) {
                    const newPieces = pieces.reduce((results, piece) => {
                        if (piece.x === gridX && piece.y === gridY) {
                            piece.enPassant = false;
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        }
                        else if (!(piece.x === x && piece.y === y-direction)) {
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
                        if (piece.x === gridX && piece.y === gridY) {
                            if(Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN){
                                piece.enPassant = true;
                            }
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        }
                        else if (!(piece.x === x && piece.y === y)) {
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
            let image = undefined;
            pieces.forEach(p => {
                if(p.x === i && p.y === j){ image = p.image; }
            });

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

