/**
 * Created by Lars on 20.11.2016.
 */

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var learningRate = .8;
var runs = 0;
var learns = 0;
var SIZE = [600,600];
var speed = 3;

var out = $("#output");
var runnerA = $("#A");
var runnerB = $("#B");
var running = true;

function Runner(x,y, runner){
    var r = {x:x, y:y, lastX:x, lastY:y, runner:runner, signal:0};

    r.mx = new Neuron(); //my X
    r.my = new Neuron(); //my Y
    r.tx = new Neuron(); //their X
    r.ty = new Neuron(); //their Y
    r.oldX = new Neuron();
    r.oldY = new Neuron();
    r.ox = new Neuron(); //out X
    r.oy = new Neuron(); //out Y

    r.is = new Neuron(); //in Signal
    r.os = new Neuron(); //out Signal

    r.mx.project(r.ox);
    r.my.project(r.ox);
    r.tx.project(r.ox);
    r.ty.project(r.ox);
    r.is.project(r.ox);
    r.oldX.project(r.ox);
    r.oldY.project(r.ox);

    r.mx.project(r.oy);
    r.my.project(r.oy);
    r.tx.project(r.oy);
    r.ty.project(r.oy);
    r.is.project(r.oy);
    r.oldX.project(r.oy);
    r.oldY.project(r.oy);

    r.tx.project(r.os);
    r.ty.project(r.os);

    r.render = function(){
        r.x = Math.min(SIZE[0], Math.max(0, r.x));
        r.y = Math.min(SIZE[1], Math.max(0, r.y));
        r.runner.css({
            transform: "translate(" + r.x + "px," + r.y + "px)",
            borderRadius: 50 * r.signal + "%"
        });
    };

    return r;
}

function LayerRunner(x,y, runner){
    var r = {x:x, y:y, lastX:x, lastY:y, runner:runner, signal:0};

    r.inputLayer = new Layer(5);
    r.outputLayer = new Layer(2);
    r.signalLayer = new Layer(1);

    r.inputLayer.project(r.outputLayer);
    r.inputLayer.project(r.signalLayer);

    r.render = function(){
        r.x = Math.min(SIZE[0], Math.max(0, r.x));
        r.y = Math.min(SIZE[1], Math.max(0, r.y));
        r.runner.css({
            transform: "translate(" + r.x + "px," + r.y + "px)",
            borderRadius: 50 * r.signal + "%"
        });
    };

    return r;
}

var pos = [Math.random() * SIZE[0], Math.random() * SIZE[1]];
var As = LayerRunner(pos[0], pos[1],runnerA);
As.render();


pos = [Math.random() * SIZE[0], Math.random() * SIZE[1]];
var Bs = LayerRunner(pos[0], pos[1],runnerB);
Bs.render();

function LayerLearn(A,B){
    var input = B.inputLayer.activate([B.x/SIZE[0], B.y/SIZE[1], A.x/SIZE[0], A.y/SIZE[0], A.signal]);
    var output = B.outputLayer.activate();
    B.signal = B.signalLayer.activate()[0];

    var x = Math.round((output[0] - 0.5) * 2);
    var y = Math.round((output[1] - 0.5) * 2);

    B.x += x * speed;
    B.y += y * speed;
    B.render();

    B.outputLayer.propagate(learningRate, [ A.x / SIZE[0], A.y / SIZE[0]]);

    A.inputLayer.activate([A.x/SIZE[0], A.y/SIZE[1], B.x/SIZE[0], B.y/SIZE[0], B.signal]);
    output = A.outputLayer.activate();
    A.signal = A.signalLayer.activate()[0];

    var x = Math.round((output[0] - 0.5) * 2);
    var y = Math.round((output[1] - 0.5) * 2);

    A.x += x * speed;
    A.y += y * speed;
    A.render();

    A.outputLayer.propagate(learningRate, [B.x / SIZE[0], B.y / SIZE[0]]);
}

function randomize(){
    var x = Math.random() * SIZE[0];
    var y = Math.random() * SIZE[1];
    As.x = x;
    As.y = y;

    x = Math.random() * SIZE[0];
    y = Math.random() * SIZE[1];
    Bs.x = x;
    Bs.y = y;
}


var lpa = [];
var lpb = [];

setInterval(function (){
    if(running){
        lpa = [As.x, As.y];
        lpb = [Bs.x, Bs.y];

        LayerLearn(As,Bs, true);

        if(lpa[0] == As.x && lpa[1] == As.y && lpb[0] == Bs.x && lpb[1] == Bs.y){
            randomize();
        }
    }
}, 10);