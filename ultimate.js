window.onload = (function () {
    // game variables
    var boardR = 1
    var boardC = 1
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
            console.log(y * size + c * size)
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
            console.log((canvasSize / 3) - 10)
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

    canvas.addEventListener('mouseup', function (event) {
        var canvasMousePosition = getCanvasMousePosition(event);
        var x = Math.floor(canvasMousePosition['x'] / SIZE)
        var y = Math.floor(canvasMousePosition['y'] / SIZE)
        console.log(x + " " + y + " " + boardC + " " + boardR);
        if (x >= 0 && x <= 8 && y >= 0 && y <= 8 &&
            Math.floor(x / 3) == boardC && Math.floor(y / 3) == boardR) {
            if (turn == 'x') {
                drawX(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3)
                boardR = y % 3
                boardC = x % 3
                turn = 'o'
            } else {
                drawO(x * SIZE, y * SIZE, Math.floor(x / 3) * 3, Math.floor(y / 3) * 3)
                boardR = y % 3
                boardC = x % 3
                console.log(boardC + " " + boardR);
                turn = 'x'
            }
        }
    });

})();
