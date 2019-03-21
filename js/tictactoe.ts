import * as _ from "lodash";
import { CellType, WinnerEnum, IMove, IParseResult, IMousePos, IRowCol, IWinner, MoveState, sleep } from "./tictactoe_types";


export class TicTacToe {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private _colCount: number = 3;
    private _rowCount: number = 3;
    private _cellWidth: number = 200;
    private _cellHeight: number = 200;
    private _moves: IMove[] = [];
    private _moveCount: number = 0;
    private _currentPlayer: number = 0;
    private _cellElementColor: string = "#052354";
    private _gridColor: string = "#000000";
    private _cellElementFillColor: string = "rgba(5,35,84, 0.5)";
    private _messageElementFillColor: string = "rgba(42, 163, 97, 0.8)";
    private _messageTextElementFillColor: string = "rgba(255, 255, 255, 1)";
    private _isCanvasEventListenerAdded = false;
    private _autoRunWinners: number[] = [];
/// TODO: Statestik
    constructor() {}

    public init() {
        this.initRun();    
    }

    public async runAuto(numberOfGames: number, showMoves: boolean = false, moveMs: number = 250, showResult: boolean = false) {
        let start: number = Date.now();
        let end: number = 0;
        this._autoRunWinners = [];
        this.addResult(null);   
        this.showResults(showResult);
        
        for (let index = 0; index < numberOfGames; index++) {
            this.newGame(false, showResult);    
            this.setGameMoveText((index + 1).toString());   
            await this.autoMakeMoves(showMoves, (index + 1), moveMs);
        }

        end = Date.now();
        let stat = this.autoStatistic(numberOfGames);
        this.setResultTime(`${numberOfGames.toString()} Games played in ${(end-start).toString()} ms.\n Player1 won: ${stat[0]}, Player2 won: ${stat[1]}, draws: ${stat[2]}`);
    }

    public newGame(enableCanvasClick: boolean, showResult: boolean = false) {
        this._currentPlayer = 0;
        this._moveCount = 0;
        this._moves = [];    
        this.clearGrid();
        this.drawGrid();
        this.setGameMoveText();
        if (enableCanvasClick && !this._isCanvasEventListenerAdded) {
            this.showGameNumber(false);
            this.showResults(false);
            this._canvas.addEventListener("click", (e) => this.canvasClick(e));
            this._isCanvasEventListenerAdded = true;
        } else {
            this.showGameNumber(true);
            this.setGameMoveText("0");
            this.showResults(showResult);
        }
        
        this.setPlayerToMove(this.getPlayerToStart());
    }    

    private autoStatistic(numberOfGames: number): [number, number, number] {
        let player1Count = this._autoRunWinners.filter((value) => value === 1).length;
        let player2Count = this._autoRunWinners.length - player1Count;
        let draws = numberOfGames - (player1Count + player2Count);
        return [player1Count, player2Count, draws];
    }

    private async autoMakeMoves(showMoves: boolean, autoRunNumber: number, moveMs: number) {
        let moveIndex = this.autoGetIndex();
        
        while (this.addMove(moveIndex, autoRunNumber) === MoveState.Started) {
            if (showMoves) {
                await sleep(moveMs);
            }
            
            moveIndex = this.autoGetIndex();
        }

        if (showMoves) {
            await sleep(moveMs);
        }
    }

    private autoGetIndex(): number {
        let freeCells = [];

        for (let index = 0; index < this._moves.length; index++) {
            const move = this._moves[index];
            if (move.type === CellType.None) {
                freeCells.push(index);
            }
        }

        return freeCells[_.random(freeCells.length - 1)];
    }

    private initRun() {
        this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this._ctx = this._canvas.getContext("2d");
        this._width = this._canvas.clientWidth;
        this._height = this._canvas.clientHeight;
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this.drawGrid(); 
    }

    private canvasClick(e: MouseEvent) {
        let index = this.getIndex(this.getRowCol(this.getMousePos(this._canvas, e)));
        let state = this.addMove(index);
    }

    private addMove(cell: number, autoRunNumber: number = 0): MoveState {
        let state = MoveState.Finished;
        let move: IMove = this._moves[cell];

        if (move.type === 0 && this.isThereMoreMoves()) {
            if (this._currentPlayer === 1) {
                this._moves[cell].type = CellType.Cross;
                this.drawCell(this._moves[cell].x, this._moves[cell].y, this._moves[cell].type);
                this.setPlayerToMove(2);
            } else {
                this._moves[cell].type = CellType.Circle;
                this.drawCell(this._moves[cell].x, this._moves[cell].y, this._moves[cell].type);
                this.setPlayerToMove(1);
            }

            this._moveCount++;
            state = this.moveCheck(autoRunNumber);   
        }

        return state;
    }

    private moveCheck(autoRunNumber: number = 0): MoveState {
        let state = MoveState.Started;
        const winner = this.checkForWinner(this.parseCells());
        if (winner.winnerType != WinnerEnum.None) {
            let moveCount = this._moveCount;
            this._moveCount = 10;
            this.drawWinner(winner.cells);
            this.drawMessage(`Winner is player ${winner.winnerType}!`);
            state = MoveState.Finished;
            this.showHidePlayerToMove(false);
            this.showGameNumber(false);
            this.addResult(`${autoRunNumber}. Winner is player ${winner.winnerType} (${moveCount})`);

            if (autoRunNumber !== 0) {
                winner.winnerType === WinnerEnum.Player1 ? this._autoRunWinners.push(1) : this._autoRunWinners.push(2);
            }
        } else if (!this.isThereMoreMoves()) {
            this.drawMessage("No winner!");
            state = MoveState.Finished;
            this.showHidePlayerToMove(false);
            this.showGameNumber(false);
            this.addResult(`${autoRunNumber}. Was a draw!`);
        }

        return state;
    }

    private setPlayerToMove(playerNymber: number) {
        this.showHidePlayerToMove(true);
        const playerToStartText = document.getElementById("playerToStartValue");
        
        this._currentPlayer = playerNymber;
        playerToStartText.innerText = this._currentPlayer.toString();
        
        
    }

    private setGameMoveText(text: string = null) {
        const titleGameNumber = document.getElementById("titleGameNumberValue");
        if (text === null) {
            titleGameNumber.innerText = this._moveCount.toString();
        } else {
            titleGameNumber.innerText = text;
        }
    }

    private showHidePlayerToMove(show: boolean) {
        const title = document.getElementById("title");
        
        if (show) {
            title.style.display = "block";
        } else {
            title.style.display = "none";
        }
    }

    private showGameNumber(show: boolean) {
        const titleGameNumber = document.getElementById("titleGameNumber");
        
        if (show) {
            titleGameNumber.style.display = "block";
        } else {
            titleGameNumber.style.display = "none";
        }
    }

    private setResultTime(text: string) {
        let elem = document.getElementById("resultsTime");        
        elem.innerText = text;
    }

    private addResult(text: string) {
        let list = document.getElementById("resultList");        
        if (text !== null) {
            let div = document.createElement("div");
            div.innerText = text;
            list.appendChild(div);
        } else {
            list.innerHTML = "";
        }
    }

    private showResults(show: boolean) {
        const results = document.getElementById("resultContainer");
        
        if (show) {
            results.style.display = "block";
        } else {
            results.style.display = "none";
        }
    }
    
    private getPlayerToStart() {
        return (Math.floor((Math.random() * 10) + 1) % 2) + 1;
    }
    
    private clearGrid() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    
    private drawGrid() {
        let cellsX = [];
        let cellsY = [];
        let lineCorrection = 0.5;
    
        // Draw Grid
        this._ctx.beginPath();
        this._ctx.strokeStyle = this._gridColor;
        this._ctx.lineWidth = 2;
        for (let index = 0; index < this._width; index++) {
            if (index % this._cellWidth === 0) {
                cellsX.push(index);
    
                this._ctx.moveTo(index + lineCorrection, 0 + lineCorrection);
                this._ctx.lineTo(index + lineCorrection, this._height + lineCorrection);
            }
        }
    
        for (let index = 0; index < this._height; index++) {
            if (index % this._cellHeight === 0) {
                cellsY.push(index);
    
                this._ctx.moveTo(lineCorrection, index + lineCorrection);
                this._ctx.lineTo(this._height + lineCorrection, index + lineCorrection);
            }
        }
    
        this._ctx.closePath();
        this._ctx.stroke();
    
        // Draw Border
        this._ctx.beginPath();
        this._ctx.strokeStyle = this._gridColor;
        this._ctx.lineWidth = 3.5;
        this._ctx.rect(0, 0, this._width, this._height);
        this._ctx.closePath();
        this._ctx.stroke();
    
        if (this._moves.length === 0) {
            this.setCellsCoordinates(cellsX, cellsY);
        }
    
    }
    
    private setCellsCoordinates(cellsX: number[], cellsY: number[]) {
        cellsY.forEach((y) => {
            cellsX.forEach((x) => {
                this._moves.push({
                    x: x,
                    y: y,
                    type: CellType.None
                });
            });
        });
    }

    private drawMessage(text: string) {
        this._ctx.beginPath();
        this._ctx.fillStyle = this._messageElementFillColor;
        this._ctx.fillRect(60, (this._canvas.height / 2) - 40, this._canvas.width - 120, 80);
        this._ctx.font = "30px Arial";
        this._ctx.fillStyle = this._messageTextElementFillColor;
        this._ctx.textAlign = "center";
        this._ctx.fillText(text, this._canvas.width / 2, (this._canvas.height / 2) + 10); 
        this._ctx.closePath();
    }

    private drawWinner(cells: IMove[]) {
        this._ctx.beginPath();
        this._ctx.fillStyle = this._cellElementFillColor;
        for (let index = 0; index < cells.length; index++) {
            const cell = cells[index];
            this._ctx.fillRect(cell.x, cell.y, this._cellWidth, this._cellHeight);    
        }
        
        this._ctx.closePath();
    }
    
    private drawCell(x: number, y: number, type: CellType) {
        if (type === CellType.Circle) {
            this.drawCircle(x, y);
        } else if (type === CellType.Cross) {
            this.drawCross(x, y);
        }
    }
    
    private drawCircle(x: number, y: number) {
        this._ctx.beginPath();
        this._ctx.fillStyle = this._cellElementColor;
        this._ctx.arc(x + 100, y + 100, 80, 0, 2 * Math.PI);
        this._ctx.fill();
        this._ctx.beginPath();
        this._ctx.fillStyle = "white";
        this._ctx.arc(x + 100, y + 100, 60, 0, 2 * Math.PI);
        this._ctx.fill();
        this._ctx.closePath();
    }
    
    private drawCross(x: number, y: number) {
        const PADDING = 35;
        this._ctx.beginPath();
        this._ctx.lineWidth = 20;
        this._ctx.strokeStyle = this._cellElementColor;
        this._ctx.moveTo(x + PADDING, y + PADDING);
        this._ctx.lineTo(x + this._cellWidth - PADDING, y + this._cellHeight - PADDING);
        this._ctx.moveTo(x + this._cellWidth - PADDING, y + PADDING);
        this._ctx.lineTo(x + PADDING, y + this._cellHeight - PADDING);
        this._ctx.closePath();
        this._ctx.stroke();
    }
    
    private getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    private getRowCol(mousePos: IMousePos) {
        // Col
        let x = Math.floor(mousePos.x / this._cellWidth);
    
        // Row
        let y = Math.floor(mousePos.y / this._cellHeight);
    
        return {
            row: Math.floor(y),
            col: Math.floor(x)
        };
    }
    
    // private getCellCoordinates(rowCol: IRowCol) {
    //     let x = rowCol.col * this._cellWidth;
    //     let y = rowCol.row * this._cellHeight;
    //     return {
    //         x: x,
    //         y: y
    //     }
    // }
    
    private getIndex(rowCol: IRowCol) {
        return rowCol.row * this._colCount + rowCol.col;
    }

    private isThereMoreMoves() {
        return this._moveCount < 9;
    }

    private parseCells(): IParseResult {
        let rows: IMove[][] = [];
        let cols: IMove[][] = [];
        let crossLR: IMove[] = [];
        let crossRL: IMove[] = [];
        
        for (let r = 0; r < this._rowCount; r++) {
            let start = r * this._rowCount;
            let end = start + this._rowCount;
            let row = this._moves.slice(start, end);
            // Get row
            rows.push(row);    

            // Get Cross Left-Right | Right-Left
            crossLR.push(row[r]);
            crossRL.push(row[row.length - 1 - r]);

            // Get Cols
            for (let i = 0; i < row.length; i++) {
                const move = row[i];
                
                if (cols[i] === undefined) {
                    cols.push([move]);
                } else {
                    cols[i].push(move);
                }
            }
        }

        return {
            rows: rows,
            cols: cols,
            cross: [crossLR, crossRL]
        };
    }

    private checkForWinner(parsedCells: IParseResult): IWinner {
        const rowResult = this.checkResult(parsedCells.rows);

        if (rowResult.winnerType != WinnerEnum.None) {
            return rowResult;
        } 

        const colResult = this.checkResult(parsedCells.cols);

        if (colResult.winnerType != WinnerEnum.None) {
            return colResult;
        }

        return this.checkResult(parsedCells.cross);
    }

    private checkResult(value: IMove[][]): IWinner {
        let returnValue: IWinner = {
            winnerType: WinnerEnum.None, 
            cells: []
        };

        for (let x = 0; x < value.length; x++) {
            const element = value[x];
            let player1Count = 0;
            let player2Count = 0;

            for (let i = 0; i < element.length; i++) {
                const e = element[i];
                switch (e.type) {
                    case CellType.Cross:
                        player1Count++;
                        break;
                    case CellType.Circle:
                        player2Count++;
                        break;
                }
            }

            if (player1Count === this._rowCount) {
                returnValue = {
                    winnerType: WinnerEnum.Player1, 
                    cells: element
                };
                break;
            } else if (player2Count === this._rowCount) {
                returnValue = {
                    winnerType: WinnerEnum.Player2, 
                    cells: element
                };
                break;
            }
        }

        return returnValue;
    }
}
