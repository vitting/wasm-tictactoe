import {TicTacToe} from "./tictactoe";

let buttonElem = document.getElementById("newAutoGameButton");

let tictactoe = new TicTacToe();

tictactoe.init();

buttonElem.addEventListener("click", () => {
    const showAutoRunsElem = document.getElementById("showAutoRuns") as HTMLSelectElement;
    const numberOfAutoRunsElem = document.getElementById("numberOfAutoRuns") as HTMLInputElement;
    let showAutoRuns: number = parseInt(showAutoRunsElem.value);
    let numberOfAutoRuns: number = parseInt(numberOfAutoRunsElem.value);
    console.log(showAutoRuns, numberOfAutoRuns);
    tictactoe.runAuto(numberOfAutoRuns, showAutoRuns === 1);
    
});


let buttonManual = document.getElementById("newGameButton") as HTMLButtonElement;
    
buttonManual.addEventListener("click", (_e) => {
    tictactoe.newGame(true);
});

// tictactoe.run();