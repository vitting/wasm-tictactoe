import {TicTacToe} from "./tictactoe";

const buttonElem = document.getElementById("newAutoGameButton");

let tictactoe = new TicTacToe();

tictactoe.init();

buttonElem.addEventListener("click", () => {
    const showAutoRunsElem = document.getElementById("showAutoRuns") as HTMLSelectElement;
    const numberOfAutoRunsElem = document.getElementById("numberOfAutoRuns") as HTMLInputElement;
    const numberOfmsElem = document.getElementById("numberOfms") as HTMLInputElement;
    const showResultElem = document.getElementById("showResult") as HTMLSelectElement;
    let showAutoRuns: number = parseInt(showAutoRunsElem.value);
    let showResult: number = parseInt(showResultElem.value);
    let numberOfAutoRuns: number = parseInt(numberOfAutoRunsElem.value);
    let numberOfms: number = parseInt(numberOfmsElem.value);
    console.log(showResultElem.value);
    tictactoe.runAuto(numberOfAutoRuns, showAutoRuns === 1, numberOfms, showResult === 1);
});

let buttonManual = document.getElementById("newGameButton") as HTMLButtonElement;
    
buttonManual.addEventListener("click", (_e) => {
    tictactoe.newGame(true);
});

// tictactoe.run();