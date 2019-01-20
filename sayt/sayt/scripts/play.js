window.onload = function() {
  		document.addEventListener('keydown', changeDirection);
  		setInterval(loop, 1000/60);
	};

	var
  		canv = document.getElementById('mc'),
  		ctx	= canv.getContext('2d'),
  		gs = fkp = false,
  		speed = baseSpeed = 3,
  		xv = yv	= 0,
  		px = ~~(canv.width) / 2,
  		py = ~~(canv.height) / 2,
  		pw = ph	= 20,
  		aw = ah	= 20,
  		apples = [],
  		trail = [],
  		tail = 10,
  		tailSafeZone = 20,
  		cooldown = false,
  		score = 0;

	//отвечаем на вопрос
	function opr() {
		let questions = [["В каком году началась Гражданская война на территории бывшей Российской империи?", "1918"],["В каком году произошло восстание декабристов в Петербурге?", "1825"],["В каком году произошла Всероссийская Октябрьская стачка?", "1905"], ["В каком году закончилась ВОВ?", "1945"],["В каком году произошла Отечественная война? ", "1812"], ["Кто был первым правителем Руси?", "Рюрик"],["Кто был последним правителем из династии Романовых?", "Николай 2"],["В каком году сделали первую резиновую уточку?", "Хз"],["В каком году пала Западная Римская империя?", "476"],["В каком году произошло «Бостонское чаепитие»?", "1773"],["В каком году была принята Декларация независимости США?", "1776"],["В каком году был подписан Брестский мир?", "1918"]];
		let max = 11;
		let i = Math.floor(Math.random() * (max + 1));
		let quest = questions[i][0];
		let res = prompt(quest);
		let answer = questions[i][1];
		if (res === answer)
			{return true}
		else
			{return false}
	}
	//основной цикл игры
	function loop() {
  		ctx.fillStyle = 'black';
  		ctx.fillRect(0, 0, canv.width, canv.height);

  		// изменяем координату по осям
  		px += xv;
  		py += yv;

  		// телепортирум
  		if( px > canv.width )
    		{document.location.href ="loser.html"}

  		if( px + pw < 0 )
    		{document.location.href ="loser.html"}

  		if( py + ph < 0 )
    		{document.location.href ="loser.html"}

  		if( py > canv.height )
    		{document.location.href ="loser.html"}

  		// рисуем змейку
  		ctx.fillStyle = 'lime';
  		for( var i = 0; i < trail.length; i++ ) {
    		ctx.fillStyle = trail[i].color || 'lime';
    		ctx.fillRect(trail[i].x, trail[i].y, pw, ph);
  		}

  		trail.push({x: px, y: py, color: ctx.fillStyle});

  		// limiter
  		if( trail.length > tail ) {
    		trail.shift();
  		}

  		// eaten
  		if( trail.length > tail ) {
    		trail.shift();
  		}

  		// self collisions
  		if( trail.length >= tail && gs ) {
    		for( var i = trail.length - tailSafeZone; i >= 0; i-- ) {
      			if((px < (trail[i].x + pw)) && (px + pw > trail[i].x) && (py < (trail[i].y + ph)) && (py + ph > trail[i].y)) {
					document.location.href ="loser.html"
				}
    		}
  		}

  		// paint apples
  		for( var a = 0; a < apples.length; a++ ) {
  			ctx.fillStyle = apples[a].color;
    		ctx.fillRect(apples[a].x, apples[a].y, aw, ah);
  		}

  		// check for snake head collisions with apples
  		for( var a = 0; a < apples.length; a++ ) {
    		if((px < (apples[a].x + pw)) && (px + pw > apples[a].x) && (py < (apples[a].y + ph)) && (py + ph > apples[a].y)) {
      			// got collision with apple
      			apples.splice(a, 1); // remove this apple from the apples list
	  			if (opr) {
		  			tail += 10; // add tail length
		  			speed += .1; // add some speed
	  			}
      			spawnApple(); // spawn another apple(-s)
      			break;
    		}
  		}
}

// apples spawner
function spawnApple() {
  	var
    	newApple = {
      	x: ~~(Math.random() * canv.width),
		y: ~~(Math.random() * canv.height),
      	color: 'red'
    	};

  	// forbid to spawn near the edges
  	if((newApple.x < aw || newApple.x > canv.width - aw) || (newApple.y < ah || newApple.y > canv.height - ah)) {
    	spawnApple();
    	return;
  	}

  	// check for collisions with tail element, so no apple will be spawned in it
  	for( var i = 0; i < tail.length; i++ ) {
    	if((newApple.x < (trail[i].x + pw)) && (newApple.x + aw > trail[i].x) && (newApple.y < (trail[i].y + ph)) && (newApple.y + ah > trail[i].y)) {
      		// got collision
      		spawnApple();
      		return;
		}
  	}

  	apples.push(newApple);
}

// меняем направление движения
function changeDirection(evt) {
  	if( !fkp && [65,87,68,83, 37, 38, 39, 40].indexOf(evt.keyCode) > -1 ) {
    	setTimeout(function() {gs = true;}, 1000);
    	fkp = true;
    	spawnApple();
  	}

  	if( cooldown )
    	{return false;}

  	if( ((evt.keyCode == 65) || (evt.keyCode == 37)) && !(xv > 0) ) // влево
    	{xv = -speed; yv = 0;}

  	if( ((evt.keyCode == 87) || (evt.keyCode == 38)) && !(yv > 0) ) // вверх
    	{xv = 0; yv = -speed;}

  	if( ((evt.keyCode == 68)|| (evt.keyCode == 39)) && !(xv < 0) ) // вправо
    	{xv = speed; yv = 0;}

  	if( ((evt.keyCode == 83) || (evt.keyCode == 40)) && !(yv < 0) ) // вниз
    	{xv = 0; yv = speed;}

  	cooldown = true;
  	setTimeout(function() {cooldown = false;}, 100);
}