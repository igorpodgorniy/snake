'use strict';
// Настройка холстов с прогрессом и игрой
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let gameInfo = document.getElementById("gameInfo");
let ctx2 = gameInfo.getContext("2d");
		
// Получаем ширину и высоту элемента canvas
const width = canvas.width;
const height = canvas.height;

// Получаем ширину и высоту элемента gameInfo
const widthInfo = gameInfo.width;
const heightInfo = gameInfo.height;
		
// Помещаем холст в нужное место
canvas.style.setProperty('left', (window.innerWidth - width) / 4 + 'px');
canvas.style.setProperty('top', (window.innerHeight - height) / 2 + 'px');

gameInfo.style.setProperty('left', (window.innerWidth - width) / 4 + 'px');
gameInfo.style.setProperty('top', (window.innerHeight - height) / 2 - 50 + 'px');
		
// Вычисляем ширину и высоту ячейки
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;
		
// Устанавливаем счёт 0 и номер уровня 1
let score = 0;
let level = 1;

// Устанавливаем количество жизней "///" и счётчик жизней
let lives = "///";
let countLives = 3;

// Расчёты препятсвия для уровней 3 и 4
const strip = Math.floor(height / 3) - Math.floor(height / 3) % 10;

// Рисуем препятсвие рамка (второй уровень и часть третьего)
const drawBorder = function() {
	ctx.fillStyle = "Grey";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Функция создания массива занятых препятствиями ячеек в зависимости от уровня
const occupied = function() {
	let occupiedLevelBlocks = [];
	let occupiedLevelFourthBlocks = [];
	let longitude = 2 * widthInBlocks / 4;
	
	for (let i = 0; i <= longitude; i++) {
		if (level === 3) {
			occupiedLevelBlocks[i] = new Block(longitude / 2 + i, heightInBlocks / 2); // препятствие по середине
		} else if (level === 4) {
			occupiedLevelBlocks[i] = new Block(longitude / 2 + i, strip / blockSize); // препятствие сверху в уровне 4
			occupiedLevelFourthBlocks[i] = new Block(longitude / 2 + i, 2 * strip / blockSize); // препятсвие снизу в уровне 4
		}
	}
	occupiedLevelBlocks = occupiedLevelBlocks.concat(occupiedLevelFourthBlocks);
	
	return occupiedLevelBlocks;
};

// Рисуем препятсвия для третьего уровня
const drawThirdLvl = function() {
	ctx.fillStyle = "Grey";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	
	ctx.fillRect(0, 0, blockSize, strip);
	ctx.fillRect(0, 2 * strip, blockSize, strip);
	
	ctx.fillRect(height - blockSize, 0, blockSize, strip);
	ctx.fillRect(height - blockSize, 2 * strip, blockSize, strip);
	
	ctx.fillRect(width / 4, height / 2, width / 2, blockSize);
};

// Рисуем препятсвия для четвёртого уровня
const drawFourthLvl = function() {
	ctx.fillStyle = "Grey";
	ctx.fillRect(width / 4, strip, width / 2, blockSize);
	ctx.fillRect(width / 4, 2 * strip, width / 2, blockSize);
};

// Рисуем препятсвия уровней в gameLoop и при столкновениях
const drawLevelBarrier = function(level) {
	if (level === 2) {
		drawBorder(); // второй уровень
	} else if (level === 3) {
		drawThirdLvl(); // третий уровень
	} else if (level === 4) {
		drawBorder();
		drawFourthLvl(); // четвёртый уровень
	}
};

// Рисуем стартовый экран
const drawStart = function() {
	continueGame = false;
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Начать игру", width / 2, height / 2);
};

// Пишем надпись с предложением начать
const drawContinue = function() {
	ctx2.clearRect(0, 0, widthInfo, heightInfo);
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "center";
	ctx2.textBaseline = "top";
	ctx2.fillText("Нажмите SPACE, чтобы играть", widthInfo / 2, blockSize);
};

// Пишем надпись с предложением продолжить
const drawContinue2 = function() {
	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillText("Выбирите направление", width / 2, height / 4.5);
	ctx.fillText("для продолжения", width / 2, height / 2.5);
	ctx.fillText("и нажмите SPACE", width / 2, 2 * height / 3.5);
};

// Пишем надпись о переходе на следующий уровень
const drawLevelUp = function() {
	continueGame = false;
	ctx.font = "20px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillText("Вы прошли", width / 2, height / 4.5);
	ctx.fillText("на", width / 2, height / 2.5);
	ctx.fillText("уровень № " + level, width / 2, 2 * height / 3.5);
};
		
// Выводим счёт игры в левом верхнем углу
const drawScore = function() {
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "left";
	ctx2.textBaseline = "top";
	ctx2.fillText("Score: " + score, blockSize, blockSize);
};
		
// Выводим номер уровня сверху посередине
const drawLevel = function() {
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "center";
	ctx2.textBaseline = "top";
	ctx2.fillText("Lvl: " + level, widthInfo / 2, blockSize);
};
		
// Выводим количество жизней в правом верхнем углу
const drawLives = function() {
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "right";
	ctx2.textBaseline = "top";
	ctx2.fillText("Lives: " + lives, widthInfo - blockSize, blockSize);
};

// Отменяем действие setInterval и печатаем сообщение "Проиграли!"
const gameOver = function() {
	playing = false;
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Проиграли!", width / 2, height / 2);
};

// Отменяем действие setInterval и печатаем сообщение "ПОБЕДА!"
const win = function() {
	playing = false;
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("ПОБЕДА!", width / 2, height / 2);
};

// Рисуем окружность
const circle = function(x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
};

// Задаём конструктор Block (ячейка)
const Block = function(col, row) {
	this.col = col;
	this.row = row;
};

// Рисуем квадрат в позиции ячейки
Block.prototype.drawSquare = function (color) {
	let x = this.col * blockSize;
	let y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};

// Рисуем круг в позиции ячейки
Block.prototype.drawCircle = function (color) {
	let centerX = this.col * blockSize + blockSize / 2;
	let centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};

// Проверяем, находится ли эта ячейка в той же позиции, что и ячейка otherBlock
Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};

// Задаём конструктор Snake (змейка)
const Snake = function() {
	this.segments = [
		new Block(9, 18),
		new Block(8, 18),
		new Block(7, 18),
		new Block(6, 18),
		new Block(5, 18),
		new Block(4, 18)
	];
	
	this.direction = "right";
	this.nextDirection = "right";
};

// Рисуем квадратик для каждого сегмента тела змейки
Snake.prototype.draw = function() {
	this.segments[0].drawSquare("Green");
	for (let i = 1; i < this.segments.length; i++) {
		if (i % 2 === 0) {
			this.segments[i].drawSquare("Blue");
		} else {
			this.segments[i].drawSquare("Yellow");
		}
	}
};

// Создаём новую голову и добавляем её к началу змейки, чтобы передвинуть змейку в текущем направлении
Snake.prototype.move = function() {
	let head = this.segments[0];
	let newHead;
	
	this.direction = this.nextDirection;
	
	if (this.direction === "right") {
		if (head.col > widthInBlocks - 2) {
			newHead = new Block(0, head.row);
		} else {
			newHead = new Block(head.col + 1, head.row);
		}
	}
	else if (this.direction === "down") {
		if (head.row > heightInBlocks - 2) { 
			newHead = new Block(head.col, 0);
		} else {
			newHead = new Block(head.col, head.row + 1);
		}
	} else if (this.direction === "left") {
		if (head.col - 1 < 0) {
			newHead = new Block(widthInBlocks - 1, head.row);
		} else {
			newHead = new Block(head.col - 1, head.row);
		}
	} else if (this.direction === "up") {
		if (head.row - 1 < 0) {
			newHead = new Block(head.col, heightInBlocks - 1);
		} else {
			newHead = new Block(head.col, head.row - 1);
		}
	}
	
	let collisionLevel;
	if (level === 1) {
		collisionLevel = this.checkCollissionFerstLvl(newHead);
	} else if (level === 2) {
		collisionLevel = this.checkCollissionSecondLvl(newHead);
	} else if (level === 3) {
		collisionLevel = this.checkCollissionThirdLvl(newHead);
	} else {
		collisionLevel = this.checkCollissionFourthLvl(newHead);
	}

	if (collisionLevel) {		
		countLives--;
		lives = lives.replace("/", " ");
		continueGame = false;
		if (countLives === 0) {
			gameOver();
		} else {
			drawContinue();
			drawContinue2();
			drawLevelBarrier(level);
		}
		return;
	}
	
	this.segments.unshift(newHead);
	
	if (newHead.equal(apple.position)) {
		score++;
		if (score !== 3) {
			animationTime -= 5;
			apple.move(this.segments);
		} else {
			level++;
			if (level === 5) {
				setTimeout(win);
				win();
			} else {
				score = 0;
				animationTime = time;
				continueGame = false;
				setTimeout(newSnakeApple);
				drawContinue();
				drawLevelBarrier(level - 1);
				setTimeout(drawLevelUp);
			}
		}
			
	} else {
		this.segments.pop();
	}
};

// Проверяем, не столкнулась ли змейка с собственным телом
Snake.prototype.checkCollissionFerstLvl = function(head) {
	let selfCollision = false;
	
	for (let i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true;
		}
	}
	return selfCollision;
};

// Проверяем, не столкнулась ли змейка со стеной или собственным телом
Snake.prototype.checkCollissionSecondLvl = function(head) {
	const leftCollision = (head.col === 0);
	const topCollision = (head.row === 0);
	const rightCollision = (head.col === widthInBlocks - 1);
	const bottomCollision = (head.row === heightInBlocks - 1);
	
	const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
	
	return wallCollision || this.checkCollissionFerstLvl(head);
};

// Проверяем, не столкнёться ли змейка в препятсвиями третьего уровня
Snake.prototype.checkCollissionThirdLvl = function(head) {
	const lineCollision = (head.row === heightInBlocks / 2 && head.col < 3 * widthInBlocks / 4 && head.col >= widthInBlocks / 4);
	const topCollision = (head.row === 0);
	const bottomCollision = (head.row === heightInBlocks - 1);
	
	const leftTopCollision = (head.col === 0 && head.row > 0 && head.row < Math.floor(heightInBlocks / 3));
	const leftBottomCollision = (head.col === 0 && head.row > 2 * Math.floor(heightInBlocks / 3) && head.row < heightInBlocks - 1);
	const rightTopCollision = (head.col === widthInBlocks - 1 && head.row > 0 && head.row < Math.floor(heightInBlocks / 3));
	const rightBottomCollision = (head.col === widthInBlocks - 1 && head.row > 2 * Math.floor(heightInBlocks / 3) && head.row < heightInBlocks - 1);
	
	const linesCollision = lineCollision || topCollision || bottomCollision || leftTopCollision || leftBottomCollision || rightTopCollision || rightBottomCollision;
	
	return linesCollision;
};

// Проверяем, не столкнулась ли змейка с препятствием четвёртого уровня
Snake.prototype.checkCollissionFourthLvl = function(head) {
	const tCollision = (head.row === Math.floor(heightInBlocks / 3) && head.col < 3 * widthInBlocks / 4 && head.col >= widthInBlocks / 4);
	const bCollision = (head.row === Math.floor(2 * heightInBlocks / 3) && head.col < 3 * widthInBlocks / 4 && head.col >= widthInBlocks / 4);
	
	const wCollision = tCollision || bCollision;
	
	return this.checkCollissionSecondLvl(head) || wCollision;
};

// Задаём следующее направление движения змейки на основе нажатой клавиши
Snake.prototype.setDirection = function(newDirection) {
	if (this.direction === "up" && newDirection === "down") {
		return;
	} else if (this.direction === "right" && newDirection === "left") { 
		return;
	} else if (this.direction === "down" && newDirection === "up") {
		return;
	} else if (this.direction === "left" && newDirection === "right") {
		return;
	}
	this.nextDirection = newDirection;
};

// Задаём конструктор Apple (яблоко)
const Apple = function() {
	this.move(snake.segments);
};

// Рисуем кружок в позиции яблока
Apple.prototype.draw = function() {
	this.position.drawCircle("LimeGreen");
};

// Перемещаем яблоко в случайную позицию
Apple.prototype.move = function(occupiedBlocks) {
	const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
	const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
	this.position = new Block(randomCol, randomRow);
	
	occupiedBlocks = occupied().concat(occupiedBlocks);
	
	let index = occupiedBlocks.length - 1;
	while (index >= 0) {
		if (this.position.equal(occupiedBlocks[index])) {
			this.move(occupiedBlocks);
			return;
		}
		index--;
	}
};

// Функция создания новых змейки и яблока при переходе на следующий уровень
const newSnakeApple = function() {
	snake = new Snake();
	apple = new Apple();
};

// Создаём объект-змейку и объект-яблоко
let snake = new Snake();
let apple = new Apple();

// Задаём флаги продолжения анимации, поставноки на паузу и окончания игры
let continueGame = false;
let esc = false;
let playing = true;

// Задаём начальное время анимации
const time = 110;
let animationTime = time;


// Задаём функцию анимации уровней
let gameLoop = function() {
	ctx.clearRect(0, 0, width, height);
	ctx2.clearRect(0, 0, widthInfo, heightInfo);
	drawScore();
	drawLevel();
	drawLives();
	apple.draw();
	snake.move();
	snake.draw();
	
	if (continueGame) {
		drawLevelBarrier(level);
		if (playing) {
			setTimeout(gameLoop, animationTime);
		}
	}
};

// Выводим стартовый экран
drawStart();
drawContinue();

// Преобразуем коды клавиш в направления
const directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};

// Задаём обработчик события keydown (клавиши-стрелки)
$("body").keydown(function(event) {
	if (event.keyCode === 32 && playing) {
		continueGame = true;
		esc = false;
		gameLoop();
	} else if (event.keyCode === 27) {
		continueGame = false;
		esc = true;
	}
	let newDirection = directions[event.keyCode];
	if (newDirection !== undefined && !esc) {
		snake.setDirection(newDirection);
	}
});