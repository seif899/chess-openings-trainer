/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const queryString = window.location.search;\n\nconst urlParams = new URLSearchParams(queryString);\n\nconst LINE_NUMBER = urlParams.get(\"line\");\n\n\nconst currentRoute = window.location.pathname;\n\n\n\nconst requestData = {\n    id: currentRoute.substring(1)\n}\n\nconst requestOptions = {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(requestData)\n  };\n  \n// Make the POST request\nfetch('/post', requestOptions)\n.then(response => {\n    // Check if the response was successful (status code between 200 and 299)\n    if (response.ok) {\n    return response.json();\n    } else {\n    throw new Error('Error: ' + response.status);\n    }\n})\n.then(data => {\n    // Process the response data\n    console.log(data);\n    start(data);\n})\n.catch(error => {\n    // Handle any errors that occurred during the request\n    console.error('Error:', error);\n});\n\n\n\n\nfunction start(data){\n    const stockfish = new Worker(\"../node_modules/stockfish/src/stockfish.js\");\n    stockfish.postMessage(\"uci\");\n    stockfish.postMessage(\"ucinewgame\");\n    stockfish.postMessage(\"setoption name MultiPV value 3\");\n\n    var board = null\n    var game = new Chess()\n    var $status = $('#status')\n    var $fen = $('#fen')\n    var $pgn = $('#pgn')\n\n\n    game.load_pgn(data.rows[0].moves);\n    \n    \n    stockfish.postMessage(`position fen ${game.fen()}`);\n    stockfish.postMessage(\"go depth 10\");\n    stockfish.onmessage = (e)=>{\n        console.log(e.data);\n        if ((e.data).startsWith(\"info depth 10 seldepth\") && (e.data).includes(`multipv ${LINE_NUMBER}`)){\n            const index=(e.data).indexOf(\" pv \");\n            const line = e.data.substring(index+4);\n            const movesList = line.split(\" \");\n            startTraining(movesList);\n            \n        }\n    }\n    \n    function startTraining(movesList){\n        function engineMove(movesList){\n            if (game.turn()!=data.rows[0].turn){\n                game.move({\n                    from: movesList[0].substring(0,2),\n                    to:movesList[0].substring(2)\n                });\n                board.position(game.fen());\n                movesList.shift();\n                \n            }\n    \n        }\n    \n        function isBestMove(movesList,source,target){\n            console.log(movesList,source,target);\n            if (movesList[0]===source+target){\n                movesList.shift()\n                return true;\n            } else {\n                return false;\n            }\n        }\n\n\n        function onDragStart (source, piece, position, orientation) {\n            // do not pick up pieces if the game is over\n            if (game.game_over()) return false\n    \n            // only pick up pieces for the side to move\n            if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||\n                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {\n                return false\n            }\n        }\n    \n        function onDrop (source, target) {\n            // see if the move is legal\n            if (isBestMove(movesList,source,target)){\n                var move = game.move({\n                    from: source,\n                    to: target,\n                    promotion: 'q' // NOTE: always promote to a queen for example simplicity\n                })\n\n                engineMove(movesList)\n\n\n            }\n    \n            return 'snapback';\n            \n        }\n        \n    \n        // update the board position after the piece snap\n        // for castling, en passant, pawn promotion\n        function onSnapEnd () {\n            board.position(game.fen())\n        }\n    \n        var config = {\n        draggable: true,\n        position: game.fen(),\n        onDragStart: onDragStart,\n        onDrop: onDrop,\n        onSnapEnd: onSnapEnd\n        }\n        board = Chessboard('myBoard', config)\n    \n        \n        engineMove(movesList)\n\n    }\n\n\n    \n}\n\n\n\n\n\n\n//# sourceURL=webpack://chess/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;