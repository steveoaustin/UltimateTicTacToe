window.onload = (function () {
    // game variables
    var flip = { 'x': 'o', 'o': 'x' }
    var boardR = 1
    var boardC = 1
    var board = initalizeBoard()
    var winners = initializeWinners()
    var centers = initializeCenters()

    var lastCall = 0
    // graphics variables
    var lineColor = "black";
    var SIZE = 66
    var canvas = document.getElementById('board');
    var context = canvas.getContext('2d');
    var turn = 'x'
    var canvasSize = 600;
    var sectionSize = canvasSize / 3;
    var squareSize = Math.floor(sectionSize / 3)
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    // add sligth blur
    context.translate(0.5, 0.5);
    //draw initial lines
    updateLines();
    // activate reset button
    document.getElementById("clear").onclick = reset;

    var message = document.getElementById("winner");
    message.innerHTML = ""
    var text = "It's your turn!"
    message.appendChild(document.createTextNode(text))

    function reset() {
        var message = document.getElementById("winner");
        turn = 'x'
        message.innerHTML = ""
        context.clearRect(0, 0, canvas.width, canvas.height);
        boardR = 1
        boardC = 1
        board = initalizeBoard()
        winners = initializeWinners()
        lastCall = 0
        updateLines();
    }

    // draw the initial board
    function updateLines() {
        drawLines(8, lineColor, 4, canvasSize - 10, sectionSize, 0, 0);
        for (var i = 0; i <= 2; i++) {
            for (var j = 0; j <= 2; j++) {
                // highlight current board
                if (j == boardR && i == boardC) {
                    drawLines(5, lineColor, 10, (canvasSize / 3) - 20, sectionSize / 3, i, j, "#861bc4");
                } else {
                    drawLines(5, lineColor, 10, (canvasSize / 3) - 20, sectionSize / 3, i, j, "black");
                }
            }
        }
    }

    function drawLines(lineWidth, strokeStyle, lineStart, lineLength, size, r, c, color) {
        var lineStartX = lineStart + r * canvasSize / 3;
        var lineStartY = lineStart + c * canvasSize / 3;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.strokeStyle = strokeStyle;
        context.beginPath();
        context.strokeStyle = color;

        // Horizontal lines 
        for (var y = 1; y <= 2; y++) {
            context.moveTo(lineStartX, y * size + c * canvasSize / 3);
            context.lineTo(lineLength + lineStartX, y * size + c * canvasSize / 3);
        }

        // Vertical lines 
        for (var x = 1; x <= 2; x++) {
            context.moveTo(x * size + r * canvasSize / 3, lineStartY);
            context.lineTo(x * size + r * canvasSize / 3, lineLength + lineStartY);
        }

        context.stroke();
    }

    function drawWinnerLine(r, c, section) {
        var offset = 5
        var points = getWinnerPoints(section);
        var startR = points[0][0]
        var startC = points[0][1]
        var endR = points[1][0]
        var endC = points[1][1]
        var agent = section[startR][startC]
        var color = "#01bBC2"
        if (agent == 'x')
            color = "#f1be32";
        context.lineWidth = 10
        context.lineCap = 'round'
        context.beginPath()
        var point = centers[r * 3 + startR][c * 3 + startC]
        var endPoint = centers[r * 3 + endR][c * 3 + endC]
        context.moveTo(point[1], point[0])
        context.lineTo(endPoint[1], endPoint[0])
        context.stroke();
    }

    function drawO(xCordinate, yCordinate, r, c) {
        var halfSectionSize = (0.5 * squareSize);
        var centerX = xCordinate + halfSectionSize + r;
        var centerY = yCordinate + halfSectionSize + c;
        var radius = (squareSize - 20) / 2;
        var startAngle = 0 * Math.PI;
        var endAngle = 2 * Math.PI;

        context.lineWidth = 5;
        context.strokeStyle = "#01bBC2";
        context.beginPath();
        context.arc(centerX, centerY, radius, startAngle, endAngle);
        context.stroke();
    }

    function drawX(xCordinate, yCordinate, r, c) {
        context.strokeStyle = "#f1be32";

        context.beginPath();

        var offset = 15;
        context.moveTo(xCordinate + offset + r, yCordinate + offset + c);
        context.lineTo(xCordinate + squareSize - offset + r, yCordinate + squareSize - offset + c);

        context.moveTo(xCordinate + offset + r, yCordinate + squareSize - offset + c);
        context.lineTo(xCordinate + squareSize - offset + r, yCordinate + offset + c);

        context.stroke();
    }

    function getCanvasMousePosition(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    function getValue(board, agent) {
        for (var r = 0; r < 3; r++) {
            if (board[r][0] == agent && board[r][1] == agent && board[r][2] == agent)
                return Number.MAX_SAFE_INTEGER
            else if (board[0][r] == agent && board[1][r] == agent && board[2][r] == agent)
                return Number.MAX_SAFE_INTEGER
            else if (board[r][0] == flip[agent] && board[r][1] == flip[agent] && board[r][2] == flip[agent])
                return Number.MIN_SAFE_INTEGER
            else if (board[0][r] == flip[agent] && board[1][r] == flip[agent] && board[2][r] == flip[agent])
                return Number.MIN_SAFE_INTEGER
        }
        if (board[0][0] == agent && board[1][1] == agent && board[2][2] == agent)
            return Number.MAX_SAFE_INTEGER
        else if (board[0][2] == agent && board[1][1] == agent && board[2][0] == agent)
            return Number.MAX_SAFE_INTEGER
        else if (board[0][0] == flip[agent] && board[1][1] == flip[agent] && board[2][2] == flip[agent])
            return Number.MIN_SAFE_INTEGER
        else if (board[0][2] == flip[agent] && board[1][1] == flip[agent] && board[2][0] == flip[agent])
            return Number.MIN_SAFE_INTEGER
        return 0
    }

    function getWinnerPoints(board) {
        agent = 'x'
        for (var r = 0; r < 3; r++) {
            if (board[r][0] == agent && board[r][1] == agent && board[r][2] == agent)
                return Array(Array(r, 0), Array(r, 2))
            else if (board[0][r] == agent && board[1][r] == agent && board[2][r] == agent)
                return Array(Array(0, r), Array(2, r))
            else if (board[r][0] == flip[agent] && board[r][1] == flip[agent] && board[r][2] == flip[agent])
                return Array(Array(r, 0), Array(r, 2))
            else if (board[0][r] == flip[agent] && board[1][r] == flip[agent] && board[2][r] == flip[agent])
                return Array(Array(0, r), Array(2, r))
        }
        if (board[0][0] == agent && board[1][1] == agent && board[2][2] == agent)
            return Array(Array(0, 0), Array(2, 2))
        else if (board[0][2] == agent && board[1][1] == agent && board[2][0] == agent)
            return Array(Array(0, 2), Array(2, 0))
        else if (board[0][0] == flip[agent] && board[1][1] == flip[agent] && board[2][2] == flip[agent])
            return Array(Array(0, 0), Array(2, 2))
        else if (board[0][2] == flip[agent] && board[1][1] == flip[agent] && board[2][0] == flip[agent])
            return Array(Array(0, 2), Array(2, 0))
        throw "no winner"
    }

    function maxSequence(curBoard, agent) {
        maxseq = 0
        // rows and columns
        for (var r = 0; r < 3; r++) {
            var curR = 0
            var curC = 0
            for (var c = 0; c < 3; c++) {
                if (curBoard[r][c] == agent)
                    curR += 1
                else if (curBoard[r][c] == flip[agent])
                    curR = -3
                if (curBoard[c][r] == agent)
                    curC += 1
                else if (curBoard[c][r] == flip[agent])
                    curC = -3
                curR = Math.max(0, curR)
                curC = Math.max(0, curC)
                if (curR > 2)
                    curR = 0
                if (curC > 2)
                    curC = 0

            }
            maxseq += (curR ** 4) + (curC ** 4)
        }
        // diagonals
        var curFx = 0
        var curBx = 0
        for (var i = 0; i < 3; i++) {
            if (curBoard[i][i] == agent)
                curBx += 1
            else if (curBoard[i][i] == flip[agent])
                curBx = -3
            if (curBoard[2 - i][i] == agent)
                curFx += 1
            else if (curBoard[2 - i][i] == flip[agent])
                curFx = -3
        }
        if (curFx > 2)
            curFx = 0
        if (curBx > 2)
            curBx = 0
        curFx = Math.max(curFx, 0)
        curBx = Math.max(curBx, 0)
        maxseq += (curFx ** 4) + (curBx ** 4)
        return maxseq
    }

    function countMoves(curBoard) {
        var moves = 0
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                for (var r = 0; r < 3; r++) {
                    for (var c = 0; c < 3; c++) {
                        if (curBoard[row][col][r][c] != '-')
                            moves++
                    }
                }
            }
        }
        return moves
    }

    function getUltimateValue(curBoard, curWinners, agent) {
        var result = getValue(curWinners, agent)
        var moves = countMoves(curBoard);
        if (result < 0) {
            // prefer loosing later
            result /= moves
        }
        else if (result > 0) {
            // prefer winning sooner
            result /= moves
        }
        return result
    }

    function isTerminal(board) {
        var full = true
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (board[r][c] == '-')
                    full = false
            }
        }
        return full
    }

    function isTerminalUltimate(curBoard, curWinners) {
        // check for a winner first
        if (getValue(curWinners, 'x') != 0) {
            return true;
        }
        return getOpenBoard(curBoard, 1, 1) == false
    }

    function getWinners(board) {
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                // dont overwrite previous winners
                if (winners[r][c] != '-')
                    continue;
                value = getValue(board[r][c], 'x');
                if (value > 0) {
                    winners[r][c] = 'x';
                    drawWinnerLine(r, c, board[r][c])
                } else if (value < 0) {
                    winners[r][c] = 'o';
                    drawWinnerLine(r, c, board[r][c])
                }
            }
        }
        return winners;
    }

    function getWinnersTemp(curBoard, oldWinners) {
        newWinners = JSON.parse(JSON.stringify(oldWinners))
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (newWinners[r][c] != '-') {
                    continue;
                }
                value = getValue(curBoard[r][c], 'o')
                if (value < 0)
                    newWinners[r][c] = 'x';
                else if (value > 0)
                    newWinners[r][c] = 'o';
            }
        }
        return newWinners
    }

    function initializeWinners() {
        newWinners = Array(3);
        for (var r = 0; r < 3; r++) {
            winnerRow = Array(3);
            for (var c = 0; c < 3; c++) {
                winnerRow[c] = '-';
            }
            newWinners[r] = winnerRow;
        }
        return newWinners;
    }

    function initializeCenters() {
        centers = Array(9)
        for (var r = 0; r < 9; r++) {
            row = Array(9)
            for (var c = 0; c < 9; c++) {
                row[c] = Array(r * (600 / 9) + (600 / 9) / 2, c * (600 / 9) + (600 / 9) / 2)
            }
            centers[r] = row
        }
        return centers
    }

    function initalizeBoard() {
        board = Array(3)
        for (var i = 0; i < 3; i++) {
            board[i] = Array(3);
        }
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                square = Array(3);
                for (var r = 0; r < 3; r++) {
                    squareRow = Array(3);
                    for (var c = 0; c < 3; c++) {
                        squareRow[c] = '-';
                    }
                    square[r] = squareRow;
                }
                board[row][col] = square;
            }
        }
        return board;
    }

    function copyBoard(b) {
        return JSON.parse(JSON.stringify(b));
    }

    function printBoard(b) {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                for (var r = 0; r < 3; r++) {
                    var line = ""
                    for (var c = 0; c < 3; c++) {
                        line += String(b[row][col][r][c]) + " "
                    }
                    console.log(line)
                    console.log("##########")
                }
            }
        }
    }

    function getOpenStates(curBoard) {
        var openStates = []
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (curBoard[r][c] == "-") {
                    openStates.push([r, c]);
                }
            }
        }
        return openStates;
    }

    function getOpenBoard(curBoard, row, col) {
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (curBoard[row][col][r][c] == "-")
                    return Array(row, col)
            }
        }

        // find a not full board
        for (var r1 = 0; r1 < 3; r1++) {
            for (var c1 = 0; c1 < 3; c1++) {
                var full = true
                for (var r = 0; r < 3; r++) {
                    for (var c = 0; c < 3; c++) {
                        if (curBoard[r1][c1][r][c] == "-")
                            full = false
                    }
                }
                if (!full)
                    return Array(r1, c1)
            }
        }
        return false
    }

    function minimaxSearch(curBoard, row, col, agent, depth, eval, deterministic) {
        moveR = 1
        moveC = 1
        maxVal = Number.MIN_SAFE_INTEGER
        maxMoves = Array()
        var openStates = getOpenStates(curBoard[row][col])
        for (var point in openStates) {
            r = openStates[point][0]
            c = openStates[point][1]
            var successor = copyBoard(curBoard)
            successor[row][col][r][c] = agent
            var value = minV(successor, getWinnersTemp(successor, winners), r, c, flip[agent],
                depth, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, eval, Array(Array(row, col, r, c, agent)))
            console.log(agent, " returned ", value)
            if (value > maxVal) {
                maxMoves = Array(Array(r, c))
                maxVal = value
                moveR = r
                moveC = c
            } else if (value == maxVal) {
                maxMoves.push(Array(r, c))
            }
        }
        console.log("picked", maxVal)
        if (deterministic)
            return Array(moveR, moveC)
        else
            return maxMoves[Math.floor(Math.random() * maxMoves.length)]
    }

    function minV(curBoard, oldWinners, row, col, agent, depth, alpha, beta, eval, moves) {
        if (isTerminalUltimate(curBoard, oldWinners)) {
            return getUltimateValue(curBoard, oldWinners, flip[agent])
        }
        else if (depth == 0) {
            var result = eval(curBoard, oldWinners, flip[agent], moves)
            return result
        }
        v = Number.MAX_SAFE_INTEGER
        var openBoard = getOpenBoard(curBoard, row, col)
        row = openBoard[0]
        col = openBoard[1]
        var openStates = getOpenStates(curBoard[row][col])
        if (openStates.length < 0 || openStates.length > 9) {
            throw "illegal open states"
        }
        for (var point in openStates) {
            var r = openStates[point][0]
            var c = openStates[point][1]
            successor = copyBoard(curBoard)
            successor[row][col][r][c] = agent
            successorWinners = getWinnersTemp(successor, oldWinners)
            successorMoves = JSON.parse(JSON.stringify(moves));
            successorMoves.push(Array(row, col, r, c, agent))
            var max = maxV(successor, successorWinners, r, c, flip[agent], depth, alpha, beta, eval, successorMoves)
            v = Math.min(v, max)
            if (v <= alpha) {
                return v
            }
            beta = Math.min(beta, v)
        }
        return v
    }

    function maxV(curBoard, oldWinners, row, col, agent, depth, alpha, beta, eval, moves) {
        if (isTerminalUltimate(curBoard, oldWinners)) {
            return getUltimateValue(curBoard, oldWinners, agent)
        }
        v = Number.MIN_SAFE_INTEGER
        var openBoard = getOpenBoard(curBoard, row, col)
        row = openBoard[0]
        col = openBoard[1]
        var openStates = getOpenStates(curBoard[row][col])
        if (openStates.length < 0 || openStates.length > 9) {
            throw "illegal open states"
        }
        for (var point in openStates) {

            var r = openStates[point][0]
            var c = openStates[point][1]
            successor = copyBoard(curBoard)
            successor[row][col][r][r] = agent
            successorWinners = getWinnersTemp(successor, oldWinners)
            successorMoves = JSON.parse(JSON.stringify(moves));
            successorMoves.push(Array(row, col, r, c, agent))
            var min = minV(successor, successorWinners, r, c, flip[agent], depth - 1, alpha, beta, eval, successorMoves)
            v = Math.max(v, min)
            if (v >= beta) {
                return v
            }
            alpha = Math.max(alpha, v)
        }
        return v
    }

    function countTwos(curBoard, agent) {
        var twos = 0
        // rows and columns
        for (var r = 0; r < 3; r++) {
            var colCount = 0
            var rowCount = 0
            for (var c = 0; c < 3; c++) {
                if (curBoard[r][c] == agent)
                    rowCount += 1
                else if (curBoard[r][c] == flip[agent])
                    rowCount = 0
                if (curBoard[c][r] == agent)
                    colCount += 1
                else if (curBoard[c][r] == flip[agent])
                    colCount = 0
            }
            if (rowCount == 2)
                twos += 1
            if (colCount == 2)
                twos += 1
        }

        // diagonals
        var fDiag = 0
        var bDiag = 0
        for (var r = 0; r < 3; r++) {
            if (board[r][r] == agent)
                bDiag += 1
            else if (board[r][r] == flip[agent])
                bDiag = 0
            if (board[2 - r][r] == agent)
                fDiag += 1
            else if (board[2 - r][r] == agent)
                fDiag = 0
        }
        if (fDiag == 2)
            twos += 1
        if (bDiag == 2)
            twos += 2
        return twos
    }

    function wasBlock(curBoard, agent, r, c) {
        curBoard[r][c] = '-'
        prevTwos = countTwos(curBoard, flip[agent])
        curBoard[r][c] = agent
        curTwos = countTwos(curBoard, flip[agent])
        return prevTwos != curTwos
    }

    function movesEvaluationFunction(curBoard, curWinners, agent, moves) {
        prevBoard = copyBoard(board)
        prevWinners = getWinnersTemp(board, winners)
        var score = 0
        var winScore = 0
        var seqScore = 0
        var blockScore = 0
        for (var move in moves) {
            var row = moves[move][0]
            var col = moves[move][1]
            var r = moves[move][2]
            var c = moves[move][3]
            var curAgent = moves[move][4]
            // check if we can block, make a sequence, or win
            if (prevWinners[row][col] == '-') {
                // check if the board can be won
                yourOldSeq = maxSequence(prevBoard[row][col], agent)
                oppOldSeq = maxSequence(prevBoard[row][col], flip[agent])
                prevBoard[row][col][r][c] = curAgent
                yourNewSeq = maxSequence(prevBoard[row][col], agent)
                oppNewSeq = maxSequence(prevBoard[row][col], flip[agent])
                var newWinners = getWinnersTemp(prevBoard, prevWinners)
                if (newWinners[row][col] == agent) {
                    winScore += 10000
                } else if (newWinners[row][col] == flip[agent]) {
                    winScore -= 10000
                } else if (wasBlock(prevBoard[row][col], curAgent, r, c)){
                    // if we blocked our opponent
                    if (agent == curAgent) {
                        blockScore += 200
                    } else {
                        blockScore -= 200
                    }
                }
                else {
                    // better if the move decreased opponents sequenc
                    seqScore += oppOldSeq - oppNewSeq
                    // better if move increased your score
                    seqScore += yourNewSeq - yourOldSeq
                }

            }


        }
        score = parseFloat(seqScore + blockScore + winScore)

        return score
    }

    function evaluationFunction(curBoard, curWinners, agent) {
        var score = 0
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (curWinners[r][c] == '-') {
                    var yourseq = maxSequence(curBoard[r][c], agent)
                    var oppseq = maxSequence(curBoard[r][c], flip[agent])
                    score += yourseq
                    score -= 5 * oppseq
                }
            }
        }
        score += 100 * maxSequence(curWinners, agent)
        score -= 100 * maxSequence(curWinners, flip[agent])
        return score
    }

    function simpleEvaluationFunction(curBoard, curWinners, agent) {
        var score = 0
        score += 100 * maxSequence(curWinners, agent)
        score -= 100 * maxSequence(curWinners, flip[agent])
        return score
    }

    canvas.addEventListener('mouseup', function (event) {
        var now = Date.now();
        // allow moves once every 500 ms
        if (now - lastCall < 500) {
            return
        }
        lastCall = now
        var canvasMousePosition = getCanvasMousePosition(event);
        var x = Math.floor(canvasMousePosition['x'] / SIZE)
        var y = Math.floor(canvasMousePosition['y'] / SIZE)
        var openSpace = getOpenBoard(board, boardR, boardC)
        boardR = openSpace[0]
        boardC = openSpace[1]
        updateLines();
        var openSpaces = JSON.stringify(getOpenStates(board[boardR][boardC]));
        var space = JSON.stringify(Array(y % 3, x % 3));
        var isOpen = openSpaces.indexOf(space) != -1;
        // check if the move is valid
        if (x >= 0 && x <= 8 && y >= 0 && y <= 8 && isOpen &&
            Math.floor(x / 3) == boardC && Math.floor(y / 3) == boardR &&
            !isTerminalUltimate(board, winners)) {
    
            if (turn == 'x') {
                var message = document.getElementById("winner");
                message.innerHTML = ""
                var text = "It's your turn!"
                message.appendChild(document.createTextNode(text))
                board[boardR][boardC][y % 3][x % 3] = 'x';
                turn = 'o'
                drawX(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3);
                getWinners(board)
                boardR = y % 3
                boardC = x % 3
                updateLines();
                console.log("value after move:", evaluationFunction(board, winners, 'x'))
            }

            if (turn == 'o' && !isTerminalUltimate(board, winners)) {
                var message = document.getElementById("winner");
                message.innerHTML = ""
                var text = "Calculating move..."
                message.appendChild(document.createTextNode(text))
                setTimeout(function () {
                    // wait for the x to draw
                    openSpace = getOpenBoard(board, boardR, boardC)
                    if (!openSpace)
                        return
                    boardR = openSpace[0]
                    boardC = openSpace[1]
                    point = minimaxSearch(copyBoard(board), boardR, boardC, 'o', 3, movesEvaluationFunction, true)
                    x = point[1] + boardC * 3
                    y = point[0] + boardR * 3

                    openSpaces = JSON.stringify(getOpenStates(board[boardR][boardC]));
                    space = JSON.stringify(Array(y % 3, x % 3));
                    isOpen = openSpaces.indexOf(space) != -1;
                    if (!isOpen) {
                        console.log(y, x, openSpaces, space)
                        return
                    }

                    drawO(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3)
                    board[boardR][boardC][y % 3][x % 3] = 'o';
                    getWinners(board)
                    boardR = y % 3
                    boardC = x % 3
                    turn = 'x'
                    var openSpace = getOpenBoard(board, boardR, boardC)
                    boardR = openSpace[0]
                    boardC = openSpace[1]
                    updateLines();
                    console.log(board, "value for O's after move:", evaluationFunction(board, winners, 'o'))
                    var message = document.getElementById("winner");
                    message.innerHTML = ""
                    var text = "It's your turn!"
                    message.appendChild(document.createTextNode(text))
                }, 20)

            }
            /*
            
            while (!isTerminalUltimate(board, winners)) {
                if (turn == 'x') {
                    openSpace = getOpenBoard(board, boardR, boardC)
                    if (!openSpace)
                        continue
                    boardR = openSpace[0]
                    boardC = openSpace[1]
                    point = minimaxSearch(copyBoard(board), boardR, boardC, 'x', 1, movesEvaluationFunction, true)
                    x = point[1] + boardC * 3
                    y = point[0] + boardR * 3
    
                    openSpaces = JSON.stringify(getOpenStates(board[boardR][boardC]));
                    space = JSON.stringify(Array(y % 3, x % 3));
                    isOpen = openSpaces.indexOf(space) != -1;
                    if (!isOpen) {
                        throw Exception("illegal move")
                    }
    
                    drawX(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3)
                    board[boardR][boardC][y % 3][x % 3] = 'x';
                    getWinners(board)
                    boardR = y % 3
                    boardC = x % 3
                    turn = 'o'
                    var openSpace = getOpenBoard(board, boardR, boardC)
                    if (!openSpace)
                        continue
                    boardR = openSpace[0]
                    boardC = openSpace[1]
                    updateLines();
                }
                
                else if (turn == 'o') {
                    // wait for the x to draw
                    openSpace = getOpenBoard(board, boardR, boardC)
                    if (!openSpace)
                        continue
                    boardR = openSpace[0]
                    boardC = openSpace[1]
                    point = minimaxSearch(copyBoard(board), boardR, boardC, 'o', 2, movesEvaluationFunction, true)
                    x = point[1] + boardC * 3
                    y = point[0] + boardR * 3
    
                    openSpaces = JSON.stringify(getOpenStates(board[boardR][boardC]));
                    space = JSON.stringify(Array(y % 3, x % 3));
                    isOpen = openSpaces.indexOf(space) != -1;
                    if (!isOpen) {
                        throw Exception("illegal move")
                    }
    
                    drawO(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3)
                    board[boardR][boardC][y % 3][x % 3] = 'o';
                    getWinners(board)
                    boardR = y % 3
                    boardC = x % 3
                    turn = 'x'
                    var openSpace = getOpenBoard(board, boardR, boardC)
                    boardR = openSpace[0]
                    boardC = openSpace[1]
                    updateLines();
                }
            }
*/
            setTimeout(function () {
                if (isTerminalUltimate(board, winners)) {
                    var message = document.getElementById("winner");
                    message.innerHTML = ""
                    var text = "Game over, "
                    if (getValue(winners, 'x') > 0)
                        text += " X's Win!"
                    else if (getValue(winners, 'o') > 0)
                        text += " O's Win!"
                    else
                        text += " it's a tie!"
                    message.appendChild(document.createTextNode(text))
                }
            }, 20)
        }

    });

})();
