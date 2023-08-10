let main = document.querySelector('.main')

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
        this.elem.setAttribute('id',`${index}`)
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
        this.cell1.style.left = '18px'
        this.cell2.style.left = '36px'
        this.cell3.style.left = '54px'
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
            } else {
            this.isMove = false
            clearInterval(timer)
            this.matrixFill()
            this.cellRowSet()
            fullRowHandler()
            index++
            init(index)
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
             this.style = ['0px', '0px', '0px', '18px', '36px', "54px"]
             this.elem.style.gridTemplateColumns = '1fr'
             this.elem.style.gridTemplateRows = '1fr 1fr 1fr 1fr'
             this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.height}`
             this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this._length}`
         } else if (this.isRotate == 90) {
             this.isRotate = 0
             this.style = ['18px', '36px', "54px", '0px', '0px', '0px']
             this.elem.style.gridTemplateRows = '1fr'
             this.elem.style.gridTemplateColumns = '1fr 1fr 1fr 1fr'
             this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this._length}`
             this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart}`
         }
      }

      moveRight () {
          this.elem.style.gridColumnStart++
          this.elem.style.gridColumnEnd++
      }

      moveLeft () {
          this.elem.style.gridColumnStart--
          this.elem.style.gridColumnEnd--
      }

      cellRowSet () {
        if (this.isRotate == 90) {
            this.cellRow = [this.currentPositionX - 1, this.currentPositionX - 1, this.currentPositionX - 1, this.currentPositionX - 1]
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
        this.cell2.style.left = '18px'
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
            this.style = ['36px', '0px', '0px', '18px']
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

}

class L_reverse extends L {

    //       0           90         180        270
    //         [#]     [#]       [#][#][#]    [#][#]
    //   [#][#][#]     [#]       [#]             [#]
    //                 [#][#]                    [#]

    constructor() {
        super();
        this.cell3.style.left = '36px'
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
        this.cell3.style.left = value[3]
        this.cell3.style.top = value[4]
        this.cell0.style.top = value[5]
        this.cell1.style.top = value[6]
    }

    rotate() {
        if (this.isRotate == 0) {
            this.isRotate = 90
            this.style = ['-18px', '-18px', '-18px', '18px', '36px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 90) {
            this.isRotate = 180
            this.style = ['0px', '0px', '-36px', '36px', '0px', '-18px', '-18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 180) {
            this.isRotate = 270
            this.style = ['0px', '0px', '0px', '0px',  '0px', '0px', '0px', '0px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 270) {
            this.isRotate = 0
            this.style = ['0px', '0px', '0px', '36px',  '0px', '0px']
            this.gridChanger(this.isRotate)
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

    setCellRow() {
        if (this.isRotate == 0) {
            this.cellRow = [this.currentPositionX-2, this.currentPositionX-2 ,this.currentPositionX-2, this.currentPositionX-3]
        }
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
            this.style = ['-18px', '-18px', '18px', '-18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 90) {
            this.isRotate = 180
            this.style = ['18px', '18px', '0px', '-36px', '-18px', '-18px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 180) {
            this.isRotate = 270
            this.style = ['0px', '0px', '18px', '0px', '0px', '0px', '0px']
            this.gridChanger(this.isRotate)
        } else if (this.isRotate == 270) {
            this.isRotate = 0
            this.style = ['0px', '0px', '0px', '0px',  '0px', '0px', '18px']
            this.gridChanger(this.isRotate)
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
        this.cell2.style.bottom = '18px'
    }

    set style (value) {
        this.cell2.style.bottom = value[0]
        this.cell0.style.left = value[1]
        this.cell3.style.left = value[2]
        this.cell3.style.top = value[3]
        this.cell0.style.bottom = value[4]
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
            this.style = ["0px", "-18px", "0px", "18px"]
            this.elem.style.flexDirection = 'column'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.height}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.length}`
        } else {
            this.isRotate = 0
            this.style = ['18px', '0px', '18px', '0px']
            this.elem.style.flexDirection = 'row'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.length}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.height}`
        }
    }
}

class S_reverse extends S {

    // [#][#]
    //    [#][#]

    //    [#]
    // [#][#]
    // [#]

    constructor() {
        super();
        this.cell0.style.bottom = '18px'
        this.cell2.style.bottom = '0px'
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
            this.style = ["36px", "-18px", "0px", "18px", '-36px']
            this.elem.style.flexDirection = 'column'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.height}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.length}`
        } else {
            this.isRotate = 0
            this.style = ['0px', '0px', '18px', '0px', "18px"]
            this.elem.style.flexDirection = 'row'
            this.elem.style.gridColumnEnd = `${+this.elem.style.gridColumnStart + this.length}`
            this.elem.style.gridRowEnd = `${+this.elem.style.gridRowStart + this.height}`
        }
    }
}

let figures = [Figure, T, L, S, S_reverse, L_reverse]

let arr = []
let timer
let index = 0

let timeout = 200

function init(index) {
    arr.push(new Figure())
    //arr.push(new figures[Math.floor(Math.random() * figures.length)]())
    arr[index].isMove = true
    arr[index].createFigure()
    if (arr[index].isMove) {
        timer = setInterval(() => arr[index].moveDown(), timeout)
        console.log(arr)
        console.log(matrix)
    }
}

function fullRowHandler() {
    // for (let i of matrix) {
    //     if (matrix.indexOf(i) != matrix.length - 1 && i.toString() == matrix[matrix.length - 1].toString()) {
    //
    //     } else {
    //         console.log(':(')
    //     }
    // }
    for (let i of document.getElementsByClassName('figure-cell')) {
        console.log(i.getAttribute('row'))
    }
}

document.addEventListener("DOMContentLoaded",() => init(index))

let field = document.getElementsByClassName('main')

window.addEventListener('keydown', handler)

function handler(event) {
    let target = document.getElementById(`${index}`)
    if (event.code == 'ArrowLeft') {
        arr[index].moveLeft()
    } else if (event.code == 'ArrowRight') {
        arr[index].moveRight()
    } else if (event.code == 'ArrowDown') {
        timeout = 20
        console.log('Boost!')
    } else if (event.code == 'Space') {
        arr[index].rotate()
    }
}

console.log(matrix)

var matrix = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]


