const $canvas = document.querySelector('#canvas'),
    $reloadBtn = document.querySelector('.reloadBtn'),
    ctx = $canvas.getContext('2d');

let keypress = false;
let gameOn = true;
let raf;

//Reset game
$reloadBtn.addEventListener('click', ()=>{
    window.location.reload();
});

//Snake
const spaceShip = {
    width: 50,
    height: 30,
    x: $canvas.width / 2 - 25,
    y: 500,
    vx: 3,
    canMove: true,
    firing: false,
    bullet:{
        y: 500,
        x: 0,
        draw(){
            ctx.fillStyle = 'rgb(1, 150, 1)';
            ctx.fillRect(
                this.x, 
                this.y, 
                10, 
                25
            );
        }
    },
    draw(){
        //ship
        ctx.fillStyle = 'rgb(0, 102, 0)';
        ctx.fillRect(
            this.x, 
            this.y, 
            this.width, 
            this.height
        );
        //Cannon
        ctx.fillStyle = 'rgb(1, 150, 1)';
        ctx.fillRect(
            this.x + 17.5, 
            this.y - 10, 
            15, 
            25
        );
    }
};

//Enemies
const enemies = {
    width: 30,
    height: 30,
    vx: 0.3,
    vy: 0.4,
    troops: Array.from({length: 3}, (_, rowIndex) => {
        return Array.from({length: $canvas.width / 45}, (_, colIndex) => {
            return {
                x: 42 * colIndex,
                y: 42 * rowIndex,
                on: true,
                color: '#fff'
            };
        });
    }),
    moveAndDraw(){
        enemies.troops.forEach(row =>{
            row.forEach(col =>{
                //Add velocity
                col.x += this.vx
                //Collision with canvas
                if(
                    (col.x + 30 > $canvas.width ||
                    col.x < 0) && col.on 
                ){
                    this.downTroops();
                    this.vx = -this.vx
                };

                //troops death
                if(
                    spaceShip.bullet.y > col.y &&
                    spaceShip.bullet.y < col.y + 30  &&
                    spaceShip.bullet.x > col.x &&
                    spaceShip.bullet.x < col.x + 30 &&
                    col.on
                ){
                    col.on = false;
                    col.color = 'rgb(15, 15, 15)';
                    
                    spaceShip.firing = false;
                };

                //Draw
                ctx.fillStyle = col.color;
                ctx.fillRect(col.x, col.y, this.width, this.height)
            });
        });
    },
    downTroops(){
        enemies.troops.forEach(row =>{
            row.forEach(col =>{
                col.y += 15
            });
        });
    }
};

function gameLoop(){
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    //Enemies
    enemies.moveAndDraw()
    //check for active troops
    if(
        enemies.troops.every(row =>{
            return row.every(col =>{
                return !col.on
            });
        })
    ) gameOver('W i n !');
    //check if the enemy has reached the ship or reach the limit
    if(
        enemies.troops.some(row =>{
            return row.some(col =>{
                return ((col.y + enemies.height) > spaceShip.y &&
                col.x > spaceShip.x &&
                col.x < spaceShip.x + spaceShip.width &&
                col.on) ||
                col.y + enemies.height > $canvas.height
            });
        })
    )gameOver('Y o u  L o s e !');

    //Fire bullet
    if(spaceShip.firing){
        spaceShip.bullet.y -= 5
        spaceShip.bullet.draw()
    }

    if(spaceShip.bullet.y < 0 || !spaceShip.firing){
        spaceShip.bullet.y = 500;
        spaceShip.firing = false;
    }

    //Moviment limit
    if(spaceShip.x + spaceShip.width < $canvas.width &&
        spaceShip.x > 0
    ) spaceShip.canMove = true;
    else spaceShip.canMove = false;

    if(keypress && spaceShip.canMove){
        spaceShip.x += spaceShip.vx;
    }

    if(!spaceShip.canMove){
        spaceShip.x += -spaceShip.vx;
    }
    spaceShip.draw();

    if(gameOn){
        raf = window.requestAnimationFrame(gameLoop);
    }
};

function gameOver(text){
    ctx.fillStyle = '#fff';
    ctx.font = '45px sans serif'
    ctx.fillText(text, ($canvas.width / 2) - 100, 60); 

    gameOn = false;
    $reloadBtn.classList.add('active');
}

//Controls
document.addEventListener('keydown', (e)=>{
    //Move spaceShip
    let directions = {
        ArrowRight: 3,
        ArrowLeft: -3
    };

    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        keypress = true;
        spaceShip.vx = directions[e.key]
    }

    //Pressing the space bar fires the bullet.
    if(e.which === 32 && !spaceShip.firing){
        spaceShip.bullet.x = spaceShip.x + 20;
        spaceShip.firing = true;    
    }
});

document.addEventListener('keyup', (e)=>{
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        keypress = false;
    }
});

document.addEventListener('DOMContentLoaded', ()=>{
    raf = window.requestAnimationFrame(gameLoop);
});
