// TaskUtils by SlickNicky10
// Version: 1.1.1
// Github: https://github.com/SlickNicky10/TaskUtils

const SequenceBuilder = function(){
    var sequence = {};
    sequence.exec = [];
    sequence.isAsync = false;
    sequence.cancelled = false;
    sequence.setAsync = function(runAsync){
        sequence.exec.push({type: "SET_ASYNC", value: runAsync});
        return sequence;
    }
    sequence.setCancelled = function(cancel){
        sequence.cancelled = cancel;
        return sequence;
    }
    sequence.addVoid = function(runnable){
        sequence.exec.push({type: "VOID", void: runnable, getSequence: function(){return sequence;}});
        return sequence;
    }
    sequence.addDelay = function(delay){
        sequence.exec.push({type: "DELAY", value: delay});
        return sequence;
    }
    sequence.addBulk = function(instructionSet, amount){
        if(!amount) amount = 1;
        for(var i = 0; i < amount; i++){
            instructionSet.forEach(function(instruction){
                if(instruction.type == "VOID") sequence.addVoid(instruction.value);
                if(instruction.type == "DELAY") sequence.addDelay(instruction.value);
                if(instruction.type == "SET_ASYNC") sequence.setAsync(instruction.value);
            })
        }
        return sequence;
    }
    sequence.execute = function(){
        // A traditional for loop would provide too many issues with this system and dynamic delays.
        // Below is a manual looping system using a self-invoking function that will wait to execute
        // the next instruction using the delay system.
        var i = 0;
        var mx = sequence.exec.length;
        (function next(){
            if(sequence.exec[i].type == "VOID"){
                if(!sequence.isAsync){
                    sequence.exec[i].void();
                    i++;
                    if(i < mx && !sequence.cancelled){
                        next();
                    }
                } else {
                    setAsyncTimeout(function(){
                        sequence.exec[i].void();
                        i++;
                        if(i < mx && !sequence.cancelled){
                            next();
                        }
                    }, 0);
                }
            } else if(sequence.exec[i].type == "DELAY"){
                if(!sequence.isAsync){
                    setTimeout(function(){
                        i++;
                        if(i < mx){
                            next();
                        }
                    }, sequence.exec[i].value);
                } else {
                    setAsyncTimeout(function(){
                        i++;
                        if(i < mx){
                            next();
                        }
                    }, sequence.exec[i].value);
                }
            } else if(sequence.exec[i].type == "SET_ASYNC"){
                sequence.isAsync = sequence.exec[i].value;
                i++;
                if(i < mx){
                    next();
                }
            }
        }());
        return sequence;
    }
    return sequence;
}
const loop = {
    players: function(runnable){
        const players = server.getOnlinePlayers();
        for(var i in players){
            runnable(players[i]);
        }
    },
    action: function(action, iterations, delay, async, exitCallback){
        if(!action) return;
        if(!action.void) return;
        if(!iterations) iterations = 0;
        if(!delay) delay = 0;
        action.setCancelled = function(cancel){
            action.cancel = cancel;
        }
        if(!async){
            (function loop(i){
                setTimeout(function(){
                    if(!action.cancel){
                        action.void();
                    } else {
                        return;
                    }
                    if(--i){
                        loop(i);
                    } else {
                        if(exitCallback) setTimeout(exitCallback, delay);
                    }
                }, (iterations == i) ? 0 : delay);
            }(iterations));
        } else {
            (function loop(i){
                setAsyncTimeout(function(){
                    if(!action.cancel){
                        action.void();
                    } else {
                        return;
                    }
                    if(--i){
                        loop(i);
                    } else {
                        if(exitCallback) setAsyncTimeout(exitCallback, delay);
                    }
                }, (iterations == i) ? 0 : delay);
            }(iterations));
        };
    }
}
