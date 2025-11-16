import "./style.scss";


import Game from './js/Game';



let data = Game.getRowsCols();
let dificultad = Game.dificultad();
let juego = new Game(data.rows, data.cols, dificultad);