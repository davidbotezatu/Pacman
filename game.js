document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 28;
    const board = [];
    let score = 0;

    /*
    Grid layout:
    0 - dots
    1 - walls
    2 - ghost start area
    3 - powerup
    4 - empty (area for pacman to move)
    50 - portals
    */
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,4,4,4,4,4,
        4,4,4,4,4,1,0,1,1,0,1,1,1,2,2,1,1,1,0,1,1,0,1,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,0,1,2,2,2,2,2,2,1,0,1,1,0,1,1,1,1,1,1,
        50,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,50,
        1,1,1,1,1,1,0,1,1,0,1,2,2,2,2,2,2,1,0,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,3,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,3,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ]

    //draw the game board (the grid) and populate it with the dots and powerups
    function gameBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div')
            grid.appendChild(square)
            board.push(square)

            switch (layout[i]) {
                case 0:
                    board[i].classList.add('dot')
                    break
                case 1:
                    board[i].classList.add('wall')
                    break
                case 2:
                    board[i].classList.add('ghost-zone')
                    break
                case 3:
                    board[i].classList.add('powerup')
                    break
                case 4:
                    board[i].classList.add('free')
                    break
                case 50:
                    board[i].classList.add('portal')
                    break
            }
        }
    }
    gameBoard()

    //put pacman on the board
    let pacmanPos = 490
    board[pacmanPos].classList.add('pacman')

    //let's make pacman move :)
    function movePacman(i) {
        board[pacmanPos].classList.remove('pacman')

        switch (i.keyCode) {
            //key left
            case 37:
                if(pacmanPos % width !== 0 &&
                    !board[pacmanPos - 1].classList.contains('wall'))
                    pacmanPos -= 1

                //verify if pacman is in the position to teleport on the right side of the board
                if(board[pacmanPos].classList.contains('portal')) {
                    pacmanPos = 390
                }

                break
            //key up
            case 38:
                if(pacmanPos - width >= 0 &&
                    !board[pacmanPos - width].classList.contains('wall'))
                    pacmanPos -= width
                break

            //key right
            case 39:
                if(pacmanPos % width < width - 1 &&
                    !board[pacmanPos + 1].classList.contains('wall'))
                    pacmanPos += 1

                //verify if pacman is in the position to teleport on the left side of the board
                if(board[pacmanPos].classList.contains('portal')) {
                    pacmanPos = 365
                }

                break

            //key down
            case 40:
                if(pacmanPos + width < width * width &&
                    !board[pacmanPos + width].classList.contains('wall'))
                    pacmanPos += width
                break
        }
        board[pacmanPos].classList.add('pacman')

        eatDot()
        eatPowerup()
        checkForGameOver()
        checkForGameWon()
    }
    document.addEventListener('keydown', movePacman)

    //eat dots - destroy the element, and add points to the score
    function eatDot() {
        if (board[pacmanPos].classList.contains('dot')) {
            score += 10
            scoreDisplay.innerHTML = score
            board[pacmanPos].classList.remove('dot')
        }
    }

    //create the ghost template
    class Ghost {
        constructor(name, pos, speed) {
            this.name = name
            this.pos = pos
            this.speed = speed
            this.timerId = NaN
            this.isVulnerable = false
        }
    }

    //create ghosts
    ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
    ]

    //draw ghosts on the board
    ghosts.forEach(ghost => {
        board[ghost.pos].classList.add(ghost.name)
        board[ghost.pos].classList.add('ghost')
    })

    //let's make the ghosts move
    ghosts.forEach(ghost => moveGhost(ghost))
    function moveGhost(ghost) {
        const directions = [-1, +1, +width, -width]
        let direction = directions[Math.floor(Math.random() * directions.length)]

        ghost.timerId = setInterval(function () {
            if (!board[ghost.pos + direction].classList.contains('wall') &&
                !board[ghost.pos + direction].classList.contains('ghost')) {
                board[ghost.pos].classList.remove(ghost.name, 'ghost', 'vulnerable-ghost')
                ghost.pos += direction
                board[ghost.pos].classList.add(ghost.name, 'ghost')
            } else {
                direction = directions[Math.floor(Math.random() * directions.length)]
            }

            if (ghost.isVulnerable)
                board[ghost.pos].classList.add('vulnerable-ghost')

            if (ghost.isVulnerable && board[ghost.pos].classList.contains('pacman')) {
                board[ghost.pos].classList.remove(ghost.name, 'ghost', 'vulnerable-ghost')
                ghost.pos = 406
                score += 100
                scoreDisplay.innerHTML = score
                board[ghost.pos].classList.add(ghost.name, 'ghost')
            }
            checkForGameOver()
        }, ghost.speed)
    }

    //eat powerups, kill the ghosts and add points to the score
    function eatPowerup() {
        if (board[pacmanPos].classList.contains('powerup')) {
            score += 50
            scoreDisplay.innerHTML = score
            board[pacmanPos].classList.remove('powerup')

            ghosts.forEach(ghost => ghost.isVulnerable = true)
            setTimeout(invulnerableGhosts, 10000)
        }
    }

    //make the ghosts invulnerable after powerup time ends
    function invulnerableGhosts() {
        ghosts.forEach(ghost => ghost.isVulnerable = false)
    }

    //check conditions for game over
    function checkForGameOver() {
        if (board[pacmanPos].classList.contains('ghost') &&
        !board[pacmanPos].classList.contains('vulnerable-ghost')) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', movePacman)
            setTimeout(function (){
                alert("Game Over!");
                location.reload();
                }, 500)
        }
    }

    //check conditions for winning the game
    function checkForGameWon() {
        if (score === 2950) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', movePacman)
            setTimeout(function (){
                alert("You have won!");
                location.reload();
            }, 500)
        }
    }
})