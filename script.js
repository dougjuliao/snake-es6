'use strict';
/*
	@Autor: Douglas Julião
	@GitHub: https://github.com/dougjuliao/
	E-mail: douglas_juliao16@hotmail.com
*/
let loopAnimation;
let Snake = {
	canvas: document.getElementById('snake_game'),
	ctx: document.getElementById('snake_game').getContext('2d'),
	width: 400,
	height: 400,
	snakeSize: 10,
	score: 0,
	snakeBody: [],
	food: {},
	direction: '',
	init: () => {
		//DEFAULTS
		Snake.direction = 'down';
		Snake.snakeBody = [];
		Snake.snakeSize = 10;
		Snake.score = 0;
		Snake.food = {};

		//ACTIONS
	    Snake.createSnake();
	    Snake.createFood();
	    Snake.arrowSetting();

	    clearInterval(loopAnimation);
	    loopAnimation = setInterval(() => {
	    	Snake.drawElements.paint();
	    },80);
	},
	arrowSetting: () => {
		document.onkeydown = (ev) => {
			let code = ev.keyCode;
			switch(code){
				case 37:
					Snake.direction = Snake.direction !== 'right' ? 'left' : 'right';
				break;
				case 38:
					Snake.direction = Snake.direction !== 'down' ? 'up' : 'down';
				break;
				case 39:
					Snake.direction = Snake.direction !== 'left' ? 'right' : 'left';
				break;
				case 40:
					Snake.direction = Snake.direction !== 'up' ? 'down' : 'up';
				break;
			}
		}
	},
	createSnake: () => {
        for(let i = 4; i >= 0; i--) {
            Snake.snakeBody.push({ x: i, y: 0 });
        }
	},
	createFood: () => {
		let w = 39;
		Snake.food.x = Math.floor((Math.random() * w) + 1);
		Snake.food.y = Math.floor((Math.random() * w) + 1);

		let snake = Snake.snakeBody,
			food  = Snake.food;

		for(let i = 0; i > snake.length; i++) { // POSITION SNAKE BODY
            let snakeX = snake[i].x,
            	snakeY = snake[i].y;

            if (food.x === snakeX || food.y === snakeY || food.y === snakeY && food.x === snakeX) {
                Snake.food.x = Math.floor((Math.random() * w) + 1);
                Snake.food.y = Math.floor((Math.random() * w) + 1);
            }
        }
	},
	drawElements: {
		snake : (x,y) => {
			let size = Snake.snakeSize;
			Snake.ctx.fillStyle = '#555';
			Snake.ctx.fillRect(x*size, y*size, size, size);
		},
		food: (x,y) => {
			let size = Snake.snakeSize;
	        Snake.ctx.fillStyle = '#555';
	        Snake.ctx.fillRect(x*size, y*size, size, size);
		},
		score: () => {
			let score = "Score: " + Snake.score;
	        Snake.ctx.fillStyle = '#555';
	        Snake.ctx.fillText(score, 200, Snake.height-5);
		},
		paint: () => {
			//background
		    Snake.ctx.fillStyle = '#b7d49a';
		    Snake.ctx.fillRect(0, 0, Snake.width, Snake.height);
		    Snake.ctx.strokeStyle = '#6c8237';
		    Snake.ctx.strokeRect(0, 0, Snake.width, Snake.height);

		    let snakeX = Snake.snakeBody[0].x,
		    	snakeY = Snake.snakeBody[0].y,
		    	direction = Snake.direction;

		    let tail = null;

		    if (direction == 'right') {
		        snakeX++;
		    } else if (direction == 'left') {
		        snakeX--;
		    } else if (direction == 'up') {
		        snakeY--;
		    } else if (direction == 'down') {
		        snakeY++;
		    }

		    if (snakeX == -1 || snakeX == Snake.width / Snake.snakeSize || snakeY == -1 || snakeY == Snake.height / Snake.snakeSize || Snake.explodeArea(snakeX, snakeY, Snake.snake)) {
		        //CLEAR GAME
		        Snake.ctx.clearRect(0, 0, Snake.width, Snake.height);
		        clearInterval(loopAnimation);
		        return;
		    }
		    //SNAKE EAT AND CHECK TO NEW FOOD ADDED TO SNAKE
		    if (snakeX == Snake.food.x && snakeY == Snake.food.y) {
		        tail = { x: snakeX, y: snakeY };
		        Snake.score++;

		        Snake.createFood();
		    } else {
		        tail = Snake.snakeBody.pop();
		        tail.x = snakeX;
		        tail.y = snakeY;
		    }
		    Snake.snakeBody.unshift(tail);

		    for (var i = 0; i < Snake.snakeBody.length; i++) { // CREATE SNAKE
		       Snake.drawElements.snake(Snake.snakeBody[i].x, Snake.snakeBody[i].y);
		    }

		    Snake.drawElements.food(Snake.food.x,Snake.food.y); //CREATE FOOD
		    Snake.drawElements.score(); //CREATE SCORE
		}
	},
	explodeArea: (x,y) => {
		let snake = Snake.snakeBody;
		for(let i = 0, len = snake.length; i < len; i++) {
            if(snake[i].x === x && snake[i].y === y){
            	return true;
            }
        }
        return false;
	}
};

document.querySelector('#snake_start').addEventListener('click',(e) => {
	Snake.init();
});
