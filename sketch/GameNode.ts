const SQUARE_SIZE = 50;
const NODE_SPACING = 200;

const MAX_NODES = 8;

class GameNode {
  linkedNodes: GameNode[] = [];

  x: number = 0;
  y: number = 0;

  vx: number = 0;
  vy: number = 0;

  constructor(
    public name: string,
    x: number,
    y: number,
    vx: number,
    vy: number
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  addNode() {
    const childCount = this.linkedNodes.length + 1;

    let angleStep = TWO_PI / childCount;
    for (let i = 0; i < childCount; i++) {
      let angle = i * angleStep; // Current angle for this child
      let x = this.x + cos(angle) * NODE_SPACING; // X coordinate
      let y = this.y + sin(angle) * NODE_SPACING; // Y coordinate

      if (i === childCount - 1) {
        const newNode = new GameNode(
          "node" + Math.random(),
          x + Math.random(),
          y + Math.random(),
          0,
          0
        );
        this.linkedNodes.push(newNode);
      } else {
        this.linkedNodes[i].setPosition(x, y);
        // const vel = moveToPoint(
        //   this.linkedNodes[i].x,
        //   this.linkedNodes[i].y,
        //   x + offsetX,
        //   y + offsetY,
        //   5
        // );
        // this.linkedNodes[i].vx = vel.vx;
        // this.linkedNodes[i].vy = vel.vy;
      }
    }
  }

  draw() {
    fill(200);
    stroke(200);

    if (this.linkedNodes.length === MAX_NODES) {
      fill(255, 0, 0);
      stroke(255, 0, 0);
    }

    this.x += this.vx;
    this.y += this.vy;

    checkWallCollision(this);

    square(this.x + offsetX, this.y + offsetY, SQUARE_SIZE);
    // push();
    // fill("cornflowerblue");
    // textSize(20);
    // text(`${this.x.toFixed(2)}, ${this.y.toFixed(2)}`, this.x, this.y);
    // pop();

    this.vx *= 0.9;
    this.vy *= 0.9;

    // loop through linkedNodes and draw
    for (let i = 0; i < this.linkedNodes.length; i++) {
      const linkedNode = this.linkedNodes[i];
      push();
      stroke(200);

      strokeWeight(5);

      line(
        this.x + offsetX,
        this.y + offsetY,
        linkedNode.x + offsetX,
        linkedNode.y + offsetY
      );
      pop();
      linkedNode.draw();
    }
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clicked() {
    if (
      dist(mouseX, mouseY, this.x + offsetX, this.y + offsetY) <
      SQUARE_SIZE / 2
    ) {
      if (this.linkedNodes.length < MAX_NODES) {
        this.addNode();
      }
    }

    // check if child nodes were clicked
    for (let i = 0; i < this.linkedNodes.length; i++) {
      this.linkedNodes[i].clicked();
    }
  }

  getAllChildren(): GameNode[] {
    const childNodes = [];
    for (let i = 0; i < this.linkedNodes.length; i++) {
      childNodes.push(this.linkedNodes[i]);
      childNodes.push(...this.linkedNodes[i].getAllChildren());
    }
    return childNodes;
  }
}

function moveToPoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  speed: number
) {
  // Calculate the difference in positions
  let dx = x2 - x1;
  let dy = y2 - y1;

  // Calculate the distance between the points
  let distance = sqrt(dx * dx + dy * dy);

  // Avoid division by zero (when the points are already very close)
  if (distance === 0) {
    return { vx: 0, vy: 0 }; // No movement needed
  }

  // Normalize the direction vector and scale by speed
  let vx = (dx / distance) * speed;
  let vy = (dy / distance) * speed;

  return { vx: vx, vy: vy };
}

// Function to check for wall collisions and make nodes bounce
function checkWallCollision(node: GameNode) {
  // Bounce off the left or right walls
  if (node.x <= 25 || node.x >= width - 25) {
    node.vx *= -wallBounceFactor; // Reverse horizontal velocity
    node.x = constrain(node.x, 25, width - 25); // Keep within bounds
  }

  // Bounce off the top or bottom walls
  if (node.y <= 25 || node.y >= height - 25) {
    node.vy *= -wallBounceFactor; // Reverse vertical velocity
    node.y = constrain(node.y, 25, height - 25); // Keep within bounds
  }
}
