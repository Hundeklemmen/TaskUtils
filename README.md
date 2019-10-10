# TaskUtils
TaskUtils lib for use with Drupi. Download Drupi at https://drupi.js.org

The current latest version of TaskUtils is **1.1**, and this documentation will always be in reference to the latest version of TaskUtils.

# What's TaskUtils?
TaskUtils is a Drupi library that allows Drupi script creators to easily create and execute task "sequences". The main component of TaskUtils is the `SequenceBuilder` constructor. A `SequenceBuilder` sequence makes it possible to easily add delays, toggle async execution and more to your code without cluttering it with a spam of setTimeout callbacks.

# Install Guide
Firstly, make sure that `Drupi` is installed on your server. If it isn't, you can download it from https://drupi.js.org. Once Drupi is installed, restart your server and navigate to the `plugins/Drupi` directory, create a new folder named `libs` and enter it, then place `TaskUtils.js` inside. You can now use TaskUtils in your Drupi scripts!

# How to use SequenceBuilder

There are 4 methods that can be used on a SequenceBuilder object. These are:

`addVoid(function)` - add a function to be executed

`addDelay(int)` - add a delay before continuing execution

`addBulk(array, int)` - insert a set of instructions to the sequence, optionally more than once

`setAsync(boolean)` - switch between executing code sync or async

`setCancelled(boolean)` - if true, the sequence will terminate instead of continuing to the next instruction. This is meant to be used in a void.

`execute()` - run your sequence

There are simple and advanced ways to use SequenceBuilder. Let's cover the simple way first.

```js
var sequence = new SequenceBuilder();
sequence.addVoid(function(){
    server.broadcastMessage("Hello!");
});
sequence.addDelay(20);
sequence.addVoid(function(){
    server.broadcastMessage("Hi again!");
});
sequence.execute();
```

The above example creates a new SequenceBuilder sequence and stores it in the variable sequence. Then, a function to broadcast "Hello!" is added. After, a 20 tick delay is added, which means 20 ticks will be waited before executing the next instruction. Then, a function to broadcast "Hi again!" is added, this will be sent 20 ticks after the first message because of the added delay. Finally, `sequence.execute()` runs the sequence.

The following example is a little less simple, but at the same time more compact:

```js
var sequence = new SequenceBuilder().addVoid(function(){
    server.broadcastMessage("Hello!");
}).addDelay(20).addVoid(function(){
    server.broadcastMessage("Hi again!");
});
sequence.execute();
```

The above example does the exact same thing as the first example, except this time the entire sequence is set up without needing to spam `sequence.` every time / update the contents of the sequence variable.

The final example is only slightly more advanced, but often will be the way you want to use SequenceBuilder the most:

```js
SequenceBuilder().addVoid(function(){
    server.broadcastMessage("Hello!");
}).addDelay(20).addVoid(function(){
    server.broadcastMessage("Hi again!");
}).execute();
```

The above example does not even store the sequence in a variable, it just creates and executes run, and that's it.

# Inserting an instruction set with the addBulk method

You can add more than one instruction at a time using the addBulk method, and insert that set of instructions more than once if desired. This can be used to help further condense your code if you have a lot of reptition in your sequence, example for a countdown.

The addBulk method has two parameters:

`instructionSet` - an array containing the instructions to add to the sequence (as objects)

`amount` *(optional)* - an integer to specify how many times to add the instruction set to the sequence. Defaults to 1.

An instruction is an object containing these two properties:

`type` - the instruction type this object is. Accepted values: `VOID`, `DELAY`, `SET_ASYNC`

`value` - the value to use. For a `VOID`, this is a function. For a `DELAY`, this is the delay (in ticks). For `SET_ASYNC`, this is a boolean.

Example without using addBulk:

```js
var i = 5;
SequenceBuilder().addVoid(function(){
    server.broadcastMessage(i);
    i--;
}).addDelay(20).addVoid(function(){
    server.broadcastMessage(i);
    i--;
}).addDelay(20).addVoid(function(){
    server.broadcastMessage(i);
    i--;
}).addDelay(20).addVoid(function(){
    server.broadcastMessage(i);
    i--;
}).addDelay(20).addVoid(function(){
    server.broadcastMessage(i);
    i--;
}).addDelay(20).addVoid(function(){
    server.broadcastMessage("Done!");
}).execute();
```

Example with addBulk:

```js
var i = 5;
SequenceBuilder().addBulk([{type: "VOID", value: function(){
    server.broadcastMessage(i);
    i--;
}}, {type: "DELAY", value: 20}], 5).addVoid(function(){
    server.broadcastMessage("Done!");
}).execute();
```

# Using the setCancelled method

Usage of the setCancelled method is different depending on whether you are storing your sequence in a variable or not. If the sequence is being stored in a variable, you can use this method:

```js
var sequence = new SequenceBuilder();
sequence.addVoid(function(){
    sequence.setCancelled(true);
}).addVoid(function(){
    server.broadcastMessage("This should not be sent!");
}).execute();
```

And the message in the above example will not be sent because the sequence was cancelled before its instruction was executed. However, if you are not storing the sequence in a variable, it is still possible to cancel the sequence. A void instruction can access its instruction object using the `this` keyword. If you don't want to store the sequence in a variable, the following example will still work:

```js
SequenceBuilder().addVoid(function(){
    this.getSequence().setCancelled(true);
}).addVoid(function(){
    server.broadcastMessage("This should not be sent!");
}).execute();
```

# How to use loops

New in the v1.1 update to TaskUtils is the `loop` util. There are two loops that can be invoked using it right now:

`loop.players(function)` - loops all players, and runs the passed function, passing the current looped player as the first function parameter.

Example:

```js
loop.players(function(loopPlayer){
    loopPlayer.sendMessage("Hi there, "+loopPlayer.getName()+"!");
});
```

`loop.action(action, int, int, boolean, function)` - runs an action. Parameters:

`action (Action)` - the Action to execute.

`iterations (int)` - the amount of times to execute the function. If not defined, nothing will happen.

`delay (int)` *(optional)* - the delay (in ticks) between running each iteration of the function. Defaults to 0.

`async (boolean)` *(optional)* - whether or not to run the function async. Defaults to false.

`exitCallback(function)` *(optional)* - an optional second function to be executed after all iterations of the primary function are complete. The exit callback will be called after the same delay as another iteration of the primary function would.

An Action is an object containing the function to execute, and if the loop should terminate after that instance of the action's execution. This is done by using `this.setCancelled(true)` in an action's void.

Example:

```js
loop.action({void: function(){
    server.broadcastMessage("Hello everyone! :)");
}}, 5, 20, false, function(){
    server.broadcastMessage("Goodbye everyone! :(");
});
```

In this example, the server will broadcast "Hello everyone :)" 5 times with a 1 second delay in between each time, then 1 second after the fifth time, it will broadcast "Goodbye everyone :(".
