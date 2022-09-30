
/**
 * Convert a vec2 to a complex string
 * @param {float} real Real component
 * @param {float} imag Imaginary component
 * @param {int} k Decimal precision
 */
 function complexToStr(real, imag, k) {
    if (k === undefined) {
        k = 2;
    }
    s = "";
    const v = [real, imag];
    for (let i = 0; i < 2; i++) {
        s += v[i].toFixed(k);
        if (i < v.length-1) {
            s += " + ";
        }
        else if (i == 1) {
            s += "i";
        }
    }
    return s;
}

class JuliaSet {
    /**
     * Construct the object and store canvas information
     * @param {string} divName DOM name of div wrapping canvas
     * @param {string} canvasName DOM name of canvas
     */
    constructor(divName, canvasName) {
        const div = document.getElementById(divName);
        this.canvas = document.getElementById(canvasName);
        this.canvas.width = div.clientWidth;
        this.canvas.height = div.clientHeight;
        this.ctx = this.canvas.getContext("2d"); //For drawing
        //Need this to disable that annoying menu that pops up on right click
        this.canvas.addEventListener("contextmenu", function(e){ e.stopPropagation(); e.preventDefault(); return false; }); 
        
        // Initialize variables
        this.CRe = -1;
        this.CIm = 0;
        this.MaxIters = 30;
        this.uEscape = 4;
        
        // Setup menu
        this.setupMenu();
    }

    setupMenu() {
        const that = this;
        this.C = complexToStr(this.CRe, this.CIm);
        let menu = new dat.GUI();
        this.menu = menu;
        menu.add(this, 'C').listen().onChange(
            function(s) {
                const v = s.split("+");
                that.CRe = parseFloat(v[0]);
                console.log(v[1].substr(v[1].length-1));
                that.CIm = parseFloat(v[1].substr(0, v[1].length-1));
            }
        )
        menu.add(this, 'MaxIters', 1, 100);
        menu.add(this, 'uEscape', 0);
        menu.add(this, 'repaint');
    }


    /**
     * Draw a pixel at a particular position of the canvas 
     * @param {int} x X coordinate of pixel
     * @param {int} y Y coordinate of pixel
     * @param {float} r Red value in [0, 255]
     * @param {float} g Green value in [0, 255]
     * @param {float} b Blue value in [0, 255]
     */
    drawPixel(x, y, r, g, b) {
        this.ctx.fillStyle = "rgb("+r+","+g+","+b+")";
        this.ctx.fillRect(x, y, 1, 1);
    }

    /**
     * Method to paint the Julia set
     */
    repaint() {
        let tic = (new Date()).getTime();

        const W = this.canvas.width;
        const H = this.canvas.height;
        this.ctx.clearRect(0, 0, W, H);
        for (let x = 0; x < W; x++) {
            for (let y = 0; y < H; y++) {
                let xGL = x/W; //Scale x down to [0,1]
                let yGL = y/H; //Scale y down to [0,1]
                //Draw square in middle of screen
                if(xGL>0.25 && xGL<0.75 && yGL>0.25 && yGL<0.75){
                    if(xGL>0.40 && xGL<0.60 && yGL>0.40 && yGL<0.60){
                        this.drawPixel(x,y, 255, 255, 0);
                    }
                    else{
                        this.drawPixel(x,y,100, 100, 150);
                    }
                }
                else{
                    this.drawPixel(x, y, 0, 0, 0);
                }

                // TODO: Replace this with code that does a Julia set iteration
                // this.MaxIters, this.uEscape, this.CRe, this.CIm
            }
        }
        let toc = (new Date()).getTime();
        const ptime = document.getElementById("time");
        ptime.innerHTML = (toc-tic) + " milliseconds elapsed (" + (Math.round(10000/(toc-tic))/10) + "fps)";
    }
}