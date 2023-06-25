
function engine(){
    var stockfish = new Worker("../node_modules/stockfish/src/stockfish.js");
    stockfish.postMessage("uci");
    stockfish.onmessage = function onmessage(event) {
        console.log(event.data);
    };
}

export default engine();
