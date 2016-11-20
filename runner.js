/**
 * Created by Lars on 20.11.2016.
 */

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var learningRate = .3;
var runs = 0;
var learns = 0;
var SIZE = [600,600];
var speed = 3;

var out = $("#output");
var runnerA = $("#A");
var runnerB = $("#B");
var running = true;

function Runner(x,y, runner){
    var r = {x:x, y:y, runner:runner};

    r.mx = new Neuron();
    r.my = new Neuron();
    r.tx = new Neuron();
    r.ty = new Neuron();
    r.ox = new Neuron();
    r.oy = new Neuron();

    r.mx.project(r.ox);
    r.my.project(r.ox);
    r.tx.project(r.ox);
    r.ty.project(r.ox);

    r.mx.project(r.oy);
    r.my.project(r.oy);
    r.tx.project(r.oy);
    r.ty.project(r.oy);

    r.render = function(){
        r.x = Math.min(SIZE[0], Math.max(0, r.x));
        r.y = Math.min(SIZE[1], Math.max(0, r.y));
        r.runner.css({transform: "translate(" + r.x + "px," + r.y + "px)"});
    };

    return r;
}

var A = Runner(Math.random() * SIZE[0],Math.random() * SIZE[1],runnerA);
A.render();
var B = Runner(Math.random() * SIZE[0],Math.random() * SIZE[1],runnerB);
B.render();

function learn(){
    B.mx.activate(B.x/SIZE[0]);
    B.my.activate(B.y/SIZE[1]);
    B.tx.activate(A.x/SIZE[0]);
    B.ty.activate(A.y/SIZE[0]);

    var x = Math.round((B.ox.activate() - 0.5) * 2);
    var y = Math.round((B.oy.activate() - 0.5) * 2);
    B.x += x * speed;
    B.y += y * speed;

    B.render();

    B.ox.propagate(learningRate, A.x / SIZE[0]);
    B.oy.propagate(learningRate, A.y / SIZE[0]);

    A.mx.activate(A.x/SIZE[0]);
    A.my.activate(A.y/SIZE[1]);
    A.tx.activate(B.x/SIZE[0]);
    A.ty.activate(B.y/SIZE[0]);

    x = Math.round((A.ox.activate() - 0.5) * 2);
    y = Math.round((A.oy.activate() - 0.5) * 2);
    A.x += x * speed;
    A.y += y * speed;

    A.render();

    A.ox.propagate(learningRate, B.x / SIZE[0]);
    A.oy.propagate(learningRate, B.y / SIZE[0]);
}

function runChunk(x){
    for(var i = 0; i < x; i++){
        run();
    }
}

function learnChunk(x){
    for(var i = 0; i < x; i++){
        learn();
    }
}

function randomize(){
    A.x = Math.random() * SIZE[0];
    A.y = Math.random() * SIZE[1];
    B.x = Math.random() * SIZE[0];
    B.y = Math.random() * SIZE[1];
}

var lpa = [];
var lpb = [];
setInterval(function (){
    if(running){
        lpa = [A.x, A.y];
        lpb = [B.x, B.y];
        learn();
        if(lpa[0] == A.x && lpa[1] == A.y && lpb[0] == B.x && lpb[1] == B.y){
            randomize();
        }
    }
}, 50);
/*
function learn(){
    return new Promise(function(resolve){
        for(var i = 0; i < 10; i++)
        {
            var x = i / 10;
            // when A activates 1
            A.activate(x);

            // train B to activate 0
            B.activate();
            B.propagate(learningRate, x +0.1);
        }
        resolve();
    });

}

function test(x){
    x = x/10;
    A.activate(x);
    out.innerHTML += x * 10 + " : " + Math.round(B.activate() * 10) + "<br/>";
}

function run(){
    runs++;
    out.innerHTML = "Runs: " + runs + "<br/>";
    for(var i = 0; i < 10; i++){
        test(i);
    }
}

function loop(){
    learn().then(function(){
        run();
        if(running){
            setTimeout(loop,100);
        }
    });
}

loop();
*/
