class Person {
    /**
     * Place a person randomly on the grid
     * 
     * @param {int} width Width of the grid
     * @param {int} height Height of the grid
     * @param {boolean} moving Whether the person is moving or stationary
     * @param {boolean} infected Whether this person starts off infected
     */
    constructor(width, height, moving, infected) {
        this.x = Math.random()*width;
        this.y = Math.random()*height;
        this.moving = moving;
        this.sickFor = 0;
        if (infected) {
            this.state = Person.STATE_INFECTED;
        }
        else {
            this.state = Person.STATE_UNINFECTED;
        }
    }

    /**
     * If the person is moving, perform a random walk, 
     * going either left/right/up/down by one unit
     */
    walk() {
        if (this.moving) {
            let r = Math.random();
            if (r < 0.25) {
                // Move left
                this.x -= 1;
            }
            else if (r < 0.5) {
                // Move right
                this.x += 1;
            }
            else if (r < 0.75) {
                // Move down
                this.y -= 1;
            }
            else {
                // Move up
                this.y += 1;
            }
        }
    }

    /**
     * If this person is uninfected, make them infected
     * Otherwise, if they are already infected or they
     * are recovered, this has no effect
     */
    makeSick() {
        if (this.state == Person.STATE_UNINFECTED) {
            this.state = Person.STATE_INFECTED;
        }
    }

    /**
     * Interact with another person if this person
     * is close enough.
     * @param {Person} other Another person in the simulation
     * @param {float} nearDist The distance that two people have to be
     *                         from each other for the illness to be transmitted
     */
    interactWith(other, nearDist) {
        if (this.state == Person.STATE_INFECTED) {
            // TODO: Fill this in.  If this person is within nearDist
            // of the other person, then infect the other person
        }
    }

    /**
     * Let time go by, and recover a sick patient
     * if they've been sick for at least a certain amount of time
     * @param {int} recoveryTime Number of timesteps to recover from being sick
     */
    elapseTime(recoveryTime) {
        // TODO: Fill this in.  If a patient is sick, add one to the
        // variable "sickFor."  If they've been sick for "recoveryTime"
        // amount of time, then change their state to recovered
    }


}
Person.STATE_UNINFECTED = 0;
Person.STATE_INFECTED = 1;
Person.STATE_RECOVERED = 2;


class Simulation {
    constructor() {
        this.setupCanvas();
        this.setupMenu();
        this.people = [];
        // Keep track of the numbers at each timestep
        this.uninfectedCount = [];
        this.infectedCount = [];
        this.recoveredCount = [];
    }

    /**
     * Setup the 2D HTML5 canvas context
     */
    setupCanvas() {
        this.canvas = document.getElementById('covidcanvas');
        this.ctx = this.canvas.getContext("2d");
    }

    /**
     * Setup menu for choosing parameters and 
     * launching the simulation
     */
    setupMenu() {
        let menu = new dat.GUI();
        this.menu = menu;
        this.numPeople = 1000;
        this.fracMoving = 1;
        this.nearDist = 17;
        this.recoveryTime = 200;
        this.numSteps = 1000;
        this.step = 0;
        menu.add(this, "fracMoving", 0, 1, 0.01);
        menu.add(this, "nearDist");
        menu.add(this, "numPeople");
        menu.add(this, "recoveryTime");
        menu.add(this, "numSteps");
        menu.add(this, "step").listen();
        menu.add(this, "doSimulation");
    }

    /**
     * Run the simulation
     */
    doSimulation() {
        // Step 1: Initialize all of the people
        this.people = [];
        for (let i = 0; i < this.numPeople; i++) {
            let moving = true;
            if (i/this.numPeople > this.fracMoving) {
                moving = false;
            }
            let infected = true; // Patient zero
            if (i > 0) {
                infected = false;
            }
            this.people.push(new Person(this.canvas.width, this.canvas.height, moving, infected));
        }

        // Step 2: The main simulation/animation loop
        this.step = 0;
        this.takeStep();
    }

    /**
     * Run a step of the simulation
     */
    takeStep() {
        for (let i = 0; i < this.numPeople; i++) {
            this.people[i].walk();
            this.people[i].elapseTime(this.recoveryTime);
            for (let j = 0; j < this.numPeople; j++) {
                if (j != i) {
                    this.people[i].interactWith(this.people[j], this.nearDist);
                }
            }
        }
        // Count the number of people in each state for plotting later
        let numUninfected = 0;
        let numInfected = 0;
        let numRecovered = 0;
        for (let i = 0; i < this.numPeople; i++) {
            if (this.people[i].state == Person.STATE_UNINFECTED) {
                numUninfected += 1;
            }
            else if (this.people[i].state == Person.STATE_INFECTED) {
                numInfected += 1;
            }
            else {
                numRecovered += 1;
            }
        }
        this.uninfectedCount.push(numUninfected);
        this.infectedCount.push(numInfected);
        this.recoveredCount.push(numRecovered);
        this.step += 1;
        requestAnimationFrame(this.repaint.bind(this));
    }

    /**
     * Draw the locations of all of the people, and color
     * them according to their state
     */
    repaint() {
        const dW = 5;
		const W = this.canvas.width;
		const H = this.canvas.height;
        this.ctx.clearRect(0, 0, W, H); // Puts white over everything to clear it
        
        // Draw each person
        for (let i = 0; i < this.people.length; i++) {
            let person = this.people[i];
            if (person.state == Person.STATE_INFECTED) {
                this.ctx.fillStyle = "red";
            }
            else if (person.state == Person.STATE_UNINFECTED) {
                this.ctx.fillStyle = "blue";
            }
            else {
                this.ctx.fillStyle = "green";
            }
            this.ctx.fillRect(person.x, person.y, dW, dW);
        }
        if (this.step < this.numSteps) {
            this.takeStep();
        }
        else {
            this.plotResults();
        }
    }

    plotResults() {
        let allPlots = [];
        let xs = [];
        for (let i = 0; i < this.uninfectedCount.length; i++) {
            xs.push(i);
        }
        allPlots.push({x:xs, y:this.uninfectedCount, mode:'lines', name:'Uninfected'});
        allPlots.push({x:xs, y:this.infectedCount, mode:'lines', name:'Infected'});
        allPlots.push({x:xs, y:this.recoveredCount, mode:'lines', name:'Recovered'});
        let layout = {title:'Infected Curves',
                        autosize: false,
                        width: 600,
                        height: 600};
        Plotly.newPlot("resultsPlot", allPlots, layout);
    }
}