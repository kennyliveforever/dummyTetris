let main = document.querySelector('.main')

let arr = []
let timer
let index = 0
let score = 0
let level = 1
let timeout = 150
let pause = false
let pauseBlink

let sound = new Audio('./sound/blipSelect.wav')
let sound2 = new Audio('./sound/powerUp.wav')
let sound3 = new Audio('./sound/explosion.wav')


let pauseElement = document.querySelector('.pause')

let countElement = document.querySelector('.scoreCount')
countElement.textContent = `${score}`

let levelElement = document.querySelector('.levelCount')
levelElement.textContent = level

class Figure {

    constructor() {
        this._length = 4
        this.height = 1
        this.elem = document.createElement('div')
        this.elem.className = 'figure'
        this.elem.insertAdjacentHTML("afterbegin",
            '<div id="cell_0" class="figure-cell"></div>\n' +
            '     <div id="cell_1" class="figure-cell"></div>\n' +
            '     <div id="cell_2" class="figure-cell"></div>\n' +
            '     <div id="cell_3" class="figure-cell"></div>\n')
        //this.elem.setAttribute('id',`${index}`)
        this.elem.style.gridRowStart = '1'
        this.elem.style.gridRowEnd = '1'
        this.elem.style.gridColumnStart = '5'
        this.elem.style.gridColumnEnd = '9'
        this.elem.style.gridTemplateRows = '1fr'
        this.elem.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'
        this.isRotate = 0
        this.isMove = true
        this.cell3 = this.elem.querySelector('#cell_3')
        this.cell2 = this.elem.querySelector('#cell_2')
        this.cell1 = this.elem.querySelector('#cell_1')
        this.cell0 = this.elem.querySelector('#cell_0')
        this.cell1.style.left = '20px'
        this.cell2.style.left = '40px'
        this.cell3.style.left = '60px'
    }

    set cellRow(value) {
        this.cell0.setAttribute('row', `${value[0]}`)
        this.cell1.setAttribute('row', `${value[1]}`)
        this.cell2.setAttribute('row', `${value[2]}`)
        this.cell3.setAttribute('row', `${value[3]}`)
    }

    get currentPositionX() {
        return +this.elem.style.gridRowEnd
    }

    get posY() {
        return [+this.elem.style.gridColumnStart, +this.elem.style.gridColumnEnd]
    }

    get nextLeft() {
        if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 2][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 3][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 4][this.posY[0] - 2]
        }
        return matrix[this.currentPositionX - 1][this.posY[0] - 2]
    }

    get nextRight() {
        if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[0]] ||
                matrix[this.currentPositionX - 2][this.posY[0]] ||
                matrix[this.currentPositionX - 3][this.posY[0]] ||
                matrix[this.currentPositionX - 4][this.posY[0]]
        }
        return matrix[this.currentPositionX - 1][this.posY[1] - 1]
    }

    get nextPos () {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX].slice(this.posY[0] - 1, this.posY[1] - 1).includes(1)
        } else {
            return matrix[this.currentPositionX-1][this.posY[0] - 1] === 1
        }
    }

    matrixFill() {
        if (this.isRotate == 0) {
            matrix[this.currentPositionX-1].splice(+this.elem.style.gridColumnStart - 1, 4, 1, 1, 1, 1)
        } else if (this.isRotate == 90) {
            for (let i = 2; i < 6; i++) {
                matrix[arr[index].currentPositionX-i].splice(+this.elem.style.gridColumnStart - 1, 1, 1)
            }
        }
    }

    moveDown() {
        if (!this.nextPos) {
              this.elem.style.gridRowStart++
              this.elem.style.gridRowEnd++
            } else if (this.nextPos && this.elem.style.gridRowStart <= 2) {
              this.isMove = false
              clearInterval(timer)
            for (let i of document.querySelectorAll('.figure')) {
                i.remove()
            }
            main.append(document.createElement('div').textContent = 'GAME OVER')
        } else {
            sound2.play()
            this.isMove = false
            score += 10
            countElement.textContent = `${score}`
            clearInterval(timer)
            this.matrixFill()
            this.cellRowSet()
            fullRowHandler()
        }
      }

      createFigure() {
        main.append(this.elem)
      }

      set style (value) {
          this.cell1.style.left = value[0]
          this.cell2.style.left = value[1]
          this.cell3.style.left = value[2]
          this.cell1.style.top = value[3]
          this.cell2.style.top = value[4]
          this.cell3.style.top = value[5]
      }

      rotate() {
         if (this.isRotate == 0) {
             this.isRotate = 90
             this.style = ['0px', '0px', '0px', '20px', '40px', "60px"]
             this.elem.style.gridTemplateColumns = '1fr'
             this.elem.style.gridTemplateRows = '1fr 1fr 1fr 1fr'
             this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.height}`
             this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this._length}`
         } else if (this.isRotate == 90) {
             this.isRotate = 0
             this.style = ['20px', '40px', "60px", '0px', '0px', '0px']
             this.elem.style.gridTemplateRows = '1fr'
             this.elem.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'
             this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this._length}`
             this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart}`
             if (this.elem.style.gridColumnEnd > 25) {
                 this.elem.style.gridColumnStart = '21'
                 this.elem.style.gridColumnEnd = '25'
             }
         }
      }

      moveRight () {
        if (this.elem.style.gridColumnEnd <= 24 && !this.nextRight) {
            this.elem.style.gridColumnStart++
            this.elem.style.gridColumnEnd++
        }
      }

      moveLeft () {
        if (this.elem.style.gridColumnStart > 1 && !this.nextLeft) {
          this.elem.style.gridColumnStart--
          this.elem.style.gridColumnEnd--
        }
      }

      cellRowSet () {
        if (this.isRotate == 90) {
            this.cellRow = [this.currentPositionX - 5, this.currentPositionX - 4, this.currentPositionX - 3, this.currentPositionX - 2]
        } else {
            this.cellRow = [this.currentPositionX - 1, this.currentPositionX - 1, this.currentPositionX - 1, this.currentPositionX - 1]
        }
      }
}

class L extends Figure {

    //  0            90        180       270
    // [#]         [#][#]   [#][#][#]      [#]
    // [#][#][#]   [#]            [#]      [#]
    //             [#]                  [#][#]

    constructor() {
        super();
        this.length = 3
        this.height = 2
        this.elem.style.gridRowStart = '1'
        this.elem.style.gridRowEnd = '3'
        this.elem.style.gridColumnStart = '5'
        this.elem.style.gridColumnEnd = '8'
        this.elem.style.gridTemplateRows = '1fr 1fr'
        this.elem.style.gridTemplateColumns = '1fr 1fr 1fr'
        this.cell1.style.top = '18px'
        this.cell2.style.top = '18px'
        this.cell2.style.left = '0px'
        this.cell3.style.top = '18px'
        this.cell3.style.left = '36px'
    }

    matrixFill() {
        if (this.isRotate == 0) {
            matrix[this.currentPositionX-2].splice(+this.elem.style.gridColumnStart - 1, 3, 1, 1, 1)
            matrix[this.currentPositionX-3].splice(+this.elem.style.gridColumnStart - 1, 1, 1)
        } else if (this.isRotate == 90) {
            matrix[this.currentPositionX-4].splice(+this.elem.style.gridColumnStart - 1, 2, 1, 1)
            matrix[this.currentPositionX-3].splice(+this.elem.style.gridColumnStart - 1, 1, 1)
            matrix[this.currentPositionX-2].splice(+this.elem.style.gridColumnStart - 1, 1, 1)
        } else if (this.isRotate == 180) {
            matrix[this.currentPositionX-3].splice(+this.elem.style.gridColumnStart - 1, 3, 1, 1, 1)
            matrix[this.currentPositionX-2].splice(+this.elem.style.gridColumnStart + 1, 1, 1)
        } else if (this.isRotate == 270) {
            matrix[this.currentPositionX-4].splice(+this.elem.style.gridColumnStart, 1, 1)
            matrix[this.currentPositionX-3].splice(+this.elem.style.gridColumnStart, 1, 1)
            matrix[this.currentPositionX-2].splice(+this.elem.style.gridColumnStart - 1, 2, 1, 1)
        }
    }

    get nextPos () {
        if (this.isRotate == 0 || this.isRotate == 270) {
            return matrix[this.currentPositionX-1].slice(this.posY[0] - 1, this.posY[1] - 1).includes(1)
        } else  if (this.isRotate == 90) {
            return (matrix[this.currentPositionX-1][this.posY[0] - 1] === 1 || matrix[this.currentPositionX-3][this.posY[0]] === 1)
        } else {
            return (matrix[this.currentPositionX - 2].slice(this.posY[0] - 1, this.posY[1] - 2).includes(1) || matrix[this.currentPositionX-1][this.posY[1] - 2] === 1)
        }
    }

    set style(value) {
        this.cell2.style.top = value[0]
        this.cell2.style.left = value[1]
        this.cell3.style.top = value[2]
        this.cell3.style.left = value[3]
        this.cell1.style.left = value[4]
        this.cell0.style.left = value[5]
    }

    gridChanger(deg) {
        if (deg == 90 || deg == 270) {
            this.elem.style.gridTemplateRows = '1fr 1fr 1fr'
            this.elem.style.gridTemplateColumns = '1fr 1fr'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.height}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.length}`
        } else {
            this.elem.style.gridTemplateRows = '1fr 1fr'
            this.elem.style.gridTemplateColumns = '1fr 1fr 1fr'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.length}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.height}`
        }
    }

    rotate() {
        if (this.isRotate == 0) {
            this.isRotate = 90
            this.style = ['36px', '0px', '0px', '18px', '0px', '0px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 90) {
            this.isRotate = 180
            this.style = ['0px', '18px', '0px', '36px', '36px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 180) {
            this.isRotate = 270
            this.style = ['36px', '0px', '36px', '18px',  '18px', '18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 270) {
            this.isRotate = 0
            this.style = ['18px', '18px', '18px', '36px',  '0px', '0px']
            this.gridChanger(this.isRotate)
        }
    }

    cellRowSet () {
        if (this.isRotate == 90) {
            this.cellRow = [this.currentPositionX - 4, this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 4]
        } else if (this.isRotate == 180) {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 3, this.currentPositionX - 3]
        } else if (this.isRotate == 270) {
            this.cellRow = [this.currentPositionX - 4, this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 2]
        } else {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 2, this.currentPositionX - 2]
        }
    }

    get nextLeft() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 2][this.posY[0] - 2]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 2][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 3][this.posY[0] - 2]
        } else if (this.isRotate == 180) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 2][this.posY[0]]
        } else {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                   matrix[this.currentPositionX - 2][this.posY[0] - 1] ||
                   matrix[this.currentPositionX - 3][this.posY[0] - 1]
        }
    }

    get nextRight() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                   matrix[this.currentPositionX - 2][this.posY[1] - 3]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 2] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 1]
        } else if (this.isRotate == 180) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1]
        } else {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 1]
        }
    }

}

class L_reverse extends L {

    //       0           90         180        270
    //         [#]     [#]       [#][#][#]    [#][#]
    //   [#][#][#]     [#]       [#]             [#]
    //                 [#][#]                    [#]

    constructor() {
        super();
        this.cell3.style.left = '36px'
        this.cell0.style.left = '36px'
    }

    matrixFill() {
        if (this.isRotate == 0) {
            matrix[this.currentPositionX-2].splice(this.posY[0] - 1, 3, 1, 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0] + 1, 1, 1)
        } else if (this.isRotate == 90) {
            matrix[this.currentPositionX-4].splice(this.posY[0] - 1, 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0] - 1, 1, 1)
            matrix[this.currentPositionX-2].splice(this.posY[0] - 1, 2, 1, 1)
        } else if (this.isRotate == 180) {
            matrix[this.currentPositionX-3].splice(this.posY[0] - 1, 3, 1, 1, 1)
            matrix[this.currentPositionX-2].splice(this.posY[0] - 1, 1, 1)
        } else if (this.isRotate == 270) {
            matrix[this.currentPositionX-4].splice(this.posY[0] - 1, 2, 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0], 1, 1)
            matrix[this.currentPositionX-2].splice(this.posY[0], 1, 1)
        }
    }

    get nextPos () {
        if (this.isRotate == 0 || this.isRotate == 90) {
            return matrix[this.currentPositionX-1].slice(this.posY[0] - 1, this.posY[1] - 1).includes(1)
        } else  if (this.isRotate == 180) {
            return matrix[this.currentPositionX-1][this.posY[0] - 1] === 1
                || matrix[this.currentPositionX-2].slice(this.posY[0], this.posY[0] + 2).includes(1)
        } else {
            return matrix[this.currentPositionX-1][this.posY[0]] === 1
                || matrix[this.currentPositionX-3][this.posY[0] - 1] === 1
        }
    }

    set style(value) {
        this.cell0.style.left = value[0]
        this.cell1.style.left = value[1]
        this.cell2.style.left = value[2]
        this.cell2.style.top = value[3]
        this.cell3.style.top = value[4]
        this.cell3.style.left = value[5]
    }

    rotate() {
        if (this.isRotate == 0) {
            this.isRotate = 90
            this.style = ['0px', '0px', '0px', '36px', '36px', '18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 90) {
            this.isRotate = 180
            this.style = ['0px', '0px', '18px', '0px', '0px', '36px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 180) {
            this.isRotate = 270
            this.style = ['0px', '18px', '18px', '36px', '0px', '18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 270) {
            this.isRotate = 0
            this.style = ['36px', '0px', '18px', '18px',  '18px', '36px']
            this.gridChanger(this.isRotate)
        }
    }

    cellRowSet () {
        if (this.isRotate == 90) {
            this.cellRow = [this.currentPositionX - 4, this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 2]
        } else if (this.isRotate == 180) {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 3, this.currentPositionX - 3]
        } else if (this.isRotate == 270) {
            this.cellRow = [this.currentPositionX - 4, this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 4]
        } else {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 2, this.currentPositionX - 2]
        }
    }

    get nextLeft() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[0]]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 3][this.posY[0] - 2]
        } else if (this.isRotate == 180) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2]
        } else {
            return matrix[this.currentPositionX - 1][this.posY[0] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 1] ||
                matrix[this.currentPositionX - 3][this.posY[0] - 2]
        }
    }

    get nextRight() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 2] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 2]
        } else if (this.isRotate == 180) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 3] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1]
        } else {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 1]
        }
    }
}

class T extends L {

    //      0         90        180        270
    //
    //     [#]      [#]                     [#]
    //  [#][#][#]   [#][#]   [#][#][#]   [#][#]
    //              [#]         [#]         [#]

    constructor() {
        super();
        this.cell3.style.left = '36px'
        this.cell0.style.left = '18px'
        this.cell2.style.left = '0px'
    }

    set style (value) {
        this.cell1.style.left = value[0]
        this.cell0.style.left = value[1]
        this.cell3.style.top = value[2]
        this.cell2.style.left = value[3]
        this.cell1.style.top = value[4]
        this.cell2.style.top = value[5]
        this.cell3.style.left = value[6]
    }

    get nextPos() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX-1].slice(this.posY[0] - 1, this.posY[1] - 1).includes(1)
        } else if (this.isRotate === 90) {
            return (matrix[this.currentPositionX-1][this.posY[0] - 1] === 1
                   || matrix[this.currentPositionX-2][this.posY[0]] === 1)
        } else if (this.isRotate == 180) {
            return matrix[this.currentPositionX-2][this.posY[0] - 1] === 1
            || matrix[this.currentPositionX-1][this.posY[0]] === 1
            || matrix[this.currentPositionX-2][this.posY[0] + 1] === 1
        } else {
            return matrix[this.currentPositionX-2][this.posY[0] - 1] === 1
                || matrix[this.currentPositionX-1][this.posY[0]] === 1
        }
    }

    matrixFill() {
        if (this.isRotate == 0) {
            matrix[this.currentPositionX-2].splice(this.posY[0] - 1, 3, 1, 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0], 1, 1)
        } else if (this.isRotate == 90) {
            matrix[this.currentPositionX-2].splice(this.posY[0] - 1, 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0] - 1, 2, 1, 1)
            matrix[this.currentPositionX-4].splice(this.posY[0] - 1, 1, 1)
        } else if (this.isRotate == 180) {
            matrix[this.currentPositionX-2].splice(this.posY[0], 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0] - 1, 3, 1, 1, 1)
        } else {
            matrix[this.currentPositionX-2].splice(this.posY[0], 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0] - 1, 2, 1, 1)
            matrix[this.currentPositionX-4].splice(this.posY[0], 1, 1)
        }
    }

    rotate() {
        if (this.isRotate == 0) {
            this.isRotate = 90
            this.style = ['0px', '0px', '18px', '0px', '18px', '36px', '18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 90) {
            this.isRotate = 180
            this.style = ['18px', '0px', '18px', '36px', '0px', '0px', '18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 180) {
            this.isRotate = 270
            this.style = ['18px', '18px', '18px', '18px',  '18px', '36px', '0px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 270) {
            this.isRotate = 0
            this.style = ['18px', '18px', '18px', '0px', '18px', '18px', '36px']
            this.gridChanger(this.isRotate)
        }
    }

    // Set current row for each cell in figure
    cellRowSet () {
        if (this.isRotate == 90) {
            this.cellRow = [this.currentPositionX - 4, this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 3]
        } else if (this.isRotate == 180) {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 3, this.currentPositionX - 3, this.currentPositionX - 2]
        } else if (this.isRotate == 270) {
            this.cellRow = [this.currentPositionX - 4, this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 3]
        } else {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 2, this.currentPositionX - 2]
        }
    }

    // Get next left position of figure
    get nextLeft() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 1]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 3][this.posY[0] - 2]
        } else if (this.isRotate == 180) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2]
        } else {
            return matrix[this.currentPositionX - 1][this.posY[0] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 3][this.posY[0] - 1]
        }
    }

    // Get next right position of figure
    get nextRight() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 2]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 2]
        } else if (this.isRotate == 180) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1]
        } else {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 1]
        }
    }
}

class S extends T {

    //    [#][#]   [#]
    // [#][#]      [#][#]
    //                [#]

    constructor() {
        super();
        this.elem.style.gridRowEnd = '3'
        this.cell2.style.top = '18px'
        this.cell3.style.top = '0px'
    }

    set style (value) {
        this.cell2.style.top = value[0]
        this.cell0.style.left = value[1]
        this.cell3.style.left = value[2]
        this.cell3.style.top = value[3]
        this.cell0.style.top = value[4]
    }

    get nextPos() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1].slice(this.posY[0] - 1, this.posY[0] + 1).includes(1)
            || matrix[this.currentPositionX - 2][this.posY[0] + 1] === 1
        } else {
            return matrix[this.currentPositionX - 1][this.posY[0]] === 1
            || matrix[this.currentPositionX - 2][this.posY[0] - 1] === 1
        }
    }

    matrixFill() {
        if (this.isRotate == 90) {
            matrix[this.currentPositionX - 2][this.posY[0]] = 1
            matrix[this.currentPositionX - 3].splice(this.posY[0] - 1, 2, 1, 1)
            matrix[this.currentPositionX - 4][this.posY[0] - 1] = 1
        } else if (this.isRotate == 0) {
            matrix[this.currentPositionX-2].splice(this.posY[0] - 1, 2, 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0], 2, 1, 1)
        }
    }

    rotate() {
        if (this.isRotate == 0) {
            this.isRotate = 90
            this.style = ["18px", "18px", "0px", "0px", '36px']
            this.elem.style.flexDirection = 'column'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.height}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.length}`
        } else {
            this.isRotate = 0
            this.style = ["18px", "18px", "36px", "0px", '0px']
            this.elem.style.flexDirection = 'row'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.length}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.height}`
        }
    }

    cellRowSet () {
        if (this.isRotate == 90) {
            this.cellRow = [this.currentPositionX - 2, this.currentPositionX - 3, this.currentPositionX - 3, this.currentPositionX - 4]
        } else {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 2, this.currentPositionX - 3]
        }
    }

    get nextLeft() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 1]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 3][this.posY[0] - 2]
        }
    }

    get nextRight() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 2]
        }
    }
}

class S_reverse extends S {
    //  2  0
    // [#][#]
    //    [#][#]
    //     1  3

    //     3
    //  2 [#]
    // [#][#]
    // [#] 1
    //  0

    constructor() {
        super()
        this.cell2.style.top = '0px'
        this.cell3.style.top = '18px'
    }

    get nextPos() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1].slice(this.posY[0], this.posY[0] + 2).includes(1)
                || matrix[this.currentPositionX - 2][this.posY[0] - 1] === 1
        } else {
            return matrix[this.currentPositionX - 1][this.posY[0] - 1] === 1
                || matrix[this.currentPositionX - 2][this.posY[0]] === 1
        }
    }

    matrixFill() {
        if (this.isRotate == 90) {
            matrix[this.currentPositionX - 2][this.posY[0] - 1] = 1
            matrix[this.currentPositionX - 3].splice(this.posY[0] - 1, 2, 1, 1)
            matrix[this.currentPositionX - 4][this.posY[0]] = 1
        } else if (this.isRotate == 0) {
            matrix[this.currentPositionX-2].splice(this.posY[0], 2, 1, 1)
            matrix[this.currentPositionX-3].splice(this.posY[0] - 1, 2, 1, 1)
        }
    }

    rotate() {
        if (this.isRotate == 0) {
            this.isRotate = 90
            this.style = ["18px", "0px", "18px", "0px", '36px']
            this.elem.style.flexDirection = 'column'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.height}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.length}`
        } else {
            this.isRotate = 0
            this.style = ['0px', '18px', '36px', '18px', "0px"]
            this.elem.style.flexDirection = 'row'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.length}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.height}`
        }
    }

    cellRowSet () {
        if (this.isRotate == 90) {
            this.cellRow = [this.currentPositionX - 2, this.currentPositionX - 3, this.currentPositionX - 3, this.currentPositionX - 4]
        } else {
            this.cellRow = [this.currentPositionX - 3, this.currentPositionX - 2, this.currentPositionX - 3, this.currentPositionX - 2]
        }
    }

    get nextLeft() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[0] - 2] ||
                matrix[this.currentPositionX - 3][this.posY[0] - 1]
        }
    }

    get nextRight() {
        if (this.isRotate == 0) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 2]
        } else if (this.isRotate == 90) {
            return matrix[this.currentPositionX - 1][this.posY[1] - 2] ||
                matrix[this.currentPositionX - 2][this.posY[1] - 1] ||
                matrix[this.currentPositionX - 3][this.posY[1] - 1]
        }
    }
}

let figures = [Figure, T, L, S, S_reverse, L_reverse]

// Start game
function init(index) {
    arr.unshift(new Figure())
    //arr.unshift(new figures[Math.floor(Math.random() * figures.length)]())
    arr[index].isMove = true
    arr[index].createFigure()
    if (arr[index].isMove) {
        if (level < 12) {
            level = Math.floor(score / 1000)
            if (timeout > 20) {
                timeout = (15 - level) * 10
                levelElement.textContent = level
            }
        }
        timer = setInterval(() => arr[index].moveDown(), timeout)
        clear()
    }
}

function handler(event) {

    if (event.code == 'ArrowLeft' && !pause) {
        arr[index].moveLeft()
    } else if (event.code == 'ArrowRight'  && !pause) {
        arr[index].moveRight()
    } else if (!pause && event.code == 'ArrowDown' && !event.repeat) {
        clearInterval(timer)
        timer = setInterval(() => arr[index].moveDown(),20)
    } else if (!pause && event.code == 'Space' && !event.repeat) {
        arr[index].rotate()
        sound.play()
    } else if (event.code == 'ArrowUp' && !event.repeat) {
        if (!pause) {
            pause = true
            clearInterval(timer)
            pauseBlink = setInterval(() => {
                if (pauseElement.style.opacity == '0.1') {
                    pauseElement.style.opacity = 1
                } else {
                    pauseElement.style.opacity = 0.1
                }
            }, 500)
        } else {
            pause = false
            pauseElement.style.opacity = 0.1
            clearInterval(pauseBlink)
            clearInterval(timer)
            timer = setInterval(() => arr[index].moveDown(),timeout)
        }
    }
}

function handlerUp(event) {
    if (!pause && event.code == 'ArrowDown') {
        clearInterval(timer)
        timer = setInterval(() => arr[index].moveDown(),timeout)
    }
}

function fullRowHandler() {
    let cells = document.getElementsByClassName('figure-cell')
    let fullRow = false
    for (let i of matrix) {
        if (matrix.indexOf(i) != matrix.length - 1 && i.toString() == matrix[matrix.length - 1].toString()) {

            score += 100
            countElement.textContent = `${score}`
            sound3.play()

            for (let a of cells) {
                if (a.getAttribute('row') == matrix.indexOf(i)) {
                    a.style.transition = 'opacity 500ms'
                    a.style.opacity = '0'
                    setTimeout(() => a.remove = 'none', 500)
                } else if (a.getAttribute('row') < matrix.indexOf(i)) {
                    let row = a.getAttribute('row')
                    let translate = +a.style.transform.substr(11, a.style.transform.length - 14)
                    translate += 22
                    a.style.transition = 'transform 500ms'
                    a.style.transform = 'translateY(' + `${translate.toString()}` + 'px)'
                    row++
                    a.setAttribute('row', `${row}`)
                }
            }

            for (let b = matrix.indexOf(i); b > matrix.lastIndexOf(matrix[0]); b--) {
                matrix[b] = matrix[b - 1]
            }

            console.log(matrix)

        } else {
            fullRow = false
        }
    }

    if (fullRow === true) {
        setTimeout(() => init(index), 1000)
    } else {
        init(index)
    }
}

function clear() {
   for (let i of arr) {
       if (Array.from(i.elem.children).every((element) => element.remove === 'none')) {
           i.elem.remove()
           arr.splice(arr.indexOf(i), 1)
       }
   }
}

function restart () {
    clearInterval(timer)
    clearInterval(pauseBlink)
    pause = false
    pauseElement.style.opacity = 0.1
    arr = []
    index = 0
    score = 0
    countElement.textContent = `${score}`
    level = 1
    levelElement.textContent = level
    timeout = 150
    pause = false
    let figures = document.querySelectorAll('.figure')
    for (let i = 0; i < figures.length; i++) {
        figures[i].remove()
    }
    setTimeout(() => init(index), 1000)
    for (let i of matrix) {
        if (matrix.indexOf(i) != matrix.length - 1)
        i.fill(0)
    }
}

console.log(arr)

document.addEventListener("DOMContentLoaded",() => init(index))

window.addEventListener('keydown',  handler)
window.addEventListener('keyup',  handlerUp)

var matrix = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]