var user0;
var user1;
var userTurn = false // if it false user 'A' will play otherwise user 'B'


window.addEventListener('load', function () {
    renderUserInputForm()
    // Container
    var container = document.getElementById('container')
    container.addEventListener('click', selectAndMove)
})

function renderUserInputForm() {
    var cont = document.getElementById('container')
    cont.innerHTML = ""

    var h2 = document.createElement('h2')
    h2.textContent = 'Enter players name'

    var form = document.createElement('div')
    form.id = 'form'

    var usr0Input = document.createElement('input')
    usr0Input.placeholder = 'First Player name'
    var usr1Input = document.createElement('input')
    usr1Input.placeholder = 'Second Player name'


    var btn = document.createElement('button')
    btn.textContent = 'Play'
    btn.addEventListener('click', play)
    form.append(usr0Input, usr1Input, btn)
    cont.append(form)
}

function play() {
    var usr0Input = document.querySelector('input').value
    var usr1Input = document.querySelector('input + input').value

    if (usr0Input && usr1Input) {
        user0 = usr0Input
        user1 = usr1Input
        document.getElementById('container').innerHTML = ""
        RenderBoard()
        renderUserPanel()
    }
}

var currBoard = [
    [4, 2, 3, 6, 5, 3, 2, 4],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [-4, -2, -3, -6, -5, -3, -2, -4],
]

var defeated = [
    [], // user 0
    [], // user 1
]

function RenderBoard() {
    var target = document.getElementById('container')

    var board = document.createElement('div')
    board.id = 'board'
    board.className = 'board'

    var j = 2
    for (var i = 1; i <= 64; i++) {
        var square = document.createElement('div')
        square.id = String(i - 1)
        if (j == i) {
            square.className = 'black-col'
        }
        if (i % 8 == 0) {
            j++
        } else if (j == i) {
            j += 2
        }
        board.append(square)
    }
    target.append(board)
    RenderGame()
}

function RenderGame() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var target = document.getElementById(String(i * 8 + j))
            target.innerHTML = numToIcon(currBoard[i][j])
        }
    }
}

function numToIcon(num) {
    switch (num) {
        case 0:
            return ''
        case 1:
            return '&#9817'
        case -1:
            return '&#9823'
        case 2:
            return '&#9816'
        case -2:
            return '&#9822'
        case 3:
            return '&#9815'
        case -3:
            return '&#9821'
        case 4:
            return '&#9814'
        case -4:
            return '&#9820'
        case 5:
            return '&#9813'
        case -5:
            return '&#9819'
        case 6:
            return '&#9812'
        case -6:
            return '&#9818'
    }

}

// Select and move
var selectedId = -1

function selectAndMove() {
    var target = event.target
    var id = Number(target.id)

    // Number on that div
    var char = currBoard[Math.floor(id / 8)][id % 8]

    if (selectedId != -1) {
        //  Remove Color 
        document.getElementById(selectedId).style.backgroundColor = ''
    }

    if (selectedId != -1 && isValidMove(id) && id <= 64) {

        // Replace target with selected
        currBoard[Math.floor(id / 8)][id % 8] = currBoard[Math.floor(selectedId / 8)][selectedId % 8]
        // Make selected to 0
        currBoard[Math.floor(selectedId / 8)][selectedId % 8] = 0

        // Change User Turn
        userTurn = !userTurn

        // Render
        RenderGame()
        renderTurn()
    }

    else if ((char > 0 && userTurn) || (char < 0 && !userTurn)) {
        selectedId = id
        // Add color to elem
        document.getElementById(selectedId).style.backgroundColor = 'cyan'
    }

    else {
        selectedId = -1
    }
}

function isValidMove(id) {
    var selected = currBoard[Math.floor(selectedId / 8)][selectedId % 8]
    var targetId = id
    var target = currBoard[Math.floor(targetId / 8)][targetId % 8]
    // give id of where it should be moved it will move selected to that id
    if (Math.abs(selected) == 1) {
        // Check for pawn
        return isValidMoveForPawn(selected, targetId, target) && canKill(target, selected)
    }

    else if (Math.abs(selected) == 3) {
        // check for Bishoph
        return isValidMoveForBishop(id) && canKill(target, selected)
    }

    else if (Math.abs(selected) == 4) {
        return isValidMoveForRock(id) && canKill(target, selected)
    }

    else if (Math.abs(selected) == 5) {
        // Check for Queen
        return (isValidMoveForBishop(id) || isValidMoveForRock(id)) && canKill(target, selected)
    }

    else if (Math.abs(selected) == 2) {
        // Check for Knight
        return isValidMoveForKnight(id) && canKill(target, selected)
    }

    else if (Math.abs(selected) == 6) {
        return isValidMoveForKing(id) && canKill(target, selected)
    }
}

function isValidMoveForPawn(selected, targetId, target) {
    var row = Math.floor(selectedId / 8)
    var diff = targetId - selectedId


    var temp = false
    if ((row == 1 && selected == 1) || (row == 6 && selected == -1)) {
        //  if pawn is on its original position
        var temp = true
    }
    if (diff == 8 * selected && target == 0) {
        // Pawn can move forward
        return true
    } else if (temp && Math.abs(targetId - 16 * selected) == selectedId) {
        // if pawn is on his original position so it can crow one row directly
        return true
    }

    // Pawn can special kill
    if ((diff * selected == 7 || diff * selected == 9) && target != 0) {
        return true
    }
    return false

}

function isValidMoveForBishop(targetId) {
    var mx = Math.max(targetId, selectedId)
    var mn = Math.min(targetId, selectedId)
    var diff = mx - mn

    var cnt = 0
    if (diff % 7 == 0) {
        cnt = 7
    } else if (diff % 9 == 0) {
        cnt = 9
    }

    if (cnt == 0) {
        return false
    }

    for (var i = mn + cnt; i < mx; i += cnt) {
        if (currBoard[Math.floor(i / 8)][i % 8] != 0) {
            return false
        }
    }
    return true
}

function isValidMoveForRock(targetId) {
    var mn = Math.min(targetId, selectedId)
    var mx = Math.max(targetId, selectedId)
    var row = Math.floor(selectedId / 8)
    var diff = mx - mn
    // Rock

    // Row
    if (diff % 8 == 0) {
        for (var i = mn + 8; i < mx; i += 8) {
            if (currBoard[Math.floor(i / 8)][i % 8] != 0) {
                return false
            }
        }
        return true
    } else if ((row * 8) <= targetId && targetId <= (row * 8 + 7)) {
        // Check for Column
        for (var i = mn + 1; i < mx; i++) {
            if (currBoard[Math.floor(i / 8)][i % 8] != 0) {
                return false
            }
        }
        return true
    }

}

function isValidMoveForKnight(targetId) {
    // For knight
    var diff = Math.abs(selectedId - targetId)
    var moves = [17, 15, 6, 10]

    if (moves.includes(diff)) {
        return true
    }
}

function isValidMoveForKing(targetId) {
    var diff = selectedId - targetId
    var row = Math.floor(selectedId / 8)
    if ((row * 8) <= targetId && targetId <= (row * 8 + 7)) {
        // if in the same row
        if (Math.abs(diff) == 1) {
            return true
        }
    }
    if ([7, 8, 9].includes(Math.abs(diff))) {
        return true
    }
}

function canKill(a, b) {
    if ((a >= 0 && b <= 0) || (a <= 0 && b >= 0)) {
        if (Math.abs(a) == 6) {
            won()
        }
        // if diff group
        if (a > 0) {
            defeated[1].push(a)
        } else if (a < 0) {
            defeated[0].push(a)
        }

        if (a != 0) {
            renderUserPanel()
        }

        return true
    }
    // other can kill
    return false

}

function won() {
    if (!userTurn) {
        alert(user0 + ' won')
    } else {
        alert(user1 + ' won')
    }
    window.location.reload()
}

function createUserBox(id, name) {
    var div = document.createElement('div')

    var h2 = document.createElement('h2')
    if (id == 0) {
        h2.innerHTML = name + " " + numToIcon(-4)
    }
    else {
        h2.innerHTML = name + " " + numToIcon(4)
    }
    h2.style.fontSize = '25px'

    var p = document.createElement('p')
    p.id = 'usrTurn' + id
    p.textContent = "It's " + 'your' + ' turn'

    div.append(h2, p)
    // Defeated TAble

    if (defeated[id].length > 0) {
        var defetedDiv = document.createElement('div')
        var h3 = document.createElement('h3')
        h3.textContent = 'Defeated Players'

        var defeted_grid = document.createElement('div')
        defeted_grid.setAttribute('class', 'defeted')
        for (var i = 0; i < defeated[id].length; i++) {
            var elem = document.createElement('div')
            elem.innerHTML = numToIcon(defeated[id][i])
            defeted_grid.append(elem)
        }
        defetedDiv.append(h3, defeted_grid)
        div.append(defetedDiv)
    }
    return div
}

function renderUserPanel() {
    var box0 = createUserBox(0, user0)
    var box1 = createUserBox(1, user1)

    var usr0 = document.getElementById('user0')
    usr0.innerHTML = ""
    usr0.style.border = '1px solid black'
    usr0.append(box0)

    var usr1 = document.getElementById('user1')
    usr1.innerHTML = ""
    usr1.style.border = '1px solid black'
    usr1.append(box1)

    renderTurn()
}

function renderTurn() {
    var usr0Flag = document.getElementById('usrTurn0')
    var usr1Flag = document.getElementById('usrTurn1')
    if (!userTurn) {
        usr1Flag.style.visibility = 'hidden'
        usr0Flag.style.visibility = 'visible'
    } else {
        usr0Flag.style.visibility = 'hidden'
        usr1Flag.style.visibility = 'visible'
    }
}