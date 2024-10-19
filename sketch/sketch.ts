// GLOBAL VARS & TYPES
let rootNode: GameNode;

let minDist = 150; // Minimum distance between nodes
let repulsionStrength = 0.05; // Strength of repulsion force
let maxRepulsion = 10; // Maximum repulsion force to avoid too much movement
let wallBounceFactor = 0.9; // How much velocity is retained after bouncing (1 = perfect bounce, < 1 = some energy lost)

// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER).noFill().frameRate(30);

  rootNode = new GameNode("root", width / 2, height / 2, 0, 0);
}

// p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  // CLEAR BACKGROUND
  background(0);

  // DRAW ROOT NODE
  rootNode.draw();

  // APPLY REPULSION FORCES
  const nodes = [...rootNode.getAllChildren(), rootNode];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      applyRepulsion(nodes[i], nodes[j]);
    }
  }
}

function mousePressed() {
  rootNode.clicked();
}

// Function to apply repulsion force between two nodes
function applyRepulsion(nodeA: any, nodeB: any) {
  let dx = nodeA.x - nodeB.x;
  let dy = nodeA.y - nodeB.y;
  let distance = sqrt(dx * dx + dy * dy);

  if (distance < minDist && distance > 0) {
    // Calculate the repulsion force (inverse of distance, squared)
    let force = (repulsionStrength * (minDist - distance)) / distance;
    force = constrain(force, 0, maxRepulsion);

    // Calculate the direction of the force
    let angle = atan2(dy, dx);

    // Apply the force to nodeA
    nodeA.vx += cos(angle) * force;
    nodeA.vy += sin(angle) * force;

    // Optionally, also apply equal and opposite force to nodeB (Newton's 3rd law)
    nodeB.vx -= cos(angle) * force;
    nodeB.vy -= sin(angle) * force;
  }
}
