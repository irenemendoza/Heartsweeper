import Box from "./Box";
import "../style.scss";
import Minas from "./Minas";
import heartImg from "../img/heart.png";



class Tablero {
    rows;
    cols;
    boxes;
    numeroDeMinas;
    dificultad;

    constructor(rows, cols, dificultad){
        this.rows = rows;
        this.cols = cols;
        this.dificultad = dificultad;
        this.boxes = [];
        const tablero = document.getElementById("tablero");
        const contenedor = document.getElementById("contenedor");
        const resetBtn = document.createElement("button");
        this.createBoxes();
        this.setCSSTemplate();
        this.paintBoxes();
        this.minesAround();
        this.addEventListeners();
        resetBtn.textContent = "Reset";
        resetBtn.dataset.id = "resetBtn";
        contenedor.appendChild(resetBtn);
        resetBtn.addEventListener("click", this.reset);
    }

    static getRowsCols() {
        let rows;
        let cols;
        if (localStorage.getItem("rows") !== null && localStorage.getItem("cols") !== null) {
            rows = parseInt(localStorage.getItem("rows"));
            cols = parseInt(localStorage.getItem("cols"));
        } else {
            let dimension = prompt("Elige si prefieres jugar en tablero: 1. 8x8 o 2. 16x16");
            if (dimension === "1") {
                rows = 8;
                cols = 8;
                console.log("Has elegido 8x8");
            } else if (
                dimension === "2"
            ) {
                rows = 16;
                cols = 16;
                console.log("Has elegido 16x16");
            } else {
                alert("Hay que elegir una de las dos opciones.");
                return;
            }
            
            //localStorage.setItem("rows", rows);
            //localStorage.setItem("cols", cols);
        }
        
        return {
            "rows": rows,
            "cols": cols
        }
    }

    static dificultad() {
        const dificultad = prompt("Dificultad: 1.Fácil  2.Medio  3.Difícil");
        return dificultad;
    }

    createBoxes() {
        this.boxes = [];
        for (let row = 0; row < this.rows; row++){
            for (let col = 0; col < this.cols; col++){
                    let box = new Box(row, col);
                    this.boxes.push(box);              
            }
        }
        let minas = new Minas(this.rows, this.cols, this.boxes, this.dificultad);  
        minas.colocarMinas();
        // this.boxesToLocalStorage();
    }

    setCSSTemplate() {
        let boxContainer = document.getElementById("tablero");
        boxContainer.style.display = "grid";
        boxContainer.style.gridTemplateRows = `repeat(${this.rows}, 30px)`;
        boxContainer.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
    }

    getBox(rows, cols) {
        return this.boxes.find((box) => (box.row === rows && box.col === cols)) || null;
    }

    minesAround() {
        for (let box of this.boxes) {
            if (!box.isMine) {
                let minesCounter = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x === 0 && y === 0) continue;
                        let vecino = this.getBox(box.row + x,box.col + y);
                        if (vecino && vecino.isMine) {
                            minesCounter += 1;
                        }
                    }
                }
                box.minesAround = minesCounter;
            }
        }
    }
    
    paintBoxes(){
        let boxContainer = document.getElementById("tablero");
        this.boxes.forEach((box) => {
            let newBoxDiv = document.createElement("div");
            newBoxDiv.classList.add("box");
            newBoxDiv.dataset.col = box.col;
            newBoxDiv.dataset.row = box.row;
            box.element = newBoxDiv;

            boxContainer.appendChild(newBoxDiv);
        })  
    }

    /*checkBox() {
        if (this.box.isMine){
            this.checkedIsMine();
        }
        return;
    }*/

    openMines() {
        this.boxes.forEach((box) => {
                if (box.isMine) {
                box.element.style.backgroundImage = `url(${heartImg})`;
                box.element.style.backgroundSize = "cover";
                box.element.style.backgroundRepeat = "no-repeat";
                box.element.style.backgroundPosition = "center";
                }
            }
        )  
    }

    revealEmptyBoxes(box) {
        box.element.classList.add("open");
        box.element.style.backgroundColor = "purple";
        for (let x = -1; x <= 1; x++){
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                let vecino = this.getBox(box.row + x, box.col + y);
                if (!vecino || vecino.element.classList.contains("open")) continue;
                vecino.element.classList.add("open");
                vecino.element.style.backgroundColor = "purple";
                if (vecino.isMine) continue;
                if (vecino.minesAround > 0){
                    vecino.element.textContent = vecino.minesAround
                } else if (vecino.minesAround === 0) {
                    this.revealEmptyBoxes(vecino);
                }
            }
        }
    }

    addEventListeners() {
        this.boxes.forEach((box) => {
            box.element.addEventListener("click", () => {
                if (box.isMine) {
                    this.openMines();
                    alert("¡Has perdido!");
                } else if (box.minesAround > 0) {
                    box.element.textContent = box.minesAround;
                    box.element.classList.add("open");
                } else if (box.minesAround === 0) {
                    box.element.style.backgroundColor = "purple";
                    this.revealEmptyBoxes(box);
                }
            })
        })
    }

    reset() {
        localStorage.clear()
    }
}


export default Tablero;