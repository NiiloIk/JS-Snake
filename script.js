const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const button = document.getElementById("myBtn");
const input = document.getElementById("myInput");
const teksti = document.getElementById("teksti");
const more = document.getElementById("more");
const less = document.getElementById("less");
const size = document.getElementById("size");

canvas.height = canvas.width = 600;

// density = X & Y akselin palikat.
// eli density = 10^2 käytännössä
// Eri globaalit variaapelit
let density = 8;
let player = [];
let playerHeadPos;
let foodpos;
let direction;
let check;
let kytkin = true;
let X = -1;
setFoodPos();
// aloittaa pelin, toimii myös restarttina.
function start()
{
    size.innerHTML = "Size: " + density + "x" + density;
    player = []
    check = false;
    kytkin = true;
    playerHeadPos = Math.round(Math.random() * Math.pow(density, 2));
    while (playerHeadPos < 1)
    {
        playerHeadPos = Math.round(Math.random() * Math.pow(density, 2));
    }
    player.push(playerHeadPos);
    X = (playerHeadPos - 1) % density;
    setFoodPos();
}
start();

// Piirtää kaikki Canvasin sisällä
function draw()
{  
    let myNum = 0;
    context.clearRect(0, 0, canvas.height, canvas.width);
    for(let i = 0; i < density; i++)
    {
        let v = 1
        let h = canvas.height / density;
        let y = h * i + v/2;
        for(let j = 0; j < density; j++)
        {
            myNum++;
            let x = h * j + v/2;
            context.fillStyle = "black"
            if (player.includes(myNum))
            {
                if (kytkin || check)
                {
                    context.fillStyle = "red";
                }
                else{
                    context.fillStyle = "grey"
                }
            }
            context.fillRect(x, y, h - v, h - v);
            if (foodpos == myNum)
            {
                context.fillStyle = "yellow";
                context.fillRect(x + h/4, y + h/4, (h - v)/ 2, (h - v)/ 2)
            }
        }
    }
    myNum = 0;
}
draw();

function run()
{
    // Peli käynnissä 
    move(direction);
    if (check)
    {
        kytkin = false;
        draw();
        setTimeout(run, 300);
    }
    else {
        move(-direction)
    }
}
// Asettaa ruoan paikan.
function setFoodPos()
{
    foodpos = Math.round(Math.random() * Math.pow(density, 2));
    while(player.includes(foodpos) || foodpos < 1)
    {
        foodpos = Math.round(Math.random() * Math.pow(density, 2));
    }
}
// Liikkeet ja syömisen tunnistaminen samassa

function move(int)
{
    playerHeadPos += int;   
    checkPlayerCollision();
    if (check)
    {
        player.push(playerHeadPos);
    }
    if(player.length == (density*density) && check == true)
    {
        // mitä tapahtuu kun voittaa.
        foodpos = -1;
        check = false;
        draw();
    }
    else if (playerHeadPos == foodpos)
    {
        // mitä tapahtuu jos pelaaja syö ruoan.
        setFoodPos();
    }
    else if (check == false)
    {
        draw();
    }
    else
    {
        // kaikki muut tilanteet; eli käytännössä
        // mitä tapahtuu kun pelaaja liikkuu.
        let del = player.indexOf(player[0])
        player.splice(del, 1)
    }
    X = (playerHeadPos - 1) % density;
    direction = int;
}

function checkPlayerCollision()
{
    // Tarkistaa syökö pelaaja itsensä.
    if (player.includes(playerHeadPos))
    {
        check = false;
    }
    // Tarkistaa osuuko pelaaja seinään X akselilla.
    let F = (playerHeadPos - 1) % density
    if (X + F == density - 1 && (X == 0 || F == 0))
    {
        check = false;
    }// Tarkistaa osuuko pelaaja seinään Y akselilla.
    else if (playerHeadPos < 1 || playerHeadPos > Math.pow(density, 2))
    {
        check = false;
    }
}
window.addEventListener('keydown', () =>{
    // Liikkeet
    switch (event.key) {
        case 'd':
        {
            direction = 1;
            if (kytkin == true)
            {
                check = true;
                run();
            }
            break;
        }
        case 'a':
        {
            direction = -1
            if (kytkin == true)
            {
                check = true;
                run();
            }
            break;
        } 
        case 's':
        {
            direction = density;
            if (kytkin == true)
            {
                check = true;
                run();
            }
            break;
        } 
        case 'w':
        {
            direction = -density;
            if (kytkin == true)
            {
                check = true;
                run();
            }
            break;
        } 
        case 'r':
        {
            // aloittaa pelin alusta
            start();
            draw();
            break;
        }    
    }
});



// Muuttaa kentän koon.
button.addEventListener('click', function(){
    density = parseInt(input.value);
    input.value = "";
    start();
    draw();
})

// Kentän koko +1 nappula.
more.addEventListener('click', function(){
    density += 1
    input.value = "";
    start();
    draw();
})

// Kentän koko -1 nappula.
less.addEventListener('click', function(){
    density -= 1
    input.value = "";
    start();
    draw();
})

/*function changeSize(int)
{
    density = parseInt(int);
    input.value = "";
    start();
    draw();
}*/