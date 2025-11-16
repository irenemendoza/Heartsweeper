import Box from "./Box";
import "../style.scss";
import Hearts from "./Hearts";
import heartImg from "../img/heart.png";
import Timer from "./Timer";




class Game {
    rows;
    cols;
    boxes;
    dificultad;
    numberOfHearts;
    timer;
    isTimerStarted = false;


    constructor(rows, cols, dificultad){
        this.rows = rows;
        this.cols = cols;
        this.dificultad = dificultad;
        this.boxes = [];
        this.numberOfHearts;
        const tablero = document.getElementById("tablero");
        const contenedor = document.getElementById("contenedor");
        const resetBtn = document.createElement("button");
        this.createBoxes();
        this.setCSSTemplate();
        this.paintBoxes();
        this.heartsAround();
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
            
            localStorage.setItem("rows", rows);
            localStorage.setItem("cols", cols);
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
        let hearts = new Hearts(this.rows, this.cols, this.boxes, this.dificultad);  
        this.numberOfHearts = hearts.numberOfHearts();
        hearts.placeHearts();
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

    heartsAround() {
        for (let box of this.boxes) {
            if (!box.isHeart) {
                let heartsCounter = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        if (x === 0 && y === 0) continue;
                        let vecino = this.getBox(box.row + x,box.col + y);
                        if (vecino && vecino.isHeart) {
                            heartsCounter += 1;
                        }
                    }
                }
                box.heartsAround = heartsCounter;
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

    

    openHearts() {
        this.boxes.forEach((box) => {
                if (box.isHeart) {
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
        box.element.style.backgroundColor = "lightyellow";
        for (let x = -1; x <= 1; x++){
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                let vecino = this.getBox(box.row + x, box.col + y);
                if (!vecino || vecino.element.classList.contains("open")) continue;
                vecino.element.classList.add("open");
                vecino.element.style.backgroundColor = "lightyellow";
                if (vecino.isHeart) continue;
                if (vecino.heartsAround > 0){
                    vecino.element.textContent = vecino.heartsAround
                } else if (vecino.heartsAround === 0) {
                    this.revealEmptyBoxes(vecino);
                }
            }
        }
    }

    addEventListeners() {
        this.boxes.forEach((box) => {
            box.element.addEventListener("click", () => {
                if (!this.isTimerStarted) {
                    this.isTimerStarted = true;
                    this.initTimer();
                }
                if (box.isHeart) {
                    this.openHearts();
                    alert("¡Has perdido!");
                } else if (box.heartsAround > 0) {
                    box.element.style.backgroundColor = "lightyellow";
                    box.element.textContent = box.heartsAround;
                    box.element.classList.add("open");
                } else if (box.heartsAround === 0) {
                    box.element.style.backgroundColor = "lightyellow";
                    box.element.classList.add("open");
                    this.revealEmptyBoxes(box);
                }
                this.checkwin();
            })
            box.element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (!box.element.classList.contains("open")) {
                    box.element.style.backgroundImage = 'url("../img/redFlag.png")';
                    box.element.style.backgroundSize = "cover";
                    box.element.style.backgroundPosition = "center"
                }
            })
        })
    }

    checkwin() {
        let numberOfNoHearts = (this.rows * this.cols) - this.numberOfHearts;
        let openBoxes = this.boxes.filter((box) => box.element.classList.contains("open")).length;
        if (numberOfNoHearts === openBoxes) {
            alert("¡Has ganado!")
        }
        
    }

    initTimer() {
        let timerContainer = document.createElement("h2");
        timerContainer.setAttribute("id", "timerContainer");
        timerContainer.innerHTML = '<span id=timer>00:00:00</span>';
        let boxHeader = document.getElementById("tablero");
        boxHeader.appendChild(timerContainer);
        if (!this.timer) {
            this.timer = new Timer();
        }
        this.timer.start();
    }

    saveState() {
        let state = {
            boxes: this.boxes.map((box) => ({
                row: box.row,
                col: box.col,
                inMine: box.isHeart,
                isOpen: box.element.classList.contains("open"),
                hasFlag: box.element.style.backgroundImage.includes("redFlag.png"),
                heartsAround: box.heartsAround
            })),
            numberOfHearts: this.numberOfHearts
        }

        localStorage.setItem("GameState", JSON.stringify(state));
    }

    reset() {
        localStorage.clear()
    }
}
        

export default Game;