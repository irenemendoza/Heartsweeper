
import Game from './Game';

class Hearts {
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


    numberOfHearts() {
        let porcentaje;
        if (this.dificultad === "1") porcentaje = 0.10;
            else if (this.dificultad === "2") porcentaje = 0.14;
            else porcentaje = 0.18;
        const numberOfHearts = Math.floor(this.rows * this.cols * porcentaje);
        return numberOfHearts;
    }

    placeHearts() {
    const numberOfHearts = this.numberOfHearts();
    const totalBoxes = this.boxes.length;

    // Creamos un Set con índices aleatorios únicos
    const heartsSet = new Set();
    while (heartsSet.size < numberOfHearts) {
        const randomIndex = Math.floor(Math.random() * totalBoxes);
        heartsSet.add(randomIndex);
    }

    // Asignamos minas según esos índices
    heartsSet.forEach(index => {
        this.boxes[index].isHeart = true;
    });
}
}

export default Hearts;

