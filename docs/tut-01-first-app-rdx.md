# Getting started: Your very first web application with rdx

In this tutorial you will create a web application, that will display different greeting messages upon clicking a button. There are different buttons for different messages. Also it will count and display the number of times that buttons have been clicked.

You will then install rdx and change the application to manage the state with rdx. Finally we'll have a quick look at what the benefits of using a state manager are.

Be warned, that the way we will use rdx here, is actually not idiomatic usage of rdx. It's designed to help you learn the fundamental concepts and inner workings of rdx. In later tutorials we'll cover more idiomatic ways to go about this.

In case you want to have a look at the source code of this tutorial, you can [view it on github](https://github.com/djlauk/rdx-tutorial-01). You can see the various steps reflected in the commit history.

## Pre-requisites

To follow this tutorial you must have [node.js](https://nodejs.org) installed. Installing node.js will also install the `npm` command line program.

You should also be familiar with "modern JavaScript" (at least ES6 / ES2015), i.e. you should be familiar with the following concepts:

- EcmaScript modules (ESM), i.e. `import ...` and `export ...`.
- Variable declarations with `const` and `let`.
- Arrow functions.
- Spread operators and destructuring assignments.
- Template literal strings.

## Step 1: Create an empty npm project

An npm project is a JavaScript project, that utilizes the `npm` command line program to manage its dependencies and other utilities. Dependencies are libraries / packages, that your project relies on to do its work. *rdx* is going to be a dependency of your project.

- Create a directory for this tutorial and change into that directory.
- Inside the directory for this tutorial, run `npm init -y`. This will create a `package.json` with default values. The existance of `package.json` is what tells the `npm` program, that this directory is an *npm project*.

Here's the sequence of commands for this step. It should work the same on either macOS, Linux, or Windows:

```sh
mkdir rdx-tutorial-01
cd rdx-tutorial-01
npm init -y
```

This command created the file `package.json`. Go ahead and have a look inside it with a text editor, right now. This is what you should see:

```json
{
  "name": "rdx-tutorial-01",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Step 2: Creating a minimal web application

Create file `index.html` with these contents:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>rdx tutorial 01</title>
</head>
<body>
    <h1 id="greeting"></h1>
    <button id="btnHello">Say Hello</button>
    <button id="btnHowdy">Say Howdy</button>
    <button id="btnHi">Say Hi</button>
    <p>Click a button. Come on. You know, you want to ;-)</p>
    <p id="counter"></p>
    <script type="module" src="./app.js"></script>
</body>
</html>
```

Create a file `src/app.js` with these contents:

```js
// our applications state: the message to display
let message = "";
let numClicks = 0;

function updateGreeting() {
    const el = document.getElementById('greeting');
    el.innerText = message;
}

function updateCounter() {
    const el = document.getElementById('counter');
    el.innerText = `Processed ${numClicks} ${numClicks === 1 ? 'click' : 'clicks'}.`;
}

// make the buttons change the message
document.getElementById('btnHello').addEventListener('click', () => {
    message = "Hello, rdx!";
    updateGreeting();
    numClicks++;
    updateCounter();
});
document.getElementById('btnHowdy').addEventListener('click', () => {
    message = "Howdy, rdx!";
    updateGreeting();
    numClicks++;
    updateCounter();
});
document.getElementById('btnHi').addEventListener('click', () => {
    message = "Hi, rdx!";
    updateGreeting();
    numClicks++;
    updateCounter();
});
```

## Step 4: Viewing the minimal web application

npm projects allow us to use libraries / packages from other developers. One part of making that possible is the `npm` command line program. The other part is a place where the packages are uploaded to, and later downloaded from, the npm *package registry*.

For this step you will add a stand-alone development web server to your project. You will use the package *es-dev-server* for that, which helps in two important aspects:

- It serves your application to your browser over HTTP. Some browser features will not work, if you load the `index.html` from the filesystem. That is in fact a security feature.
- es-dev-server "knows" how to locate packages you install with `npm`. This is only required while developing. For deploying and running your web application on a web server, you will not need es-dev-server. (You will need to do something else, e.g. "bundle" the application or create "import maps", but either is out of scope for this tutorial.)

As you only need es-dev-server while you're developing, you add it to the `devDependencies` of this npm project. Do this now by running:

```sh
npm install -D es-dev-server
```

Have another look at `package.json` in your text editor. You'll notice, that `npm` created a `devDependencies` section and added `es-dev-server` to it. Also it created a file `package-lock.json`, where it records, which version it exactly installed, where it got it from, and what the hash is, to prevent tampering with the libraries and detect faulty downloads. Another thing you can see now, is that a folder `node_modules` has been created. This is where `npm` stores the downloaded dependencies (and their dependencies, and their dependencies' dependencies, and ...).

es-dev-server needs some parameters to serve the web application correctly:

- `--node-resolve` makes es-dev-server change the `import` statements in `.js` files into URLs that the browser can understand.
- `--open` makes es-dev-server open your default browser and point it to its home page.

Add a *script* to your npm project for convenience. This way you don't have to memorize and type the parameters above every time. Open `package.json` in a text editor and add the line `"dev": ...` in the `"scripts"` section, so you end up with this:

```json
...
"scripts": {
  "dev": "es-dev-server --root-dir ./src --open",
  "test": "echo \"Error: no test specified\" && exit 1"
},
...
```

Now you can simply run `npm run dev` to execute the `dev` script, which will run es-dev-server with the parameters set and view the app in your browser:

```sh
npm run dev
```

Have a look, click some buttons, see what it does. Then check the source code and make sure you know what is going on.

## Step 5: Install rdx

Next, you will make the application use rdx. So first you need to install rdx by running this command:

```sh
npm install @captaincodeman/rdx
```

In case you wondered, the `@captaincodeman/` part denotes a "package scope". It's a way of grouping packages from the same author or organization and preventing naming collisions.

Have another look at `package.json`. You can now see that `@captaincodeman/rdx` has been added to the `dependencies` section. Compare that to package es-dev-server having been added to the `devDependencies`. Short recap: The `devDependencies` are used while developing, while the `dependencies` are used at runtime. As we will need rdx while our app is running to manage the application state, the right place for it to go is in the `dependencies`.

## Step 6: Use rdx to manage the state

rdx's job is to manage your application's state. Granted, this tutorial application doesn't have a lot of state, but still.

In `app.js` at the top of the file replace the two variables for the state with this:

```js
import {Store} from '@captaincodeman/rdx';

// our application's state
const initialState = {
    message: '',
    numClicks: 0,
}

// the reducer: how to get from one state to the next
const greetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'hello':
            return {...state, message: 'Hello, rdx!', numClicks: state.numClicks + 1}
        case 'howdy':
            return {...state, message: 'Howdy, rdx!', numClicks: state.numClicks + 1}
        case 'hi':
            return {...state, message: 'Hi, rdx!', numClicks: state.numClicks + 1}
        default:
            return state;
    }
};

// the store is the engine for managing the state
const store = new Store(initialState, greetingReducer);
```

This part of the code holds the key ingredients to the state management with rdx:

- The `initialState` describes the structure of the state and defines the starting point by assigning initial values.
- The `greetingReducer` defines how to derive the next state (the `return` value), based on the current `state` and an `action`, which are both provided as parameters.

One **very important thing to note** is, that the reducer function does **not modify** the existing state, it creates and returns a new state object. That means, calling the reducer has **no side effects** as of itself. That means, that the rest of the code can rest assured, that the state it got from the store at some point will not be changed. (If you have ever worked on a bigger project, knowing that no one will modify bits of data is bliss.) Instead, the store will notify the rest of the code, when it has a new state.

So, let's add that to the code. In `app.js`, right under the `const store = ...` add this:

```js
// when there was an update, the store will tell us through events
store.addEventListener('state', () => {
    updateGreeting();
    updateCounter();
});
```

Now let's modify `updateGreeting` and `updateCounter` to use the data from the state in the store:

```js
function updateGreeting() {
    const el = document.getElementById('greeting');
    el.innerText = store.state.message;
}

function updateCounter() {
    const el = document.getElementById('counter');
    const n = store.state.numClicks;
    el.innerText = `Processed ${n} ${n === 1 ? 'click' : 'clicks'}.`;
}
```

Finally, we need to change the buttons' click handlers. In particular, we need to shift the mind set. Before the click handlers' job was modifying the data to be displayed and making sure, that this is processed. Now, with rdx, these jobs are separated. The click handler's new job is to tell the store, that something happened. That's done by asking the store to dispatch an action to the reducer. So, without further ado, here are the new click handlers:

```js
// make the buttons inform the store
document.getElementById('btnHello').addEventListener('click', () => {
    const action = { type: 'hello' };
    store.dispatch(action);
});
document.getElementById('btnHowdy').addEventListener('click', () => {
    const action = { type: 'howdy' };
    store.dispatch(action);
});
document.getElementById('btnHi').addEventListener('click', () => {
    const action = { type: 'hi' };
    store.dispatch(action);
});
```

We could've used anything as an action, but it's idiomatic to make it an object with a `type` field. (More complicated actions can take parameters, that usually go into a `payload` field. But that's for another tutorial.)

That should be it, reload the application in your browser and see for yourself. It might be a good idea to open the developer tools, set some break points, and experience how control flows from one part to the next.

## Step 7: Separate concerns

The code for state management and UI handling live in the same file. Even though the file is still not large, and this is "just a tutorial", these are totally separate concerns and it's good practice to separate this.

Create file `store.js` and move the top part of `app.js` there. You'll also need to `export` the store, so you can still access it in `app.js`.

So, this is what `store.js` looks like now:

```js
import {Store} from '@captaincodeman/rdx';

// our application's state
const initialState = {
    message: '',
    numClicks: 0,
}

// the reducer: how to get from one state to the next
const greetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'hello':
            return {...state, message: 'Hello, rdx!', numClicks: state.numClicks + 1}
        case 'howdy':
            return {...state, message: 'Howdy, rdx!', numClicks: state.numClicks + 1}
        case 'hi':
            return {...state, message: 'Hi, rdx!', numClicks: state.numClicks + 1}
        default:
            return state;
    }
};

// the store is the engine for managing the state
export const store = new Store(initialState, greetingReducer);
```

And this is what `app.js` looks like now:

```js
import { store } from './store.js';

// when there was an update, the store will tell us through events
store.addEventListener('state', () => {
    updateGreeting();
    updateCounter();
});
// ...
```

## Step 8: Use action creators

The last bit that is "unclean" in our application, is that the click handlers need to "know" not only that there *is* an action that can be invoked, but also, *how* to create the action.

Imagine you'd want to cause the same change to the state from a different part of the app, say a toolbar or a keyboard shortcut. You'd need to copy the code, and hope it doesn't need adapting or changing, e.g. because you decide to change the string in the `action.type`.

What you would commonly do, to solve this type of problem (duplicating code by copy & paste), is move the code in question into its own function and just call it instead. And that is exactly the right thing to do here, as well. And because those functions create action objects, they are aptly referred to as "action creators".

Add this to the end of `store.js`:

```js
// action creators
export const hello = () => ({type: 'hello'});
export const howdy = () => ({type: 'howdy'});
export const hi = () => ({type: 'hi'});
```

And change the click handlers in `app.js` to look like that:

```js
// make the buttons inform the store
document.getElementById('btnHello').addEventListener('click', () => {
    store.dispatch(hello());
});
document.getElementById('btnHowdy').addEventListener('click', () => {
    store.dispatch(howdy());
});
document.getElementById('btnHi').addEventListener('click', () => {
    store.dispatch(hi());
});
```

Now the code in `store.js` only handles the state, while `app.js` takes care of the UI and only interacts with the state in the store through the API that `store.js` exposes.

## Closing thoughts

You covered a lot of ground in this tutorial: You created an npm project, installed packages with `npm`, and transformed a simple web application to use rdx as a state manager.

Maybe you're thinking "Yeah sure, big deal... I restructured code to use functions in a clever way, there's nothing special about that!". Well, if you're thinking that, you're actually *spot on*! State management *is no magic*, it's a rather old, tried and true technique of software engineering. Using a library like rdx to do it, reduces the amount of code you need to write and maintain.

Again, the way we used rdx here, is actually not, how you'd be using it in practice. This exercise was specifically designed to show you, that what rdx does at its core, is neither very complicated nor fancy. But rdx has some quite a bit *more to offer*, which will be covered, bit by bit, in the next tutorials.
