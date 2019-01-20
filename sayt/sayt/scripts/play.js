var canv = document.getElementById('mc');
window.onload = function() {
    var n = window.innerWidth;
    var k = window.innerHeight;
    var val = n.toString() + "px";
    var vul = k.toString() +"px";
    canv.style.width = val;
    canv.style.height = vul;
    console.log(val);
    document.addEventListener('keydown', changeDirection);
    setInterval(loop, 1000/60);
};

var
    ctx	= canv.getContext('2d'),
    gs = fkp = false,
    speed = baseSpeed = 1,//скорость движения
    xv = yv	= 0,//скорость по х и по y
    px = ~~(canv.width) / 2,
    py = ~~(canv.height) / 2,
    pw = ph	= 5,
    aw = ah	= 5,
    apples = [],
    trail = [],
    tail = 10,
    tailSafeZone = 20,
    cooldown = false,
    score = 0,
    questions = [["В каком году началась Гражданская война на территории бывшей Российской империи?", "1918", false],["В каком году произошло восстание декабристов в Петербурге?", "1825", false],["В каком году произошла Всероссийская Октябрьская стачка?", "1905", false], ["В каком году закончилась ВОВ?", "1945", false],["В каком году произошла Отечественная война? ", "1812", false], ["Кто был первым правителем Руси?", "Рюрик", false],["Кто был последним правителем из династии Романовых?", "Николай 2", false],["В каком году сделали первую резиновую уточку?", "Хз", false],["В каком году пала Западная Римская империя?", "476", false],["В каком году произошло «Бостонское чаепитие»?", "1773", false],["В каком году была принята Декларация независимости США?", "1776", false],["В каком году был подписан Брестский мир?", "1918", false], ["Сколько лет длилась столетняя война?", "116", false], ["В каком году началась война Алой и Белой розы в Англии?","1455",false],["Период правления Ивана Грозного","1535-1584",false],["Кто был первым русским императором?", "Петр 1",false],["Год основания Москвы","1147",false]];

//отвечаем на вопрос
function opr() {
    let dop = [];
    dop.length = 0;
    for (i = 0; i < questions.length; i++) {
        if (questions[i][2] !== true) {
            dop.push(i)
        }
    }
    let max = dop.length;
    if (max === 0) {
        document.location.href = "winner.html";
    }
    let index = Math.floor(Math.random() * (max));
    let quest = questions[dop[index]][0];
    let res = prompt(quest);
    let answer = questions[dop[index]][1];
    if (res === answer) {
        questions[dop[index]][2] = true;
        return true;
    } else {
        while (res !== answer) {
            res = prompt("Неправильный ответ. Скопируйте правильный ответ : " + answer);
            return false;
        }
    }
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

    // ограничение
    if( trail.length > tail ) {
        trail.shift();
    }

    // съедено
    if( trail.length > tail ) {
        trail.shift();
    }

    // перекусил себя
    if( trail.length >= tail && gs ) {
        for( var i = trail.length - tailSafeZone; i >= 0; i-- ) {
            if((px < (trail[i].x + pw)) && (px + pw > trail[i].x) && (py < (trail[i].y + ph)) && (py + ph > trail[i].y)) {
                document.location.href ="loser.html"
            }
        }
    }

    // яблочки
    for( var a = 0; a < apples.length; a++ ) {
        ctx.fillStyle = apples[a].color;
        ctx.fillRect(apples[a].x, apples[a].y, aw, ah);
    }

    // съедение яблока
    for( var a = 0; a < apples.length; a++ ) {
        if((px < (apples[a].x + pw)) && (px + pw > apples[a].x) && (py < (apples[a].y + ph)) && (py + ph > apples[a].y)) {
            apples.splice(a, 1);
            if (opr()) {
                tail += 10; // удлиняем
                speed += .1; // увеличиваем скорость
            }
            spawnApple(); // рисуем новое яблоко
            break;
        }
    }
}

// создаем яблоки
function spawnApple() {
    var
        newApple = {
            x: ~~(Math.random() * canv.width),
            y: ~~(Math.random() * canv.height),
            color: 'red'
        };

    // ограничение появления яблок
    if((newApple.x < 10*aw || newApple.x > canv.width - 10*aw) || (newApple.y < ah*10 || newApple.y > canv.height - ah*10)) {
        spawnApple();
        return;
    }

    // яблоки не рисуются в голове и хвосте
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
    if( !fkp && [13].indexOf(evt.keyCode) > -1 ) {
        xv = 0; yv = -speed;
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