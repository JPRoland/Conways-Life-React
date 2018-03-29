/**
 * Implemention of Conway's game of Life
 */

/**
 * Make a 2D array helper function
 */
function Array2D(width, height) {
  let a = new Array(height);

  for (let i = 0; i < height; i++) {
    a[i] = new Array(width);
  }

  return a;
}

/**
 * Function to rotate glider so they don't all go the same direction
 */

function rotateMatrixLeft(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n / 2; i++) {
    for (let j = i; j < n - i - 1; j++) {
      let temp = matrix[i][j];
      matrix[i][j] = matrix[j][n - 1 - i];
      matrix[j][n - 1 - i] = matrix[n - 1 - i][n - 1 - j];
      matrix[n - 1 - i][n - 1 - j] = matrix[n - 1 - j][i];
      matrix[n - 1 - j][i] = temp;
    }
  }
}

/**
 * Life class
 */
class Life {
  /**
   * Constructor
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.buffer = [Array2D(width, height), Array2D(width, height)];
    this.activeBufferIdx = 0;

    this.clear();
  }

  /**
   * Return the current active buffer
   */
  getCells() {
    return this.buffer[this.activeBufferIdx];
  }

  /**
   * Clear the life grid
   */
  clear() {
    this.buffer[this.activeBufferIdx] = this.buffer[this.activeBufferIdx].map(
      row => row.fill(0)
    );
  }

  /**
   * Randomize the life grid
   */
  randomize() {
    this.buffer[this.activeBufferIdx] = this.buffer[this.activeBufferIdx].map(
      row => row.map(cell => (cell = Math.round(Math.random())))
    );
  }

  /**
   * Add a glider to a random location on the grid
   */
  addGlider() {
    const height = this.height;
    const width = this.width;

    const buffer = this.buffer[this.activeBufferIdx];

    let glider = [[1, 1, 1], [1, 0, 0], [0, 1, 0]];

    // Number of times to rotate the glider to get a random direction
    let rotations = ~~(Math.random() * 4);

    for (let i = 0; i < rotations; i++) {
      rotateMatrixLeft(glider);
    }

    let row = ~~(Math.random() * (height - glider.length));
    let col = ~~(Math.random() * (width - glider[0].length));

    for (let i = row, k = 0; k < glider.length; i++, k++) {
      for (let j = col, l = 0; l < glider[0].length; j++, l++) {
        buffer[i][j] = glider[k][l];
      }
    }
  }

  /**
   * Add a Gosper glider gun to a random location on the grid
   */
  addGosperGliderGun() {
    const height = this.height;
    const width = this.width;

    const buffer = this.buffer[this.activeBufferIdx];

    // prettier-ignore
    const gun = [
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0 ],
      [ 0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
      [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
      ];

    let row = ~~(Math.random() * (height - gun.length));
    let col = ~~(Math.random() * (width - gun[0].length));

    for (let i = row, k = 0; k < gun.length; i++, k++) {
      for (let j = col, l = 0; l < gun[0].length; j++, l++) {
        buffer[i][j] = gun[k][l];
      }
    }
  }

  /**
   * Run the simulation for a single step
   */
  step() {
    const workBuffIdx = this.activeBufferIdx === 0 ? 1 : 0;
    const workBuffer = this.buffer[workBuffIdx];
    const activeBuffer = this.buffer[this.activeBufferIdx];

    const checkNeighbors = (x, y, buffer) => {
      let neighbors = 0;
      let up = y - 1;
      let down = y + 1;
      let left = x - 1;
      let right = x + 1;

      // If at an edge wrap to the opposite side
      if (up < 0) {
        up = buffer.length - 1;
      }

      if (down === buffer.length) {
        down = 0;
      }

      if (left < 0) {
        left = buffer[y].length - 1;
      }

      if (right === buffer[y].length) {
        right = 0;
      }

      neighbors =
        buffer[up][left] +
        buffer[up][x] +
        buffer[up][right] +
        buffer[y][left] +
        buffer[y][right] +
        buffer[down][left] +
        buffer[down][right] +
        buffer[down][x];

      return neighbors;
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let liveNeighbors = checkNeighbors(x, y, activeBuffer);

        if (activeBuffer[y][x] === 1) {
          if (liveNeighbors === 2 || liveNeighbors === 3) {
            workBuffer[y][x] = 1;
          } else {
            workBuffer[y][x] = 0;
          }
        } else {
          if (liveNeighbors === 3) {
            workBuffer[y][x] = 1;
          } else {
            workBuffer[y][x] = 0;
          }
        }
      }
    }

    this.activeBufferIdx = this.activeBufferIdx === 0 ? 1 : 0;
  }
}

export default Life;
