enum CellType {
    None = 0,
    Cross = 1,
    Circle = 2
}

interface IMousePos {
    x: number;
    y: number;
}

interface IRowCol {
    col: number;
    row: number;
}

interface IMove {
    x: number;
    y: number;
    type: CellType;
}

export class TicTacToe {
    private _canvas: HTMLCanvasElement;
    private _button: HTMLButtonElement;
    private _ctx: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private _colCount: number = 3;
    private _rowCount: number = 3;
    private _cellWidth: number = 200;
    private _cellHeight: number = 200;
    private _moves: IMove[] = [];
    private _currentPlayer: number = 0;
    private _cellElementColor: string = "#052354";
    private _gridColor: string = "#000000";

    constructor() {}

    public run() {
        this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this._button = document.getElementById("newGameButton") as HTMLButtonElement;
        this._ctx = this._canvas.getContext("2d");
        this._width = this._canvas.clientWidth;
        this._height = this._canvas.clientHeight;
        this._button.addEventListener("click", (_e) => {
            this.newGame();
        });

        this._canvas.width = this._width;
        this._canvas.height = this._height;

        this.drawGrid(); 
    }

    private newGame() {
        this.clearGrid();
        this.drawGrid();
        
        if (this._currentPlayer === 0) {
            this._canvas.addEventListener("click", (e) => {
                let index = this.getIndex(this.getRowCol(this.getMousePos(this._canvas, e)));
                if (this._currentPlayer === 1) {
                    this._moves[index].type = CellType.Cross;
                    this.drawCell(this._moves[index].x, this._moves[index].y, this._moves[index].type);
                    this.setPlayerToMove(2);
                } else {
                    this._moves[index].type = CellType.Circle;
                    this.drawCell(this._moves[index].x, this._moves[index].y, this._moves[index].type);
                    this.setPlayerToMove(1);
                }
            });
        }
        
        this.setPlayerToMove(this.getPlayerToStart());
        this.showHidePlayerToMove(true);
    }    

    private showHidePlayerToMove(show: boolean) {
        const playerToStart = document.getElementById("playerToStart");
        if (show) {
            playerToStart.style.display = "block";
        } else {
            playerToStart.style.display = "none";
        }
    }
    
    private setPlayerToMove(playerNymber: number) {
        const playerToStartText = document.getElementById("playerToStartValue");
        this._currentPlayer = playerNymber;
        playerToStartText.innerText = this._currentPlayer.toString();
        
    }
    
    private getPlayerToStart() {
        return (Math.floor((Math.random() * 10) + 1) % 2) + 1;
    }
    
    private clearGrid() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    
    private drawMoves() {
    
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
    
    private drawCell(x: number, y: number, type: CellType) {
        // clearGrid();
        this.drawGrid();
    
        if (type === CellType.Cross) {
            this.drawCircle(x, y);
        } else if (type === CellType.Circle) {
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
    
    private getCellCoordinates(rowCol: IRowCol) {
        let x = rowCol.col * this._cellWidth;
        let y = rowCol.row * this._cellHeight;
        return {
            x: x,
            y: y
        }
    }
    
    private getIndex(rowCol: IRowCol) {
        return rowCol.row * this._colCount + rowCol.col;
    }

    private parseCells() {

    }
}


