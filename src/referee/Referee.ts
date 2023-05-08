import { PieceType, TeamType, Piece, Position, samePosition } from "../Constants";

export default class Referee {
    tileIsOccupied(p: Position, boardState: Piece[]): boolean {
        
        if (boardState.some((piece) => samePosition(piece.position, p))) {
            // console.log("Referee: tileIsOccupied - true")
            return true;
        }
        // console.log("Referee: tileIsOccupied - false")
        return false;
    }

    tileIsOccupiedByOpponent(p:Position, team: TeamType, boardState: Piece[]): boolean {
        
        if (boardState.some((piece) => piece.position.x === p.x && piece.position.y === p.y && piece.team !== team)) {
            console.log("Referee: tileIsOccupiedByOpponent - true")
            return true;
        }
        console.log("Referee: tileIsOccupiedByOpponent - false")
        return false;
    }

    isEnPassant(grabPos: Position, p: Position, type:PieceType, team: TeamType, boardState: Piece[]): boolean {
        const direction = team === TeamType.WHITE ? 1 : -1;
        const passantRow = team === TeamType.WHITE ? 5 : 2;
        const piece = boardState.find((piece) => piece.position.x === p.x && piece.position.y === p.y-direction && piece.enPassant);

        if (type === PieceType.PAWN) {
            if ((p.x-grabPos.x === 1 || p.x-grabPos.x === -1) && p.y-grabPos.y === direction && p.y === passantRow) {
                const piece = boardState.find((piece) => piece.position.x === p.x && piece.position.y === p.y-direction && piece.enPassant);
                if (piece) {
                    // console.log("Referee: isEnPassant - true")
                    return true;
                }
            }

        }
        // console.log("Referee: isEnPassant - false")
        return false;
    }

    isValidMove(grabPos: Position, p: Position, type: PieceType, team: TeamType, boardState: Piece[]): boolean{
        
        switch(type){
            case PieceType.PAWN:
                return this.isValidPawnMove(grabPos, p, team, boardState);
            case PieceType.ROOK:
                return this.isValidRookMove(grabPos, p, team, boardState);
            case PieceType.KNIGHT:
                return this.isValidKnightMove(grabPos, p, team, boardState);
            case PieceType.BISHOP:
                return this.isValidBishopMove(grabPos, p, team, boardState);
            case PieceType.QUEEN:
                return this.isValidQueenMove(grabPos, p, team, boardState);
            case PieceType.KING:
                return this.isValidKingMove(grabPos, p, team, boardState);
            default:
        }
        return true;
    }
    isValidKingMove(grabPos: Position, p: Position, team: TeamType, boardState: Piece[]) {
        // Check if king is moving horizontally
        if (grabPos.y === p.y) {
            // Check if king is moving to the right
            if (grabPos.x < p.x) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if king is moving to the left
            else if (grabPos.x > p.x) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
        }
        // Check if king is moving vertically
        else if (grabPos.x === p.x) {
            // Check if king is moving up
            if (grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.y - p.y)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x, y: grabPos.y + i}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if king is moving down
            else if (grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.y - p.y)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x, y: grabPos.y - i}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
        }
        // Check if king is moving diagonally
        else if (Math.abs(grabPos.x - p.x) === Math.abs(grabPos.y - p.y)) {
            // Check if king is moving up and to the right
            if (grabPos.x < p.x && grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y + i}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if king is moving up and to the left
            else if (grabPos.x > p.x && grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y + i}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if king is moving down and to the right
            else if (grabPos.x < p.x && grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y - i}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if king is moving down and to the left
            else if (grabPos.x > p.x && grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y - i}, boardState)) {
                        //check if king is capturing
                        console.log('checking if king is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
        }
        return false;
        // return true;
    }
    isValidQueenMove(grabPos: Position, p: Position, team: TeamType, boardState: Piece[]) {
        // Check if queen is moving horizontally
        if (grabPos.y === p.y) {
            // Check if queen is moving to the right
            if (grabPos.x < p.x) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if queen is moving to the left
            else if (grabPos.x > p.x) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            return true;
        }
        // Check if queen is moving vertically
        else if (grabPos.x === p.x) {
            // Check if queen is moving up
            if (grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.y - p.y)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x, y: grabPos.y + i}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if queen is moving down
            else if (grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.y - p.y)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x, y: grabPos.y - i}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            return true;
        }
        // Check if queen is moving diagonally
        else if (Math.abs(grabPos.x - p.x) === Math.abs(grabPos.y - p.y)) {
            // Check if queen is moving up and to the right
            // console.log('checking if queen is moving up and to the right');
            // console.log( grabPos, p);
            if (grabPos.x < p.x && grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    // console.log(p, {x: grabPos.x + i, y: grabPos.y + i})
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y + i}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                            
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if queen is moving up and to the left
            else if (grabPos.x > p.x && grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y + i}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                            
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
            }
            // Check if queen is moving down and to the right
            else if (grabPos.x < p.x && grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y - i}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                            
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if queen is moving down and to the left
            else if (grabPos.x > p.x && grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y - i}, boardState)) {
                        //check if queen is capturing
                        console.log('checking if queen is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                            
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            return true;
        }
        return false;
    }
    isValidBishopMove(grabPos: Position, p: Position, team: TeamType, boardState: Piece[]) {
        // Check if bishop is moving diagonally
        if (Math.abs(grabPos.x - p.x) === Math.abs(grabPos.y - p.y)) {
            // Check if bishop is moving up and to the right
            // console.log('checking if bishop is moving up and to the right');
            // console.log( grabPos, p);
            if (grabPos.x < p.x && grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    // console.log(p, {x: grabPos.x + i, y: grabPos.y + i})
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y + i}, boardState)) {
                        //check if bishop is capturing
                        
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y + i}, team, boardState)) {
                            // console.log('capturing')
                            return true;
                            
                        }
                        else {
                            // console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if bishop is moving up and to the left
            else if (grabPos.x > p.x && grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y + i}, boardState)) {
                        //check if bishop is capturing
                        console.log('checking if bishop is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                            
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
            }
            // Check if bishop is moving down and to the right
            else if (grabPos.x < p.x && grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y - i}, boardState)) {
                        //check if bishop is capturing
                        console.log('checking if bishop is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                            
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if bishop is moving down and to the left
            else if (grabPos.x > p.x && grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y - i}, boardState)) {
                        //check if bishop is capturing
                        console.log('checking if bishop is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                            
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            return true;
        }
        return false;
    }
    isValidKnightMove(grabPos: Position, p: Position, team: TeamType, boardState: Piece[]) {
        // Check if knight is moving in an L shape
        if ((Math.abs(grabPos.x - p.x) === 2 && Math.abs(grabPos.y - p.y) === 1) || (Math.abs(grabPos.x - p.x) === 1 && Math.abs(grabPos.y - p.y) === 2)) {
            // Check if tile is occupied by opponent
            if (this.tileIsOccupiedByOpponent(p, team, boardState)) {
                // console.log("Referee: isValidMove - true")
                return true;
            }
            // Check if tile is not occupied
            else if (!this.tileIsOccupied(p, boardState)) {
                // console.log("Referee: isValidMove - true")
                return true;
            }
        }
        return false;
    }
    isValidRookMove(grabPos: Position, p: Position, team: TeamType, boardState: Piece[]) {
        // Check if rook is moving horizontally
        if (grabPos.y === p.y) {
            // Check if rook is moving to the right
            if (grabPos.x < p.x) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x + i, y: grabPos.y}, boardState)) {
                        //check if rook is capturing
                        console.log('checking if rook is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x + i, y: grabPos.y}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if rook is moving to the left
            else if (grabPos.x > p.x) {
                for (let i = 1; i < Math.abs(grabPos.x - p.x)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x - i, y: grabPos.y}, boardState)) {
                        //check if rook is capturing
                        console.log('checking if rook is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x - i, y: grabPos.y}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            return true;
        }
        // Check if rook is moving vertically
        else if (grabPos.x === p.x) {
            // Check if rook is moving up
            if (grabPos.y < p.y) {
                for (let i = 1; i < Math.abs(grabPos.y - p.y)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x, y: grabPos.y + i}, boardState)) {
                        //check if rook is capturing
                        console.log('checking if rook is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x, y: grabPos.y + i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            // Check if rook is moving down
            else if (grabPos.y > p.y) {
                for (let i = 1; i < Math.abs(grabPos.y - p.y)+1; i++) {
                    if (this.tileIsOccupied({x: grabPos.x, y: grabPos.y - i}, boardState)) {
                        //check if rook is capturing
                        console.log('checking if rook is capturing')
                        if( this.tileIsOccupiedByOpponent({x: grabPos.x, y: grabPos.y - i}, team, boardState)) {
                            console.log('capturing')
                            return true;
                        }
                        else {
                            console.log('blocked')
                            return false;
                        }
                    }
                }
                // return true;
            }
            return true;
        }
        return false;
        // return true;
    }
    isValidPawnMove(grabPos: Position, p: Position, team: TeamType, boardState: Piece[]) {
        const startingRow = team === TeamType.WHITE ? 1 : 6;
        const direction = team === TeamType.WHITE ? 1 : -1;

        // Check if pawn is moving forward two spaces
        if (grabPos.x === p.x && grabPos.y === startingRow && p.y === grabPos.y + 2 * direction) {
            if (!this.tileIsOccupied(p, boardState) && !this.tileIsOccupied({x: p.x, y:(p.y-direction)}, boardState)) {
                return true;
            }
            else if ((grabPos.x === p.x-1 || grabPos.x === p.x+1) && p.y === grabPos.y + direction) {
                if (this.tileIsOccupied(p, boardState)) {
                    return true;
                }
            }
        } // Check if pawn is moving forward one space
        else if (grabPos.x === p.x && p.y === grabPos.y + direction) {
            if (!this.tileIsOccupied(p, boardState)) {
                return true;
            }
        }
        // Check if pawn is capturing
        else if ((grabPos.x === p.x-1 || grabPos.x === p.x+1) && p.y === grabPos.y + direction) {
            if (this.tileIsOccupiedByOpponent(p, team, boardState)) {
                console.log("Referee: isValidMove - true")
                return true;
            }
            // else if (this.isEnPassant(x, y, PieceType.PAWN, team, boardState)) {
            //     console.log("Referee: isValidMove - true")
            //     return true;
            // }
        }
        return false;
    }
}