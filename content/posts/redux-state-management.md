---
title: "Getting started with state management using Redux"
date: 2020-06-19
category: "blog"
tag: "react"
published: true
emoji: 🦆
coverImage: 'https://images.unsplash.com/photo-1525538182201-02cd1909effb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1867&q=80'
---# 

Among the many libraries available to manage state in React, Redux is the most popular. But with this popularity has also come a reputation for having a steep learning curve.

In this post we’ll be taking a look at what it takes to create a simple to-do list app using Redux, as well as exploring some of the additional features that Redux provides.

If you want to follow along, I have created a repository for the example app created in this guide at [react-state-comparison](https://github.com/emgoto/react-state-comparison/tree/master/src/redux).

> This post assumes a knowledge of how to render components in React, as well as a general understanding of how hooks work. It also assumes you have read the previous post in the series on [useReducer and React Context](/react-state-management), as we will be making some comparisons to it here.

## Installing Redux

To get started, we’ll need to install both the `redux` and `react-redux` libraries. Use either of the following commands (depending on what package manager you are using):

```bash
yarn add redux react-redux
npm install redux react-redux
```

## Getting up to speed
In the previous post in this series, we created a to-do list app using `useReducer` and React Context that allows us to:

* Edit the name of the to-do list
* Create, edit and delete tasks

We will be re-creating that same example app in this post. 

We also introduced the concept of a store, action, and reducer. As a little refresher:

* A **store** is a central location where we store all the state for our app.
* An **action** is in charge of telling the reducer to modify the store. We dispatch these actions from the UI.
* The **reducer** handles doing what the action tells it to do (i.e. making the necessary modifications to the store).

## Defining your reducer

Defining a reducer in Redux will look very similar to the `useReducer` hook. The only difference is that in Redux, we also pass in the initial state of our app through the reducer.

```js
// src/redux/state/reducers

export const reducer = (state = initialState, action) => {
    const { listName, tasks } = state;
    switch (action.type) {
        case 'updateListName': {
            const { name } = action.payload;
            return { listName: name, tasks }
        }        
		default: {
            return state;
        }
    }
};
```

> If you haven’t seen something like `state = initialState` before, it’s what’s known as a **default parameter** in JavaScript. What we’re saying here is that if the **state** parameter is undefined, use **initialState**.

The initial state will look something like this:
```js
const initialState = {
  listName: 'My new list',
  tasks: {},
};
```

One final note on the reducer is to **never directly modify the state object that we receive**. e.g. Don’t do this:

```js
state.listName = 'New list name';
```

We need our app to re-render when values in our store are changed, but if we directly modify the state object this won’t happen. As the shape of your store gets more complicated, there are libraries like [immer](https://github.com/immerjs/immer) that will be able to do this for you.

## Creating and initialising our store
Next, you can create your Redux store using your reducer:

```js
// src/redux/state/store

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../reducers';

const store = createStore(reducer);

export const TasksProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);
```

## Wrapping our app with the Provider
To make use of our store, we need to create our React app in our `src/redux/components` folder, and wrap it in the `TasksProvider`:

```js
// src/redux/components
import React from 'react';
import { TasksProvider } from '../state/store';
import Name from './name';
import Tasks from './tasks';
import CreateTask from './create-task';

const ReduxApp = () => (
    <>
        <h2>Redux</h2>
        <TasksProvider>
            <Name />
            <Tasks />
            <CreateTask />
        </TasksProvider>
    </>
);

export default ReduxApp;
```

## Fetching data using selectors
With `useReducer`, we always grab the entire state object, and then get what we need from it (e.g. by doing `state.tasks`).

In Redux, we use **selectors** to fetch only the data that we need from the store.
To get the list of tasks from your store, you would create a `tasksSelector`:

```js
// src/redux/state/selectors
export const tasksSelector = (state) => state.tasks;
```

We use these selectors with the `useSelector` hook:
```js
import React from 'react';
import { useSelector } from 'react-redux';
import { tasksSelector } from '../../state/selectors';
import TasksView from '../../../common/components/tasks';
import Task from '../task';

const Tasks = () => {
    const tasks = useSelector(tasksSelector);

    return <TasksView Task={Task} tasks={tasks} />;
};

export default Tasks;
```

### Why do you need selectors?
If the `Tasks` component took in the entire `state` object and got the tasks data via `state.tasks`, React will re-render the `Tasks` component each time _any_ part of the state changed.

By using a selector, `Tasks` will re-render only if the `state.tasks` data changes. If we changed the name of the list, for example, this would no longer cause the `Tasks` component to re-render.

## Dispatching an action
Dispatching actions will also look pretty identical to how we do it with `useReducer`. Here we use the `useDispatch` hook to dispatch an action.

```js
// src/redux/components/name
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NameView from '../../../common/components/name';
import { nameSelector } from '../../state/selectors';

const Name = () => {
    const dispatch = useDispatch();
    const listName = useSelector(nameSelector);

    const onSetName = (name) =>
        dispatch({ type: 'updateListName', payload: { name } });

    return <NameView name={listName} onSetName={onSetName} />;
};

export default Name;
```

After defining your actions, reducer, store and selectors, your state management setup will be complete!

## Redux vs useReducer
We’ve now reached the same point as we did in the previous post on `useReducer`. You’ll notice that there actually isn’t that much difference in the code we've written.

As your app gets bigger, you will start using some of the additional features that Redux provides, and this is where the complexity can start to creep in.

## Moving your actions to a separate file
In larger apps, you would define your actions in a separate file (or files) as constants:

```js
// src/redux-advanced/state/actions
export const UPDATE_LIST_NAME = 'UPDATE_LIST_NAME';
```

One of the reasons we do this is it prevents you from making any typos when referring to your actions. Having it in one place makes things easier to see all the actions your codebase has, and makes it easier to follow naming conventions when creating new actions.

On top of defining your actions as constants, there is also the concept of **action creators**. These are functions that will create the actions for you:

```js
export const updateListName = (name) => ({
    type: UPDATE_LIST_NAME,
    payload: { name }
});
```

It allows you to simplify your code from this:
```js
dispatch({ type: UPDATE_LIST_NAME, payload: { name } });
```

To this:
```js
dispatch(updateListName(name));
```

Defining actions and action creators makes your codebase more maintainable, but it comes at the cost of writing extra code.

## Splitting out your reducer
As you add more functionality to your app, your reducer file is going to get bigger and bigger. At some point, you will probably want to split it out into multiple functions.

Going back to the to-do list example, our store contains `listName` and `tasks`:
```js
{
    listName: 'My new list',
    tasks: {},
}
```

We could split our reducers into one for `listName` and one for `tasks`. The one for `listName` would look like this:
```js
// src/redux-advanced/state/reducers/list-name
import { UPDATE_LIST_NAME } from '../actions';

const initialState = 'Default name';

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LIST_NAME: {
            const { name } = action.payload;
            return name;
        }

        default: {
            return state;
        }
    }
};

export default reducer;
```

The state passed into the above function only contains `listName`. We would also create a separate reducer for `tasks`.
We then combine these two reducers using the `combineReducers` function:
```js
// src/redux-advanced/state/reducers

import { combineReducers } from 'redux';

import listNameReducer from './list-name';
import tasksReducer from './tasks';

const reducer = combineReducers(listNameReducer, tasksReducer);

export default reducer;
```

## The connect function
In Redux today, you can use `useDispatch` to dispatch actions, and `useSelector` to get data from your store. Before React Hooks came along, all Redux apps instead used a function called `connect`. 

You can wrap this `connect` function around your components and it passes in (as props):
* The data that you need from selectors (using `mapStateToProps`)
* Functions that will dispatch actions (using `mapDispatchToProps`)

Here we've wrapped `connect()` around our `Name` component:

```js
// src/redux-advanced/components/name/index.js

import { connect } from 'react-redux';
import { nameSelector } from '../../state/selectors';
import { updateListName } from '../../state/actions';
import Name from './view';

const mapStateToProps = (state) => ({
    name: nameSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
    updateListName: (name) => dispatch(updateListName(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Name);
```

### mapStateToProps
`mapStateToProps` takes in the entire state object as its argument. Using selectors, you can return any values that your component needs. In our case, we needed the list name value from our store. This value will be available as a prop in our `Name` component.

### mapDispatchToProps
`mapDispatchToProps` takes in a dispatch function as its argument. Using it, we can define a function that will dispatch an action. This will also be available as a prop in our `Name` component. `mapDispatchToProps` can also be simplified to this shorthand version:

```js
const mapDispatchToProps = {
    updateListName,
};
```

### The “view” component
`connect()` allows you to put all your state management in one file, and lets you have a “view” file where all you have to focus on is how the component is rendered:

```js
// src/redux-advanced/components/name/view.js

import React from 'react';
import NameView from '../../../common/components/name';

const Name = ({ name, updateListName }) =>
    <NameView name={name} onSetName={updateListName} />;

export default Name;
```

The component no longer has to worry about dispatching actions or using selectors, and instead it can use the props it has been given. 

### Is connect() still useful?
Just because we have hooks today doesn’t render `connect()` obsolete. On top of being useful for separating your state management from your “view” component, it can also have some performance benefits too.

Right now our `Tasks` component:
* Gets all tasks using `tasksSelector`
* Loops through each one to render individual `Task` components

This means that when using Redux hooks, if you edit one task, all tasks will re-render.

With `connect()`, you can pass through components in `mapStateToProps`. In the connect function for our `Tasks` component, we can pass through `Task`:

```js
// src/react-advanced/components/tasks/index.js
import { connect } from 'react-redux';
import { tasksSelector } from '../../state/selectors';
import Task from '../task';
import Tasks from './view';

const mapStateToProps = (state) => ({
    Task,
    tasks: tasksSelector(state),
})

export default connect(mapStateToProps, null)(Tasks);
```

Components that have been passed through `mapStateToProps` will only re-render if they need to. In our case, this means that if we edit a task, only that individual task will re-render.

If you want to read more about the pros and cons of `connect()` vs Redux hooks, I recommend checking out this article on [useSelector vs connect](https://www.samdawson.dev/article/react-redux-use-selector-vs-connect).

## The Redux Toolkit
Redux is known for being verbose and having a lot of boilerplate code. A good example of this is how you define actions and action creators. You go from one line:

```js
dispatch({ type: 'updateListName', payload: { name } });
```

To  more than five:
```js
// Actions file
export const UPDATE_LIST_NAME = 'UPDATE_LIST_NAME';

export const updateListName = (name) => ({
    type: UPDATE_LIST_NAME,
    payload: { name }
});

// Usage
dispatch(updateListName(name));
```

Defining your actions and action creators in a separate file increases the simplicty of your UI code and reduces the possibility of bugs. But the tradeoff is that each time you want to add a new feature to your app, you have to write more code upfront.

The [Redux Toolkit](https://redux-toolkit.js.org/) is Redux’s response to address some of these boilerplate concerns. It provides useful functions to try and simplify the code that you write. For instance, the `createAction` reduces creating actions back down to only two lines of code:

```js
// Defining your action
const updateListName = createAction('updateListName');

// Using your action
dispatch(updateListName({ name }));
```

To see what other features the Redux Toolkit provides, I’d recommend checking out their [Basic Tutorial](https://redux-toolkit.js.org/tutorials/basic-tutorial).

## The Redux DevTools Extension
As one last thing, the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) (available on browsers like Chrome and Firefox) is an insanely useful tool for debugging your React + Redux app.
It lets you see in real-time:
* When actions are fired
* What changes to your store are made as a result of these actions being fired

If you're looking to develop apps with Redux, I would highly recommend that you check it out.

## Conclusion
Building a to-do list app using Redux is quite similar to React's `useReducer` hook. However if you’re working on larger apps (or apps that existed before hooks) you’ll probably have to wrap your head around functions like `combineReducers()` and `connect()` too. If you’re looking to reduce boilerplate, the [Redux Toolkit](https://redux-toolkit.js.org/) looks like a promising way to reduce the amount of code you need to get started with Redux.

I learnt Redux fairly on in my career (actually I learnt it at the same time I learned React) and although I struggled to get my head around the concepts at first, I really grew to be quite fond of it! I hope this post has made things a little bit easier to understand, but if you have any questions, please let me know.

To check out any of the code that we’ve covered today, I’ve created two apps:
* [redux](https://github.com/emgoto/react-state-comparison/tree/master/src/redux) - Redux with hooks
* [redux-advanced](https://github.com/emgoto/react-state-comparison/tree/master/src/redux-advanced) - Redux with `connect()` and `combineReducer()`

Thanks for reading!
