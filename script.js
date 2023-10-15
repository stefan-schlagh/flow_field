
import { noise } from "./node_modules/@chriscourses/perlin-noise/index.js";

/*function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background(220);
  }*/
const nScale = 15

class Vector{
    constructor(x,y,sizeX,sizeY){
        this.origin = {
            x: x,
            y: y
        }
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.velocity = 0.03
    }

    move(){
        // angle in radiant
        let direction = this.noise() * Math.PI * 2 //- (Math.PI / 2)
        let a = Math.sin(direction) * this.velocity
        let b = Math.cos(direction) * this.velocity

        this.origin.x = (this.origin.x + b + this.sizeX) % this.sizeX
        this.origin.y = (this.origin.y + a + this.sizeY) % this.sizeY
    }

    noise(){
        return noise(this.origin.x / nScale,this.origin.y / nScale)
    }

}


const c = document.getElementById("canvas1");
c.width = window.innerWidth;
c.height = window.innerHeight;

const s = 40
const nx = parseInt(c.width / s)
const ny = parseInt(c.height / s)
const arcSize = s*0.65

const vectors = new Array(nx)

function initVectors(){
    for(let i = 0;i<nx;i+=1){
        vectors[i] = new Array(ny)
        for(let j = 0;j<ny;j+=1){
            vectors[i][j] = new Vector(i,j,nx,ny)
        }
    }
}

function draw(){

    var ctx = c.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height);

    for(let i = 0;i<nx;i+=1){
        for(let j = 0;j<ny;j+=1){
            let vector = vectors[i][j]
            ctx.beginPath();
            ctx.fillStyle = ctx.strokeStyle = `rgb(
                0,
                ${Math.floor(255 - (vector.noise() * 255))},
                ${Math.floor((vector.noise() * 100))})`;
            ctx.arc(vector.origin.x*s + s/2, vector.origin.y*s + s/2, /*vector.noise() * arcSize*/ 1, 0, 2 * Math.PI);
            ctx.fill()
            ctx.stroke();

            vector.move()

            /*ctx.beginPath();
            ctx.fillStyle = ctx.strokeStyle = `rgb(
                0,
                ${Math.floor(255 - noise(i,j) * 42.5 * i)},
                ${Math.floor(255 - noise(i,j) * 42.5 * j)})`;
            ctx.arc(i*s + s/2, j*s + s/2, noise(i,j) * size, 0, 2 * Math.PI);
            ctx.fill()
            ctx.stroke();*/
            
            // calc angle between 0 and 180 deg
            /*let alpha = noise(i / nScale,j / nScale) * Math.PI * 2 //- Math.PI / 2
            let a = Math.sin(alpha)*s/2
            let b = Math.cos(alpha)*s/2

            ctx.beginPath();
            ctx.strokeStyle = "red"

            ctx.moveTo(i*s + s/2 - b, j*s + s/2 - a)
            ctx.lineTo(i*s + s/2 + b, j*s + s/2 + a)*/


            //ctx.moveTo(i*s, j*s + s/2)
            //ctx.lineTo(i*s + s, j*s + s/2)
            ctx.stroke();

        }
    }
}
initVectors()

const interval = setInterval(function() {
    draw()
}, 20);
