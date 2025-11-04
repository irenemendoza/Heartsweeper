import "./style.scss";


import Tablero from './js/Tablero';



let data = Tablero.getRowsCols();
let dificultad = Tablero.dificultad();
let juego = new Tablero(data.rows, data.cols, dificultad);