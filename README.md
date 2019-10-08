# TaskUtils
TaskUtils lib for use with Drupi. Download Drupi at https://drupi.js.org

# What's TaskUtils?
TaskUtils is a Drupi library that allows Drupi script creators to easily create and execute task "sequences". The main component of TaskUtils is the `SequenceBuilder` constructor. A `SequenceBuilder` sequence makes it possible to easily add delays, toggle async execution and more to your code without cluttering it with a spam of setTimeout callbacks.

# Install Guide
Firstly, make sure that `Drupi` is installed on your server. If it isn't, you can download it from https://drupi.js.org. Once Drupi is installed, restart your server and navigate to the `plugins/Drupi` directory, create a new folder named `libs` and enter it, then place `TaskUtils.js` inside. You can now use TaskUtils in your Drupi scripts!

# How to use SequenceBuilder

There are 4 methods that can be used on a SequenceBuilder object. These are:

`addVoid(function)` - add a function to be executed
`addDelay(int)` - add a delay before continuing execution
`setAsync(boolean)` - switch between executing code sync or async
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
