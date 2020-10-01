// Настройка холстов с прогрессом и игрой
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var gameInfo = document.getElementById("gameInfo");
var ctx2 = gameInfo.getContext("2d");
		
// Получаем ширину и высоту элемента canvas
var width = canvas.width;
var height = canvas.height;

// Получаем ширину и высоту элемента gameInfo
var widthInfo = gameInfo.width;
var heightInfo = gameInfo.height;
		
// Помещаем холст в нужное место
canvas.style.setProperty('left', (window.innerWidth - width) / 4 + 'px');
canvas.style.setProperty('top', (window.innerHeight - height) / 2 + 'px');

gameInfo.style.setProperty('left', (window.innerWidth - widthInfo) / 4 + 'px');
gameInfo.style.setProperty('top', (window.innerHeight - heightInfo) / 4.5 + 'px');
		
// Вычисляем ширину и высоту ячейки
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;
		
// Устанавливаем счёт 0 и номер уровня 1
var score = 0;
var level = 1;

// Устанавливаем количество жизней "///" и счётчик жизней
var lives = "///";
var countLives = 3;
		
// Рисуем рамку
var drawBorder = function() {
	ctx.fillStyle = "Grey";
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Рисуем стартовый экран
var drawStart = function() {
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Начать игру", width / 2, height / 2);
	
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "center";
	ctx2.textBaseline = "top";
	ctx2.fillText("Нажмите SPACE, чтобы играть", widthInfo / 2, blockSize);
};
		
// Выводим счёт игры в левом верхнем углу
var drawScore = function() {
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "left";
	ctx2.textBaseline = "top";
	ctx2.fillText("Score: " + score, blockSize, blockSize);
};
		
// Выводим номер уровня сверху посередине
var drawLevel = function() {
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "center";
	ctx2.textBaseline = "top";
	ctx2.fillText("Lvl: " + level, widthInfo / 2, blockSize);
};
		
// Выводим количество жижней в правом верхнем углу
var drawLives = function() {
	ctx2.font = "20px Courier";
	ctx2.fillStyle = "Black";
	ctx2.textAlign = "right";
	ctx2.textBaseline = "top";
	ctx2.fillText("Lives: " + lives, widthInfo - blockSize, blockSize);
};

// Отменяем действие setInterval и печатаем сообщение "Конец игры"
var gameOver = function() {
	playing = false;
	ctx.font = "60px Courier";
	ctx.fillStyle = "Black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Конец игры", width / 2, height / 2);
};

// Рисуем окружность
var circle = function(x, y, radius, fillCircle) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	if (fillCircle) ctx.fill();
	else ctx.stroke();
};

// Задаём конструктор Block (ячейка)
var Block = function(col, row) {
	this.col = col;
	this.row = row;
};

// Рисуем квадрат в позиции ячейки
Block.prototype.drawSquare = function (color) {
	var x = this.col * blockSize;
	var y = this.row * blockSize;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};

// Рисуем круг в позиции ячейки
Block.prototype.drawCircle = function (color) {
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};

// Проверяем, находится ли эта ячейка в той же позиции, что и ячейка otherBlock
Block.prototype.equal = function (otherBlock) {
	return this.col === otherBlock.col && this.row === otherBlock.row;
};

// Задаём конструктор Snake (змейка)
var Snake = function() {
	this.segments = [
		new Block(7, 5),
		new Block(6, 5),
		new Block(5, 5)
	];
	
	this.direction = "right";
	this.nextDirection = "right";
};

// Рисуем квадратик для каждого сегмента тела змейки
Snake.prototype.draw = function() {
	this.segments[0].drawSquare("Green");
	for (var i = 1; i < this.segments.length; i++) {
		if (i % 2 === 0) this.segments[i].drawSquare("Blue");
		else this.segments[i].drawSquare("Yellow");
	}
};

// Создаём новую голову и добавляем её к началу змейки, чтобы передвинуть змейку в текущем направлении
Snake.prototype.move = function(){
	var head = this.segments[0];
	var newHead;
	
	this.direction = this.nextDirection;
	
	if (this.direction === "right") newHead = new Block(head.col + 1, head.row);
	else if (this.direction === "down") newHead = new Block(head.col, head.row + 1);
	else if (this.direction === "left") newHead = new Block(head.col - 1, head.row);
	else if (this.direction === "up") newHead = new Block(head.col, head.row - 1);
	
	if (this.checkCollission(newHead)) {
		gameOver();
		return;
	}
	
	this.segments.unshift(newHead);
	
	if (newHead.equal(apple.position)) {
		score++;
		animationTime -= 5;
		apple.move(this.segments);
	} else this.segments.pop();
};

// Проверяем, не столкнулась ли змейка со стеной или собственным телом
Snake.prototype.checkCollission = function(head) {
	var leftCollision = (head.col === 0);
	var topCollision = (head.row === 0);
	var rightCollision = (head.col === widthInBlocks - 1);
	var bottomCollision = (head.row === heightInBlocks - 1);
	
	var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
	
	var selfCollision = false;
	
	for (var i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) selfCollision = true;
	}
	
	return wallCollision || selfCollision;
};

// Задаём следующее направление движения змейки на основе нажатой клавиши
Snake.prototype.setDirection = function(newDirection) {
	if (this.direction === "up" && newDirection === "down") return;
	else if (this.direction === "right" && newDirection === "left") return;
	else if (this.direction === "down" && newDirection === "up") return;
	else if (this.direction === "left" && newDirection === "right") return;
	
	this.nextDirection = newDirection;
};

// Задаём конструктор Apple (яблоко)
var Apple = function() {
	this.position = new Block(10, 10);
};

// Рисуем кружок в позиции яблока
Apple.prototype.draw = function() {
	this.position.drawCircle("LimeGreen");
};

// Перемещаем яблоко в случайную позицию
Apple.prototype.move = function(occupiedBlocks) {
	var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
	var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
	this.position = new Block(randomCol, randomRow);
	
	var index = occupiedBlocks.length - 1;
	while (index >= 0) {
		if (this.position.equal(occupiedBlocks[index])) {
			this.move(occupiedBlocks);
			return;
		}
		index--;
	}
};

// Создаём объект-змейку и объект-яблоко
var snake = new Snake();
var apple = new Apple();

// Задаём флаг продолжения анимации
var playing = true;

// Задаём функцию анимации gameLoop и начальное время анимации
var animationTime = 120;
var gameLoop = function() {
	ctx.clearRect(0, 0, width, height);
	ctx2.clearRect(0, 0, widthInfo, heightInfo);
	drawScore();
	drawLevel();
	drawLives();
	snake.move();
	snake.draw();
	apple.draw();
	drawBorder();
	
	if (playing) setTimeout(gameLoop, animationTime);
};

drawStart();
// Запускаем функцию анимации gameLoop
gameLoop();

// Преобразуем коды клавиш в направления
var directions = {
	37: "left",
	38: "up",
	39: "right",
	40: "down"
};

// Задаём обработчик события keydown (клавиши-стрелки)
$("body").keydown(function(event) {
	var newDirection = directions[event.keyCode];
	if (newDirection !== undefined) snake.setDirection(newDirection);
});