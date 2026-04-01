import Box from "./Box";
import "../style.scss";
import Hearts from "./Hearts";
import heartBrokenImg from "../img/Broken_heart.png";
import heartImg from "../img/heart.png";
import Timer from "./Timer";
import { saveScore, getTopScores } from './supabaseClient.js';
import Swal from 'sweetalert2';

const swalOpts = {
    background: '#F8F4EE',
    color: 'rgba(255,0,0)',
    confirmButtonColor: 'rgba(200,0,0,0.85)',
    cancelButtonColor: 'rgba(200,0,0,0.3)',
};



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
        const opciones = document.createElement("div");
        opciones.id = "opciones";
        const resetBtn = document.createElement("button");
        const newGameBtn = document.createElement("button");
        this.createBoxes();
        this.setCSSTemplate();
        this.paintBoxes();
        this.heartsAround();
        this.addEventListeners();
        resetBtn.textContent = "Reset";
        resetBtn.id = "resetBtn";
        resetBtn.classList = "btn";
        newGameBtn.textContent = "New Game";
        newGameBtn.id = "newGameBtn";
        newGameBtn.classList = "btn";
        contenedor.appendChild(opciones);
        opciones.appendChild(resetBtn);
        opciones.appendChild(newGameBtn);
        resetBtn.addEventListener("click", () => this.reset());
        newGameBtn.addEventListener("click", () => this.newGame());
        this.loadAndShowLeaderboard();
    }

    static async getRowsCols() {
        if (localStorage.getItem("rows") !== null && localStorage.getItem("cols") !== null) {
            return {
                rows: parseInt(localStorage.getItem("rows")),
                cols: parseInt(localStorage.getItem("cols"))
            };
        }

        const { value } = await Swal.fire({
            ...swalOpts,
            title: '¿Qué tablero prefieres?',
            input: 'radio',
            inputOptions: { '8': '8×8', '16': '16×16' },
            inputValidator: (v) => !v && 'Debes elegir una opción',
            confirmButtonText: 'Jugar',
            allowOutsideClick: false,
        });

        if (!value) return null;

        const size = parseInt(value);
        localStorage.setItem("rows", size);
        localStorage.setItem("cols", size);
        return { rows: size, cols: size };
    }

    static async dificultad() {
        const { value } = await Swal.fire({
            ...swalOpts,
            title: '¿Nivel de dificultad?',
            input: 'radio',
            inputOptions: { '1': 'Fácil', '2': 'Medio', '3': 'Difícil' },
            inputValidator: (v) => !v && 'Debes elegir una dificultad',
            confirmButtonText: 'Jugar',
            allowOutsideClick: false,
        });

        return value || null;
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

    

    openBreakHearts() {
        this.boxes.forEach((box) => {
            if (box.isHeart) {
                box.element.style.backgroundImage = `url(${heartBrokenImg})`;
                box.element.style.backgroundSize = "contain";
                box.element.style.backgroundRepeat = "no-repeat";
                box.element.style.backgroundPosition = "center";
            }
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
        })  
    }

    openBox(box) {
        if (!box || box.element.classList.contains("open")) return;
        box.element.classList.add("open");
        box.element.style.setProperty("background-color", "rgba(255,0,0,0.2)", "important");
        box.element.style.setProperty("border", "1px solid rgba(255,0,0)", "important");
        if (box.heartsAround > 0) {
            box.element.style.setProperty("color", "rgba(255,0,0)", "important");
            box.element.textContent = box.heartsAround;
        }
    }

    revealEmptyBoxes(box) {
        if (!box || box.element.classList.contains("open")) return;
        
        this.openBox(box);
        
        if (box.heartsAround > 0) {
            return;
        }
        
   
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                let vecino = this.getBox(box.row + x, box.col + y);
                if (vecino && !vecino.element.classList.contains("open") && !vecino.isHeart) {
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
                    this.openBreakHearts();
                    this.stopTimer();
                    setTimeout(() => {
                        Swal.fire({
                            ...swalOpts,
                            title: '💔 ¡Has perdido!',
                            confirmButtonText: 'Reintentar',
                        });
                    }, 500);
                    
                } else if (box.heartsAround > 0) {
                    this.openBox(box);
                    this.checkwin();
                } else if (box.heartsAround === 0) {
                    this.revealEmptyBoxes(box);
                }
                
            })
            box.element.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            })
        })
    }

    async checkwin() {
        let numberOfNoHearts = (this.rows * this.cols) - this.numberOfHearts;
        let openBoxes = this.boxes.filter((box) => box.element.classList.contains("open")).length;
        if (numberOfNoHearts === openBoxes) {
            this.stopTimer();       // pausamos el cronómetro
            this.openHearts();      // se descubren los corazones
            this.animateHearts();   // arranca la animación
            let time = document.getElementById("timer");
            
            setTimeout(async () => {
                const time = document.getElementById("timer");
                const tiempoJuego = this.timer.timeToMs(time.textContent);
                
                const { value: playerName } = await Swal.fire({
                    ...swalOpts,
                    title: '🏆 ¡Has ganado!',
                    text: `Tu tiempo: ${time.textContent}`,
                    input: 'text',
                    inputPlaceholder: 'Tu nombre',
                    confirmButtonText: 'Guardar puntuación',
                });

                await saveScore({
                    rows: this.rows,
                    cols: this.cols,
                    difficulty: this.dificultad,
                    playerName: playerName || 'Anónimo',
                    time_ms: tiempoJuego
                })
                .then((saved) => console.log("saveScore ok", saved))
                .catch((err) => console.error("saveScore error", err));

                const top = await getTopScores({
                    rows: this.rows,
                    cols: this.cols,
                    difficulty: this.dificultad
                });

                this.showLeaderboard(top);
            }, 1800);            
        }
        
    }

    async loadAndShowLeaderboard() {
        const top = await getTopScores({
            rows: this.rows,
            cols: this.cols,
            difficulty: this.dificultad
        });
        this.showLeaderboard(top);
    }

    showLeaderboard(entries) {
        const tableBody = document.getElementById('leaderboardBody');
        const tableName = document.getElementById('leaderboardName');
        if (this.dificultad === "1"){
            tableName.innerHTML = `${this.rows}x${this.cols} - FÁCIL`;
        }
        if (this.dificultad === "2"){
            tableName.innerHTML = `${this.rows}x${this.cols} - INTERMEDIO`;
        }
        if (this.dificultad === "3"){
            tableName.innerHTML = `${this.rows}x${this.cols} - DIFÍCIL`;
        }
        tableBody.innerHTML = '';
        entries.forEach((row, idx) => {
            const fecha = new Date(row.created_at).toLocaleString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${idx + 1}</td><td>${row.player_name}</td><td>${this.formatTimeMs(row.time_ms)}</td><td>${fecha}</td>`;
            tableBody.appendChild(tr);
        });
    }

    animateHearts() {
        const container = document.createElement("div");
        container.className = "hearts-container";
        document.body.appendChild(container);

        const heartEmoji = "❤️";
        const numberOfHearts = 30;

        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement("div");
            heart.className = "falling-heart";
            heart.textContent = heartEmoji;
            heart.style.left = Math.random() * 100 + "%";
            heart.style.animationDelay = Math.random() * 0.5 + "s";
            container.appendChild(heart);
        }

        // Eliminar el contenedor después de la animación
        setTimeout(() => {
            container.remove();
        }, 2500);
    }

    initTimer() {
        let timerContainer = document.getElementById("timerContainer");
        if (!timerContainer) {
            timerContainer = document.createElement("h2");
            timerContainer.setAttribute("id", "timerContainer");
            timerContainer.innerHTML = '<span id=timer>00:00:00</span>';
            let contenedor = document.getElementById("contenedor");
            contenedor.appendChild(timerContainer);
        } else {
            const timerSpan = document.getElementById("timer");
            if (timerSpan) {
                timerSpan.textContent = "00:00:00";
            }
        }
        this.timer = new Timer();
        this.timer.start();
    }

    stopTimer(){
        this.timer.stop();
    }

    formatTimeMs(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
        return `${minutes}:${seconds}.${centiseconds}`;
    }

    saveState() {
        let state = {
            boxes: this.boxes.map((box) => ({
                row: box.row,
                col: box.col,
                inMine: box.isHeart,
                isOpen: box.element.classList.contains("open"),
                heartsAround: box.heartsAround
            })),
            numberOfHearts: this.numberOfHearts
        }

        localStorage.setItem("GameState", JSON.stringify(state));
    }

    reset() {
        // Limpiar todas las cajas visualmente
        this.boxes.forEach((box) => {
            box.element.classList.remove("open");
            box.element.style.backgroundColor = "";
            box.element.style.backgroundImage = "";
            box.element.textContent = "";
        });

        // Resetear propiedades de las cajas
        this.boxes.forEach((box) => {
            box.isHeart = false;
            box.heartsAround = 0;
        });

        // Redistribuir corazones
        let hearts = new Hearts(this.rows, this.cols, this.boxes, this.dificultad);
        this.numberOfHearts = hearts.numberOfHearts();
        hearts.placeHearts();

        // Recalcular heartsAround
        this.heartsAround();

        // Detener el timer si está corriendo
        if (this.timer) {
            this.timer.stop();
            this.timer = null;
        }

        // Limpiar el display del timer
        const timerSpan = document.getElementById("timer");
        if (timerSpan) {
            timerSpan.textContent = "00:00:00";
        }

        // Limpiar localStorage
        localStorage.clear();

        // Reiniciar el estado del juego
        this.isTimerStarted = false;

        this.loadAndShowLeaderboard();
    }

    newGame() { 
        localStorage.clear();
        location.reload();
    }

}

export default Game;