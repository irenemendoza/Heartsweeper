class Box {
    row;
    col;
    heart;
    flag;
    free;
    open;
    element;
    

    constructor(row, col, isMine = false, isFlag = false, open = false) {
        this.row = row;
        this.col = col;
        this.isMine = isMine;
        this.isFlag = isFlag;
        this.minesAround = 0;
        this.element = null;
        this.open = open;   
    }
}
/*
     addEventClick() {
        if (this.element) {
            this.element.addEventListener("click", (e) => {
                if (!this.open) {
                    this.#element.style.backgroundColor = this.#color;
                    this.#open = true;
                    console.log("Has hecho click en una carta");
                } 
                return false;
            })
        }
    }
  
}
*/
export default Box;