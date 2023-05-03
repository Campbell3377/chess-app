import { PieceType, TeamType, Piece } from "../components/Chessboard/Chessboard";

export default class Referee {
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
        
        if (boardState.some((piece) => piece.x === x && piece.y === y)) {
            console.log("Referee: tileIsOccupied - true")
            return true;
        }
        console.log("Referee: tileIsOccupied - false")
        return false;
    }

    tileIsOccupiedByOpponent(x: number, y: number, team: TeamType, boardState: Piece[]): boolean {
        
        if (boardState.some((piece) => piece.x === x && piece.y === y && piece.team !== team)) {
            console.log("Referee: tileIsOccupiedByOpponent - true")
            return true;
        }
        console.log("Referee: tileIsOccupiedByOpponent - false")
        return false;
    }

    isEnPassant(px:number, py:number, x: number, y: number, type:PieceType, team: TeamType, boardState: Piece[]): boolean {
        const direction = team === TeamType.WHITE ? 1 : -1;
        const passantRow = team === TeamType.WHITE ? 5 : 2;
        const piece = boardState.find((piece) => piece.x === x && piece.y === y-direction && piece.enPassant);

        if (type === PieceType.PAWN) {
            if ((x-px === 1 || x-px === -1) && y-py === direction && y === passantRow) {
                const piece = boardState.find((piece) => piece.x === x && piece.y === y-direction && piece.enPassant);
                if (piece) {
                    console.log("Referee: isEnPassant - true")
                    return true;
                }
            }

        }
        console.log("Referee: isEnPassant - false")
        return false;
    }

    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]): boolean{
        
        switch(type){
            case PieceType.PAWN:
                return this.isValidPawnMove(px, py, x, y, team, boardState);
            case PieceType.ROOK:
                return this.isValidRookMove(px, py, x, y);
            case PieceType.KNIGHT:
                return this.isValidKnightMove(px, py, x, y);
            case PieceType.BISHOP:
                return this.isValidBishopMove(px, py, x, y);
            case PieceType.QUEEN:
                return this.isValidQueenMove(px, py, x, y);
            case PieceType.KING:
                return this.isValidKingMove(px, py, x, y);
            default:
        }
        return true;
    }
    isValidKingMove(px: number, py: number, x: number, y: number) {
        return true;
    }
    isValidQueenMove(px: number, py: number, x: number, y: number) {
        return true;
    }
    isValidBishopMove(px: number, py: number, x: number, y: number) {
        return true;
    }
    isValidKnightMove(px: number, py: number, x: number, y: number) {
        return true;
    }
    isValidRookMove(px: number, py: number, x: number, y: number) {
        return true;
    }
    isValidPawnMove(px: number, py: number, x: number, y: number, team: TeamType, boardState: Piece[]) {
        const startingRow = team === TeamType.WHITE ? 1 : 6;
        const direction = team === TeamType.WHITE ? 1 : -1;

        // Check if pawn is moving forward two spaces
        if (px === x && py === startingRow && y === py + 2 * direction) {
            if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y-direction, boardState)) {
                return true;
            }
            else if ((px === x-1 || px === x+1) && y === py + direction) {
                if (this.tileIsOccupied(x, y, boardState)) {
                    return true;
                }
            }
        } // Check if pawn is moving forward one space
        else if (px === x && y === py + direction) {
            if (!this.tileIsOccupied(x, y, boardState)) {
                return true;
            }
        }
        // Check if pawn is capturing
        else if ((px === x-1 || px === x+1) && y === py + direction) {
            if (this.tileIsOccupiedByOpponent(x, y, team, boardState)) {
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