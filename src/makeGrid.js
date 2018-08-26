const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')
let gridSettings = require('./grid-settings')
let { gridWidth, cellSize } = gridSettings

function makeOutline(x, y, w, h) {
	ctx.beginPath()
	ctx.rect(x, y, w, h)
	ctx.strokeStyle = 'black'
	ctx.fillStyle = 'black'
	ctx.stroke()
	ctx.fill()
	ctx.closePath()
}

const makeTwoVericalLines = (x) => makeOutline(x, 0, 20, gridWidth)
const makeTwoHorizontalLines = (y) => makeOutline(0, y, gridWidth, 20)

function makeGridLines(gridWidth, cellSize) {
	console.log('what')
	makeOutline(0, 0, 100, 100)
	// makeTwoVericalLines(0)
	// makeTwoHorizontalLines(0)
	// for (let x = cellSize; x < gridWidth; x += cellSize) {}
}

makeGridLines(gridWidth, cellSize)
