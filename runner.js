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
var runnerAns = $("#Ans");
var runnerB = $("#B");
var runnerBns = $("#Bns");
var running = true;

function Runner(x,y, runner){
    var r = {x:x, y:y, runner:runner, signal:0};

    r.mx = new Neuron(); //my X
    r.my = new Neuron(); //my Y
    r.tx = new Neuron(); //their X
    r.ty = new Neuron(); //their Y
    r.ox = new Neuron(); //out X
    r.oy = new Neuron(); //out Y

    r.is = new Neuron(); //in Signal
    r.os = new Neuron(); //out Signal

    r.mx.project(r.ox);
    r.my.project(r.ox);
    r.tx.project(r.ox);
    r.ty.project(r.ox);
    r.is.project(r.ox);

    r.mx.project(r.oy);
    r.my.project(r.oy);
    r.tx.project(r.oy);
    r.ty.project(r.oy);
    r.is.project(r.oy);

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

var pos = [Math.random() * SIZE[0], Math.random() * SIZE[1]];
var As = Runner(pos[0], pos[1],runnerA);
As.render();
var Ans = Runner(pos[0], pos[1],runnerAns);
Ans.render();

pos = [Math.random() * SIZE[0], Math.random() * SIZE[1]];
var Bs = Runner(pos[0], pos[1],runnerB);
Bs.render();
var Bns = Runner(pos[0], pos[1],runnerBns);
Bns.render();

function learn(A,B, signal){
    B.mx.activate(B.x/SIZE[0]);
    B.my.activate(B.y/SIZE[1]);
    B.tx.activate(A.x/SIZE[0]);
    B.ty.activate(A.y/SIZE[0]);
    if(signal){
        B.is.activate(A.signal);
        B.signal = B.os.activate();
    }


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
    if(signal){
        A.is.activate(B.signal);
        A.signal =  A.os.activate();
    }

    x = Math.round((A.ox.activate() - 0.5) * 2);
    y = Math.round((A.oy.activate() - 0.5) * 2);
    A.x += x * speed;
    A.y += y * speed;

    A.render();

    A.ox.propagate(learningRate, B.x / SIZE[0]);
    A.oy.propagate(learningRate, B.y / SIZE[0]);
}

function randomize(){
    var x = Math.random() * SIZE[0];
    var y = Math.random() * SIZE[1];
    As.x = x;
    As.y = y;
    Ans.x = x;
    Ans.y = y;

    x = Math.random() * SIZE[0];
    y = Math.random() * SIZE[1];
    Bs.x = x;
    Bs.y = y;
    Bns.x = x;
    Bns.y = y;
}

var lpa = [];
var lpb = [];
setInterval(function (){
    if(running){
        lpa = [As.x, As.y];
        lpb = [Bs.x, Bs.y];
        lpans = [Ans.x, Ans.y];
        lpbns = [Bns.x, Bns.y];
        learn(As,Bs, true);
        learn(Ans,Bns, false);
        if(lpa[0] == As.x && lpa[1] == As.y && lpb[0] == Bs.x && lpb[1] == Bs.y && Ans.x == lpans[0] && Ans.y == lpans[1] && Bns.x == lpbns[0] && Bns.y == lpbns[1]){
            randomize();
        }
    }
}, 10);
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
