
import Tablero from './Tablero';

class Minas {
    rows;
    cols;
    boxes;
    dificultad;

    constructor(rows, cols, boxes, dificultad) {
        this.rows = rows;
        this.cols = cols;
        this.boxes = boxes;
        this.dificultad = dificultad;
    }

    shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


    cantidadMinas() {
        let porcentaje;
        if (this.dificultad === "1") porcentaje = 0.10;
            else if (this.dificultad === "2") porcentaje = 0.14;
            else porcentaje = 0.18;
        const numeroDeMinas = Math.floor(this.rows * this.cols * porcentaje);
        return numeroDeMinas;
    }

    colocarMinas() {
    const numeroDeMinas = this.cantidadMinas();
    const totalBoxes = this.boxes.length;

    // Creamos un Set con índices aleatorios únicos
    const minasSet = new Set();
    while (minasSet.size < numeroDeMinas) {
        const randomIndex = Math.floor(Math.random() * totalBoxes);
        minasSet.add(randomIndex);
    }

    // Asignamos minas según esos índices
    minasSet.forEach(index => {
        this.boxes[index].isMine = true;
    });
}
}

export default Minas;

