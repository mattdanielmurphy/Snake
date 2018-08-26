const { gridSize, gridWidth, cellSize } = require('./grid-settings')
import './makeGrid'

function makeRectangle(x, y, w, h, options) {
	ctx.beginPath()
	ctx.rect(x, y, w, h)
	Object.keys(options).forEach((key) => {
		switch (key) {
			case 'fill':
				ctx.fillStyle = options[key]
				ctx.fill()
				break
			default:
				break
		}
	})
	ctx.closePath()
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	makeRectangle(x, y, cellSize, cellSize, { fill: 'black' })
	makeGrid(gridSize, cellSize)
}

function move() {
	const directions = {
		right: () => (x += cellSize),
		down: () => (y += cellSize),
		up: () => (y -= cellSize),
		left: () => (x -= cellSize)
	}

	directions[direction].call()

	const outsideX = x >= gridSize || x < 0
	const outsideY = y >= gridSize || y < 0

	if (outsideX || outsideY) endGame()
}

function changeDirection(newDirection) {
	direction = newDirection
}

function keyDownHandler(e) {
	if (gameOver) startGame()
	switch (e.key) {
		case 'ArrowUp':
			changeDirection('up')
			break
		case 'ArrowDown':
			changeDirection('down')
			break
		case 'ArrowLeft':
			changeDirection('left')
			break
		case 'ArrowRight':
			changeDirection('right')
			break
		default:
			break
	}
}

function endGame() {
	clearInterval(mainInterval)
	clearInterval(moveInterval)
	gameOverElement.className = ''
	gameOver = true
}

function getRandomDirection() {
	let directions = [ 'up', 'right', 'down', 'left' ]
	let randomN = Math.floor(Math.random() * 5)
	return directions[randomN]
}

function makeCanvas() {
	let container = document.getElementById('container')
	let canvas = document.getElementsByTagName('canvas')[0]
	canvas.height = gridWidth
	canvas.width = gridWidth
	container.appendChild(canvas)
	return canvas
}

function startGame() {
	document.addEventListener('keydown', keyDownHandler, false)
	ctx = canvas.getContext('2d')
	gameOverElement.className = 'hidden'
	gameOver = false
	x = gridSize / 2
	y = gridSize / 2
	direction = getRandomDirection()
	mainInterval = setInterval(draw, 10)
	moveInterval = setInterval(move, 300)
}

let direction
let mainInterval
let moveInterval

const gameOverElement = document.getElementById('game-over')

let canvas
let ctx
let makeGrid = require('./makeGrid')

let makeCanvasPromise = new Promise((resolve, reject) => {
	canvas = makeCanvas()
	resolve('Canvas made')
}).then(() => {
	// startGame()
})

// .catch((reason) => console.log(reason))

// 1. need a way of moving the tail of the snake
//    which means deleting where the tail just was

// I can keep track of every cell coordinate in the snake in an array.
// Since it will be in order, I can just take from the beginning of
// the array, blanking each oldest

// 2. make it so you can't change the direction
//    such that you enter your tail directly

// make it so you stop the interval before you draw outside the grid
