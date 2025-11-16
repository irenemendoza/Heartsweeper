class Timer {
    constructor() {
        this.seconds = 0;
        this.interval = null;
        this.display = document.getElementById("timer");
    }

    start() {
        this.interval = setInterval(() => {
            this.seconds++;

            const h = String(Math.floor(this.seconds / 3600)).padStart(2, "0");
            const m = String(Math.floor((this.seconds % 3600) / 60)).padStart(2, "0");
            const s = String(this.seconds % 60).padStart(2, "0");

            if (this.display) {
                this.display.textContent = `${h}:${m}:${s}`;
            }

        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    reset() {
        this.stop();
        this.seconds = 0;
        if (this.display) {
            this.display.textContent = "00:00:00";
        }
    }
}

export default Timer;