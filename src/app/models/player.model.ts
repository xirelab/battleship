import { Board } from "./board.model";

export class Player {
    name: string;
    board: Board;
    lifes: number;
    isSetupCompleted: boolean;

    constructor(numberofCells: number, lifes: number = 3, name = '') {
        this.name = name;
        this.lifes = lifes;
        this.isSetupCompleted = false;
        this.board = new Board(numberofCells);
    }
}