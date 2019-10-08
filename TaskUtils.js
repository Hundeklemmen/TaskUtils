const SequenceBuilder = function(){
    var sequence = {};
    sequence.exec = [];
    sequence.isAsync = false;
    sequence.setAsync = function(runAsync){
        sequence.exec.push({type: "SET_ASYNC", value: runAsync});
        return sequence;
    }
    sequence.addVoid = function(runnable){
        sequence.exec.push({type: "VOID", void: runnable});
        return sequence;
    }
    sequence.addDelay = function(delay){
        sequence.exec.push({type: "DELAY", value: delay});
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
                } else {
                    setAsyncTimeout(function(){
                        sequence.exec[i].void();
                    }, 0);
                }
                i++;
                if(i < mx){
                    next();
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