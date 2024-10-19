var SQUARE_SIZE = 50;
var NODE_SPACING = 200;
var MAX_NODES = 8;
var GameNode = (function () {
    function GameNode(name, x, y, vx, vy) {
        this.name = name;
        this.linkedNodes = [];
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }
    GameNode.prototype.addNode = function () {
        var childCount = this.linkedNodes.length + 1;
        var angleStep = TWO_PI / childCount;
        for (var i = 0; i < childCount; i++) {
            var angle = i * angleStep;
            var x = this.x + cos(angle) * NODE_SPACING;
            var y = this.y + sin(angle) * NODE_SPACING;
            if (i === childCount - 1) {
                var newNode = new GameNode("node" + Math.random(), x + Math.random(), y + Math.random(), 0, 0);
                this.linkedNodes.push(newNode);
            }
            else {
                this.linkedNodes[i].setPosition(x, y);
            }
        }
    };
    GameNode.prototype.draw = function () {
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
        this.vx *= 0.9;
        this.vy *= 0.9;
        for (var i = 0; i < this.linkedNodes.length; i++) {
            var linkedNode = this.linkedNodes[i];
            push();
            stroke(200);
            strokeWeight(5);
            line(this.x + offsetX, this.y + offsetY, linkedNode.x + offsetX, linkedNode.y + offsetY);
            pop();
            linkedNode.draw();
        }
    };
    GameNode.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    GameNode.prototype.clicked = function () {
        if (dist(mouseX, mouseY, this.x + offsetX, this.y + offsetY) <
            SQUARE_SIZE / 2) {
            if (this.linkedNodes.length < MAX_NODES) {
                this.addNode();
            }
        }
        for (var i = 0; i < this.linkedNodes.length; i++) {
            this.linkedNodes[i].clicked();
        }
    };
    GameNode.prototype.getAllChildren = function () {
        var childNodes = [];
        for (var i = 0; i < this.linkedNodes.length; i++) {
            childNodes.push(this.linkedNodes[i]);
            childNodes.push.apply(childNodes, this.linkedNodes[i].getAllChildren());
        }
        return childNodes;
    };
    return GameNode;
}());
function moveToPoint(x1, y1, x2, y2, speed) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var distance = sqrt(dx * dx + dy * dy);
    if (distance === 0) {
        return { vx: 0, vy: 0 };
    }
    var vx = (dx / distance) * speed;
    var vy = (dy / distance) * speed;
    return { vx: vx, vy: vy };
}
function checkWallCollision(node) {
    if (node.x <= 25 || node.x >= width - 25) {
        node.vx *= -wallBounceFactor;
        node.x = constrain(node.x, 25, width - 25);
    }
    if (node.y <= 25 || node.y >= height - 25) {
        node.vy *= -wallBounceFactor;
        node.y = constrain(node.y, 25, height - 25);
    }
}
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var rootNode;
var minDist = 150;
var repulsionStrength = 0.05;
var maxRepulsion = 10;
var wallBounceFactor = 0.9;
var offsetX = 0;
var offsetY = 0;
var dragging = false;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER).noFill().frameRate(30);
    rootNode = new GameNode("root", width / 2, height / 2, 0, 0);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(0);
    rootNode.draw();
    var nodes = __spreadArrays(rootNode.getAllChildren(), [rootNode]);
    for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
            applyRepulsion(nodes[i], nodes[j]);
        }
    }
}
function mousePressed() {
    if (isMouseWithinCanvas()) {
        dragging = true;
    }
    rootNode.clicked();
}
function applyRepulsion(nodeA, nodeB) {
    var dx = nodeA.x - nodeB.x;
    var dy = nodeA.y - nodeB.y;
    var distance = sqrt(dx * dx + dy * dy);
    if (distance < minDist && distance > 0) {
        var force = (repulsionStrength * (minDist - distance)) / distance;
        force = constrain(force, 0, maxRepulsion);
        var angle = atan2(dy, dx);
        nodeA.vx += cos(angle) * force;
        nodeA.vy += sin(angle) * force;
        nodeB.vx -= cos(angle) * force;
        nodeB.vy -= sin(angle) * force;
    }
}
function mouseReleased() {
    dragging = false;
}
function mouseDragged() {
    if (dragging) {
        offsetX = constrain(offsetX - (pmouseX - mouseX), -windowWidth / 2, windowWidth / 2);
        offsetY = constrain(offsetY - (pmouseY - mouseY), -windowHeight / 2, windowHeight / 2);
    }
}
function isMouseWithinCanvas() {
    return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}
//# sourceMappingURL=build.js.map