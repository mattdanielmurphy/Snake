const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')

let rawGridWidth = Math.min(window.innerHeight - 100, window.innerWidth - 100)
let cellSize = Math.round(rawGridWidth / 21)
let gridWidth = cellSize * 21
canvas.width = gridWidth
canvas.height = gridWidth

let startPos = Math.ceil(21 / 2)

let x
let y
let length = 5
let directionLastMovedIn

let resize

window.addEventListener('resize', (e) => {
	clearTimeout(resize)
	resize = setTimeout(() => {
		rawGridWidth = Math.min(window.innerHeight - 100, window.innerWidth - 100)
		cellSize = Math.round(rawGridWidth / 21)
		gridWidth = cellSize * 21
		canvas.width = gridWidth
		canvas.height = gridWidth
		y = x = startPos * cellSize
		generateFood()
		draw()
	}, 500)
})

const gameOver = document.getElementById('game-over')

function drawBox(x, y, w, h, options = { nooptions: '' }) {
	ctx.beginPath()
	ctx.rect(x, y, w, h)
	Object.keys(options).forEach((option) => {
		switch (option) {
			case 'fill':
				ctx.fillStyle = options[option]
				ctx.fill()
				break
			case 'stroke':
				switch (options[option]) {
					case 'none':
						break
				}
				break
			default:
				ctx.strokeStyle = 'black'
				ctx.stroke()
		}
	})
	ctx.closePath()
}

function makeGrid() {
	const w = gridWidth

	drawBox(0, 0, w, w)
	for (let i = cellSize; i < w; i += cellSize * 2) {
		drawBox(i, 0, cellSize, w)
		drawBox(0, i, w, cellSize)
	}
}

function setupGame() {
	makeGrid()
}

setupGame()

function endGame() {
	gameOver.className = ''
	playing = false
	snake.body = [ [ startPos * cellSize, startPos * cellSize ] ]
	clearInterval(drawInterval)
	clearInterval(moveInterval)
}

let direction = 'right'

class Snake {
	constructor() {
		this.x = x
		this.y = y
		this.body = [ `${x}:${y}` ]
		this.directionCmd = {
			right: () => (this.x += cellSize),
			left: () => (this.x -= cellSize),
			up: () => (this.y -= cellSize),
			down: () => (this.y += cellSize)
		}
	}

	changeDirection(newDirection) {
		const oppositeDirections = {
			right: 'left',
			left: 'right',
			up: 'down',
			down: 'up'
		}

		if (oppositeDirections[directionLastMovedIn] !== newDirection) {
			direction = newDirection
		}
	}

	move() {
		directionLastMovedIn = direction
		this.x = x
		this.y = y
		this.directionCmd[direction].call()
		const isValid = (x, y) => {
			return x >= 0 && x < gridWidth && y >= 0 && y < gridWidth && !snake.body.includes(`${x}:${y}`)
		}
		if (isValid(this.x, this.y)) {
			x = this.x
			y = this.y
			this.body.push(`${x}:${y}`)
			if (this.body.length === length) {
				this.body.shift()
			}
		} else {
			endGame()
		}

		if (x === foodX && y === foodY) eatFood()
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	snake.body.forEach((coords) => {
		coords = /(\d+):(\d+)/.exec(coords)
		if (coords !== null) {
			let [ , x, y ] = coords
			drawBox(x, y, cellSize, cellSize, { fill: 'black' })
		}
	})
	drawBox(foodX, foodY, cellSize, cellSize, { fill: 'yellow' })
	drawBox(x, y, cellSize, cellSize, { fill: 'firebrick', stroke: 'none' })
	makeGrid()
	// score
	statsElement.innerText = `score: ${score}\nlength: ${length}`
}

let snake = new Snake()
let playing = false
let moveInterval
let drawInterval
let foodX
let foodY
let score = 0
let statsElement = document.getElementById('stats')

function generateFood() {
	randomN = () => Math.floor(Math.random() * 21)
	foodX = randomN() * cellSize
	foodY = randomN() * cellSize
	if (snake.body.includes(`${foodX}:${foodY}`)) generateFood()
}

function eatFood() {
	score++
	length += 5
	generateFood()
}

function startGame() {
	score = 0
	length = 4
	console.log('game start')
	gameOver.className = 'hidden'
	y = x = startPos * cellSize
	playing = true
	drawInterval = setInterval(draw, 10)
	moveInterval = setInterval(tryToMove, 100)
	generateFood()
}

function tryToMove() {
	snake.move()
}

document.addEventListener('keydown', (e) => {
	if (!playing) startGame()
	switch (e.key) {
		case 'ArrowRight':
			snake.changeDirection('right')
			break
		case 'ArrowLeft':
			snake.changeDirection('left')
			break
		case 'ArrowUp':
			snake.changeDirection('up')
			break
		case 'ArrowDown':
			snake.changeDirection('down')
			break
	}
})

// remove after development:
startGame()
