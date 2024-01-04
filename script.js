
import { noise } from "./node_modules/@chriscourses/perlin-noise/index.js";

const c = document.getElementById("canvas1");
c.width = window.innerWidth;
c.height = window.innerHeight;

// noise scale
const nScale = 15
// canvas scale
const s = 20
const nx = parseInt(c.width / s)
const ny = parseInt(c.height / s) + 1
const arcSize = s*0.65



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

    move(stayinCanvas = false){
        // angle in radiant
        let direction = this.noise() * Math.PI * 2 //- (Math.PI / 2)
        let a = Math.sin(direction) * this.velocity
        let b = Math.cos(direction) * this.velocity

        /*
            two options:
                first options: always cut to max size, do not allow negative values
                second option: allows both negative values and bigger sizes than max
        */
        if(stayinCanvas){
            this.origin.x = (this.origin.x + b + this.sizeX) % this.sizeX
            this.origin.y = (this.origin.y + a + this.sizeY) % this.sizeY
        } else {
            this.origin.x = (this.origin.x + b )
            this.origin.y = (this.origin.y + a )
        }
        
    }

    noise(){
        return noise(this.origin.x / nScale,this.origin.y / nScale)
    }

    isinsideCanvas(){
        if(this.origin.x < 0) return false
        if(this.origin.y < 0) return false
        if(this.origin.x > this.sizeX) return false
        if(this.origin.y > this.sizeY) return false

        return true
        //print(this.origin)
    }
}



const vectors = new Array(nx * ny)

function initVectors(){
    for(let i = 0;i < nx;i += 1){
        for(let j = 0;j < ny;j += 1){
            vectors[i + j*nx] = new Vector(i,j,nx,ny)
        }
    }
}

function draw(){

    //console.log(vectors.length)

    var ctx = c.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height);

    /*for(let i = 0;i<nx;i+=1){
        for(let j = 0;j<ny;j+=1){*/
    
    //console.log(vectors)

    for(let i=0;i < vectors.length;i++){

        const vector = vectors[i]

        //console.log(vector)

        //let vector = vectors[i][j]
        ctx.beginPath();
        //ctx.fillStyle = ctx.strokeStyle = `rgb(0,0,0)`;
        ctx.fillStyle = ctx.strokeStyle = `rgba(
            0,
            ${Math.floor(255 - (vector.noise() * 255))},
            ${Math.floor((vector.noise() * 100))},
            0.2)`;
        //*/
        ctx.fillRect(vector.origin.x*s, vector.origin.y*s, 1,1);
        ctx.fill()
        ctx.stroke();

        vector.move()

        if(!vector.isinsideCanvas()){
            vectors.splice(vectors.indexOf(vector), 1);
            i--
        }

        //ctx.stroke();

    }
}
initVectors()

const interval = setInterval(function() {
    draw()
}, 20);


document.addEventListener('mousemove', (event) => {
    console.log(`Mouse position: (${event.clientX}, ${event.clientY})`);

    const v = new Vector(event.clientX / s, event.clientY / s, nx, ny)

    console.log(v)
    console.log(v.isinsideCanvas())

    vectors.push(v)
});

