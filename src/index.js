const LINE_NUMBER=1;
const currentRoute = window.location.pathname;
const requestData = {
    id: currentRoute.substring(1)
}

const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  };
  
// Make the POST request
fetch('/post', requestOptions)
.then(response => {
    // Check if the response was successful (status code between 200 and 299)
    if (response.ok) {
    return response.json();
    } else {
    throw new Error('Error: ' + response.status);
    }
})
.then(data => {
    // Process the response data
    console.log(data);
    start(data);
})
.catch(error => {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
});




function start(data){
    const stockfish = new Worker("../node_modules/stockfish/src/stockfish.js");
    stockfish.postMessage("uci");
    stockfish.postMessage("ucinewgame");
    stockfish.postMessage("setoption name MultiPV value 3");

    var board = null
    var game = new Chess()
    var $status = $('#status')
    var $fen = $('#fen')
    var $pgn = $('#pgn')

    game.load_pgn(data.rows[0].moves);

    function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
    }

    function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'

    updateStatus()
    }
    

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    function onSnapEnd () {
    board.position(game.fen())
    }

    function updateStatus () {
        stockfish.postMessage(`position fen ${game.fen()}`);
        stockfish.postMessage("go depth 10");
        stockfish.onmessage = (e)=>{
            if ((e.data).startsWith("info depth 10 seldepth") && (e.data).includes(`multipv ${LINE_NUMBER}`)){
                const index=(e.data).indexOf(" pv ");
                const line = e.data.substring(index+4);
                const movesList = line.split(" ");
                
                if (game.turn()!=data.rows[0].turn){
                    game.move({
                        from: movesList[0].substring(0,2),
                        to:movesList[0].substring(2)
                    });
                    board.position(game.fen());
                }
            }

        }
        var status = ''

        var moveColor = 'White'
        if (game.turn() === 'b') {
            moveColor = 'Black'
        }

        // checkmate?
        if (game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.'
        }

        // draw?
        else if (game.in_draw()) {
            status = 'Game over, drawn position'
        }

        // game still on
        else {
            status = moveColor + ' to move'

            // check?
            if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
            }
        }

        $status.html(status)
        $fen.html(game.fen())
        $pgn.html(game.pgn())
        }

        var config = {
        draggable: true,
        position: game.fen(),
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    }
    board = Chessboard('myBoard', config)

    updateStatus()
    
}




