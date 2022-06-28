const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

let gridSize;
let hMargin;
let vMargin;
let playableBounds;


const init = () => {
  canvas.height = document.body.clientHeight;
  canvas.width = document.body.clientWidth;

  gridSize = Math.min(canvas.width, canvas.height) - 0.5;
  hMargin = Math.floor((canvas.width - gridSize) / 2) + 0.5;
  vMargin = Math.floor((canvas.height - gridSize) / 2) + 0.5;
  playableBounds = [hMargin, vMargin, gridSize, gridSize];
};

const fillBackground = (winner) => {
  const pageBackground = ctx.createLinearGradient(0, 0, 0, 100);

  switch (winner) {
    case 'X':
      pageBackground.addColorStop(0, '#ccffcc');
      break;
    case 'O':
      pageBackground.addColorStop(0, '#ffcccc');
      break;
    default:
      pageBackground.addColorStop(0, '#cccccc');
      break;
  }
  pageBackground.addColorStop(1, 'white');

  ctx.fillStyle = pageBackground;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawLines = () => {
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.moveTo(hMargin, vMargin);
  ctx.lineTo(canvas.width - hMargin, vMargin);
  ctx.lineTo(playableBounds[2], playableBounds[3]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0.5, 0.5);
  ctx.lineTo(gridSize + .5, gridSize / 3 + .5);
  ctx.fillStyle = null;
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();

};

const refresh = () => {
  init();
  fillBackground();
  drawLines();
};

refresh();

