import { PieceType, TeamType } from "../components/Chessboard/Chessboard";

export default class Referee {
    isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType){
        console.log("Referee: isValidMove")
        switch(type){
            case PieceType.PAWN:
                return this.isValidPawnMove(px, py, x, y, team);
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
    isValidPawnMove(px: number, py: number, x: number, y: number, team: TeamType) {
        if (team === TeamType.WHITE) {
            if (py === 1) {
                if (px === x && (y === py + 2 || y === py + 1)) {
                    return true;
                }
            } else {
                if (px === x && y === py + 1) {
                    return true;
                }
            }
        } else {
            if (py === 6) {
                if (px === x && (y === py - 2 || y === py - 1)) {
                    return true;
                }
            } else {
                if (px === x && y === py - 1) {
                    return true;
                }
            }
        }
        return false;
    }
}