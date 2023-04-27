import React from 'react';
import './Chessboard.css';
import Tile from '../Tilte/Tile';

const hAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const vAxis = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default function Chessboard() {

    let board = [];
    for (let j = 7; j >= 0; j--){
        for (let i = 0; i < 8; i++) {
            const num = j + i + 2;
            board.push(<Tile number={num}/>);
        }
    }

  return (
    <div id="chessboard">
        {board}
    </div>
  )
}