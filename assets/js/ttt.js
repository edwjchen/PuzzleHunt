// the canvas logic should be done once somewhere else 
var w = 700;
var h = 700;
// grid step
var step = 100; 
var canvasElementId = 'grid';
var canvas = document.getElementById(canvasElementId);
// this is how you resize the canvas
canvas.width  = w;
canvas.height = h;
var ctx = canvas.getContext('2d');

marked = [[0,0,0], [0,0,0], [0,0,0]]

// the render logic should be focusing on the rendering 
var drawGrid = function(ctx, w, h, step) {
    ctx.beginPath(); 
    for (var x=200;x<=w-200;x+=step) {
        ctx.moveTo(x, 200);
        ctx.lineTo(x, h-200);
    }
    // set the color of the line
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.lineWidth = 1;
    // the stroke will actually paint the current path 
    ctx.stroke(); 
    
    // for the sake of the example 2nd path
    ctx.beginPath(); 
    for (var y=200;y<=h-200;y+=step) {
            ctx.moveTo(200, y);
            ctx.lineTo(w-200, y);
    }
    // set the color of the line
    ctx.strokeStyle = 'rgb(255,255,255)';
    // just for fun
    ctx.lineWidth = 1;
    // for your original question - you need to stroke only once
    ctx.stroke(); 
};

let hasClicked= false;

canvas.addEventListener('click', function(e) {
    if (!hasClicked) {
        hasClicked = true;
        var pos = getMousePos(canvas, e), /// provide this canvas and event
            x = pos.x,
            y = pos.y;
        clicked(pos);
    } else {
        return;
    }


}, false);


async function clicked(pos) {
    let response = await makeMove(pos);
    if (response == "bad move"){
        hasClicked = false;
    } else {
        if (response.message) {
            if (response.message == "player win") {

            } else if (response.message == "computer win")
        }
        update(response)
        hasClicked = false;
    }
}

function update(board) {
    for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board[r].length; c++) {
            if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
                if (board[r][c] == 1) {
                    if (marked[r-2][c-2] == 0) {
                        marked[r-2][c-2] = 1
                        ctx.moveTo(c * 100 + 20, r * 100 + 20);
                        ctx.lineTo(c * 100 + 80, r * 100 + 80);
                        ctx.stroke()
                        ctx.moveTo(c * 100 + 80, r * 100 + 20);
                        ctx.lineTo(c * 100 + 20, r * 100 + 80);
                        ctx.stroke()
                    }
                } else if (board[r][c] == 5) {
                    if (marked[r-2][c-2] == 0) {
                        marked[r-2][c-2] = 1
                        ctx.moveTo(c*100 + 90, r * 100 + 50);
                        ctx.arc(c*100 + 50, r*100+50, 40, 0, 2* Math.PI)
                        ctx.stroke()
                    }
                }
            } else {
                if (board[r][c] == 1) {
                    ctx.moveTo(c * 100 + 20, r * 100 + 20);
                    ctx.lineTo(c * 100 + 80, r * 100 + 80);
                    ctx.stroke()
                    ctx.moveTo(c * 100 + 80, r * 100 + 20);
                    ctx.lineTo(c * 100 + 20, r * 100 + 80);
                    ctx.stroke()
                }
            }
        }
    }
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

function resetCanvas(){
    ctx.clearRect(0, 0, w, h);
    drawGrid(ctx, w, h, step);
    resetBoard();
    marked = [[0,0,0], [0,0,0], [0,0,0]]
    return false;
}

drawGrid(ctx, w, h, step);
marked = [[0,0,0], [0,0,0], [0,0,0]]
let board = getBoard().then(function (board) {
    update(board);
});
