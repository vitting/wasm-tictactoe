export enum CellType {
    None = 0,
    Cross = 1,
    Circle = 2
}

export enum WinnerEnum {
    None = 0,
    Player1 = 1,
    Player2 = 2
}

export interface IWinner {
    winnerType: WinnerEnum;
    cells: IMove[];
}

export interface IMousePos {
    x: number;
    y: number;
}

export interface IRowCol {
    col: number;
    row: number;
}

export interface IMove {
    x: number;
    y: number;
    type: CellType;
}

export interface IParseResult {
    rows: IMove[][];
    cols: IMove[][];
    cross: IMove[][];
}
