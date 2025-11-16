class Box {
    row;
    col;
    heart;
    flag;
    free;
    open;
    element;
    

    constructor(row, col, isHeart = false, isFlag = false, open = false) {
        this.row = row;
        this.col = col;
        this.isHeart = isHeart;
        this.isFlag = isFlag;
        this.heartsAround = 0;
        this.element = null;
        this.open = open;   
    }
}

export default Box;