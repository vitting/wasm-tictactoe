import {TicTacToe} from "./tictactoe";

let buttonElem = document.getElementById("newAutoGameButton");

let tictactoe = new TicTacToe();

tictactoe.init();

buttonElem.addEventListener("click", () => {
    tictactoe.runAuto(10, true);
});


let buttonManual = document.getElementById("newGameButton") as HTMLButtonElement;
    
buttonManual.addEventListener("click", (_e) => {
    tictactoe.newGame(true);
});

// tictactoe.run();