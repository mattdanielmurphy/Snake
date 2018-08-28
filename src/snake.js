const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')

let rawGridWidth = Math.min(window.innerHeight - 100, window.innerWidth - 100)

const gridTiles = 21
let cellSize = Math.round(rawGridWidth / gridTiles)
let gridWidth = cellSize * gridTiles
let startPos = Math.floor(gridTiles / 2)
let gridColor = '#10242E'
const snakeHeadColor = '#3E7037'
const snakeBodyColor = '#589E4D'
const dotColor = 'white'
const clockSpeed = 80

const gameOver = document.getElementById('game-over')

let x
let y
let directionLastMovedIn
canvas.width = gridWidth
canvas.height = gridWidth

function strObj(str) {
	// function used to read highscore from cookie
	// in endGame() to see if should set highscore
	let result = {}
	str.split(', ').forEach((keyValuePair, i) => {
		let [ key, value ] = keyValuePair.split('=')
		result[key] = value
	})
	return result
}

class Game {
	constructor() {
		this.score = 0
	}
	startGame() {
		statsElement.innerHTML = `<p>Current score: ${this.score}</p><p>Highscore: ${this.highscore}</p>`
		snake.length = 4
		gameOver.className = 'hidden'
		y = x = startPos * cellSize
		snake.body = []
		playing = true
		drawInterval = setInterval(this.draw, clockSpeed)
		this.drawScore()
		this.draw()
		this.generateFood()
	}
	draw() {
		snake.tryToMove()
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		snake.drawBody()
		snake.drawHead()
		drawBox(foodX, foodY, cellSize, cellSize, { fill: dotColor })
		// <span>highscore:${this.getHighscore()}</span>`
	}
	drawScore() {
		statsElement.innerHTML = `<p>Score: ${this.score}</p><p>Highest: ${this.highscore}</p>`
	}
	get highscore() {
		return strObj(document.cookie).highscore || this.setHighscore()
	}
	setHighscore() {
		document.cookie = `highscore=${this.score}`
		return this.score
	}
	clearScore() {
		this.score = 0
	}
	incrementScore() {
		this.score++
		this.drawScore()
	}
	endGame() {
		if (this.score > Number(this.highscore)) {
			this.setHighscore()
			console.log('highscore set:', this.score)
		}
		this.clearScore()
		gameOver.className = ''
		playing = false
		clearInterval(drawInterval)
	}
	generateFood() {
		const randomN = () => Math.floor(Math.random() * gridTiles)
		foodX = randomN() * cellSize
		foodY = randomN() * cellSize

		if (snake.body.includes(`${foodX}:${foodY}`)) this.generateFood()
	}
}

let statsContainer = document.getElementById('stats-container')

function setLayout() {
	// console.log('set layout:', horizontalLayout)
	if (window.innerHeight / window.innerWidth < 0.9) {
		statsContainer.className = 'horizontal-layout'
	} else {
		statsContainer.className = 'vertical'
	}
}

setLayout()

let resize

window.addEventListener('resize', (e) => {
	clearTimeout(resize)
	resize = setTimeout(() => {
		rawGridWidth = Math.min(window.innerHeight - 100, window.innerWidth - 100)
		cellSize = Math.round(rawGridWidth / gridTiles)
		gridWidth = cellSize * gridTiles
		canvas.width = gridWidth
		canvas.height = gridWidth
		y = x = startPos * cellSize
		setLayout()
		game.generateFood()
		game.draw()
	}, 500)
})

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
				if (options[option]) {
					ctx.strokeStyle = options[option]
					ctx.stroke()
				}
				break
			default:
				ctx.strokeStyle = 'black'
				ctx.stroke()
		}
	})
	ctx.closePath()
}

let direction = 'right'

class Snake {
	constructor(headColor, bodyColor) {
		this.x = x
		this.y = y
		this.bodyColor = bodyColor
		this.headColor = headColor
		this.body = [ `${startPos * cellSize}:${startPos * cellSize}` ]
		this.directionCmd = {
			right: () => (this.x += cellSize),
			left: () => (this.x -= cellSize),
			up: () => (this.y -= cellSize),
			down: () => (this.y += cellSize)
		}
	}

	drawBody() {
		this.body.forEach((coords) => {
			coords = /(\d+):(\d+)/.exec(coords)
			if (coords !== null) {
				let [ , x, y ] = coords
				drawBox(x, y, cellSize, cellSize, { fill: this.bodyColor })
			}
		})
	}

	drawHead() {
		drawBox(x, y, cellSize, cellSize, { fill: this.headColor })
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
	tryToMove() {
		this.move()
	}

	move() {
		directionLastMovedIn = direction
		this.x = x
		this.y = y
		this.directionCmd[direction].call()
		const isValid = (x, y) => {
			return x >= 0 && x < gridWidth && y >= 0 && y < gridWidth && !this.body.includes(`${x}:${y}`)
		}
		if (isValid(this.x, this.y)) {
			x = this.x
			y = this.y
			this.body.push(`${x}:${y}`)
			if (this.body.length === this.length + 1) this.body.shift()
		} else {
			game.endGame()
		}

		if (x === foodX && y === foodY) this.eatFood()
	}
	eatFood() {
		game.incrementScore()
		this.length++
		game.generateFood()
	}
}

let game = new Game()
let snake = new Snake(snakeHeadColor, snakeBodyColor)

let playing = false
let moveInterval
let drawInterval
let foodX
let foodY
let statsElement = document.getElementById('stats')

// Keyboard Listener

const keyToCommand = {
	ArrowUp: () => {
		snake.changeDirection('up')
	},
	ArrowLeft: () => {
		snake.changeDirection('left')
	},
	ArrowDown: () => {
		snake.changeDirection('down')
	},
	ArrowRight: () => {
		snake.changeDirection('right')
	},
	// Alternate WASD controls
	w: () => {
		snake.changeDirection('up')
	},
	a: () => {
		snake.changeDirection('left')
	},
	s: () => {
		snake.changeDirection('down')
	},
	d: () => {
		snake.changeDirection('right')
	},
	// developer tools
	r: () => {
		game.endGame()
		game.startGame()
	}
}

document.addEventListener('keydown', (e) => {
	if (!playing) game.startGame()
	command = keyToCommand[e.key]
	if (command) command()
})

// remove after development:
game.startGame()
