/**
 * Created by Lars on 19.11.2016.
 */


var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var out = document.getElementById("output");
var running = true;

var A = new Neuron();
var B = new Neuron();
A.project(B);

var learningRate = .3;
var runs = 0;

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
            setTimeout(loop,10);
        }
    });
}

loop();
