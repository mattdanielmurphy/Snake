class Grid {
	constructor() {
		this.gridWidth = Math.min(window.innerHeight - 100, window.innerWidth - 100)
		this.cellSize = 20
		this.x = this.gridWidth / 2
		this.y = this.gridWidth / 2
	}
}

module.exports = new Grid()
