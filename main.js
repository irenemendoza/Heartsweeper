import "./style.scss";
import Game from './js/Game';

const data = await Game.getRowsCols();
if (data) {
    const dificultad = await Game.dificultad();
    if (dificultad) {
        new Game(data.rows, data.cols, dificultad);
    }
}