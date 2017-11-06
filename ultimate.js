window.onload = (function () {
    // game variables
    var flip = {'x' : 'o', 'o' : 'x'}
    var boardR = 1
    var boardC = 1
    board = initalizeBoard()
    winners = initializeWinners()
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

    function drawLines(lineWidth, strokeStyle, lineStart, lineLength, size, r, c) {
        var lineStartX = lineStart + r * canvasSize / 3;
        var lineStartY = lineStart + c * canvasSize / 3;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.strokeStyle = strokeStyle;
        context.beginPath();

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

    // draw the initial board
    drawLines(8, lineColor, 4, canvasSize - 10, sectionSize, 0, 0);
    for (var i = 0; i <= 2; i++) {
        for (var j = 0; j <= 2; j++) {
            drawLines(5, lineColor, 10, (canvasSize / 3) - 20, sectionSize / 3, i, j);
        }
    }

    function getCanvasMousePosition(event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }


    function getValue(board, agent){
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

    function getUltimateValue(curWinners){
        return getValue(curWinners);
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


    function isTerminalUltimate(board, curWinners) {
        // check for a winner first
        if (getValue(curWinners, 'x') != 0){
            return true;
        }
        // check if the board is full
        full = true;
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                full &= isTerminal(board[r][c])
            }
        }
        return full;
    }


    function getWinners(board) {
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                // dont overwrite previous winners
                if (winners[r][c] != '-')
                    continue;
                value = getValue(board[r][c], 'x');
                if (value > 0) 
                    winners[r][c] = 'x';
                else if (value < 0) 
                    winners[r][c] = 'o';
            }
        }
        return winners;
    }

    function getWinnersTemp(board, oldWinners) {
        newWinners = initializeWinners()
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (oldWinners[r][c] != '-'){
                    newWinners[r][c] = oldWinners[r][c];
                    continue;
                }
                value = getValue(board[r][c], 'x')
                if (value > 0) 
                    newWinners[r][c] = 'x';
                else if (value < 0) 
                    newWinners[r][c] = 'o';
            }
        }
        return newWinners
    }

    function initializeWinners() {
        winners = Array(3);
        for (var r = 0; r < 3; r++) {
            winnerRow = Array(3);
            for (var c = 0; c < 3; c++) {
                winnerRow[c] = '-';
            }
            winners[r] = winnerRow;
        }
        return winners;
    }

    function initalizeBoard() {
        board = Array(3)
        for (var i = 0; i < 3; i ++) {
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
        var newBoard = JSON.parse(JSON.stringify(b))
        return newBoard;
    }

    function printBoard(b) {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                for (var r = 0; r < 3; r++) {
                    for (var c = 0; c < 3; c++) {
                        console.log(b[row][col][r][c]);
                    }
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

    function minimaxSearch(curBoard, row, col, agent, alpha, beta) {
        moveR = -1
        moveC = -1
        maxVal = Number.MIN_SAFE_INTEGER
        var openStates = getOpenStates(curBoard[row][col])
        for (var point in openStates) {
            r = openStates[point][0]
            c = openStates[point][1]
            var successor = copyBoard(curBoard)
            successor[row][col][r][c] = agent
            var value = minV(successor, getWinnersTemp(successor, winners), r, c, flip[agent], 3, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
            console.log(value)
            if (value >= maxVal) {
                maxVal = value
                moveR = r
                moveC = c
            }
        }
        return Array(moveR, moveC)
    }

    function minV(curBoard, oldWinners, row, col, agent, depth, alpha, beta) {
        if (isTerminalUltimate(curBoard, oldWinners)) {
            return getUltimateValue(oldWinners)
        }
        else if (depth == 0) {
            return evaluationFunction(curBoard, oldWinners, flip[agent])
        }
        v = Number.MAX_SAFE_INTEGER
        var openStates = getOpenStates(curBoard[row][col])
        for (var point in openStates) {
            var r = openStates[point][0]
            var c = openStates[point][1]
            successor = copyBoard(curBoard)
            successor[row][col][r][c] = agent
            v = Math.min(v, maxV(successor, getWinnersTemp(successor, oldWinners), r, c, flip[agent], depth, alpha, beta))
            if (v <= alpha) {
                return v
            }
            beta = Math.min(beta, v)
        }
        return v
    }

    function maxV(curBoard, oldWinners, row, col, agent, depth, alpha, beta) {
        if (isTerminalUltimate(curBoard, oldWinners)) {
            return getUltimateValue(oldWinners)
        }
        else if (depth == 0) {
            return evaluationFunction(curBoard, oldWinners, agent)
        }
        v = Number.MIN_SAFE_INTEGER
        var openStates = getOpenStates(curBoard[row][col])
        for (var point in openStates) {
            var r = openStates[point][0]
            var c = openStates[point][1]
            successor = copyBoard(curBoard)
            successor[row][col][r][r] = agent
            v = Math.max(v, minV(successor, getWinnersTemp(successor, oldWinners), r, c, flip[agent], depth - 1, alpha, beta))
            if (v >= beta) {
                return v
            }
            alpha = Math.max(alpha, v)
        }
        return v
    }

    function evaluationFunction(curBoard, curWinners, agent) {
        score = 0
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                if (curWinners[r][c] == agent){
                    score += 100
                } else if (curWinners[r][c] == flip[agent]) {
                    score -= 100
                }
            }
        }
        return score
    }

    canvas.addEventListener('mouseup', function (event) {
        var canvasMousePosition = getCanvasMousePosition(event);
        var x = Math.floor(canvasMousePosition['x'] / SIZE)
        var y = Math.floor(canvasMousePosition['y'] / SIZE)
        var openSpaces = JSON.stringify(getOpenStates(board[boardR][boardC]));
        var space = JSON.stringify(Array(y % 3, x % 3));
        isOpen = openSpaces.indexOf(space) != -1;
        // check if the move is valid
        if (x >= 0 && x <= 8 && y >= 0 && y <= 8 && isOpen &&
            Math.floor(x / 3) == boardC && Math.floor(y / 3) == boardR) {
            if (turn == 'x') {
                turn = 'o'
                // force update to draw the x
                drawX(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3);
                board[boardR][boardC][y % 3][x % 3] = 'x';
                getWinners(board)
                boardR = y % 3
                boardC = x % 3
                
            } 
            setTimeout(function() {
                point = minimaxSearch(copyBoard(board), boardR, boardC, turn)
                x = point[1] + boardC * 3
                y = point[0] + boardR * 3

                openSpaces = JSON.stringify(getOpenStates(board[boardR][boardC]));
                space = JSON.stringify(Array(y % 3, x % 3));
                isOpen = openSpaces.indexOf(space) != -1;
                if (!isOpen){
                    throw Exception("illegal move")
                }

                drawO(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3)
                board[boardR][boardC][y % 3][x % 3] = 'o';
                getWinners(board)
                boardR = y % 3
                boardC = x % 3
                turn = 'x'
            }, 20)
            if (isTerminalUltimate(board, winners)) {
                if (getValue(winners, 'x') > 0)
                    document.getElementById("winner").innerHtml = "X's Win"
                else if (getValue(winners, 'o') > 0)
                    document.getElementById("winner").innerHtml = "O's Win"
                else
                    document.getElementById("winner").innerHtml = "Tie"
            }
        }
    });

})();
