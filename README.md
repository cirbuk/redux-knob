# Redux Middleware Toolbelt

[![Build Status](https://circleci.com/gh/LogRocket/redux-logger/tree/master.svg?style=svg)](https://circleci.com/gh/LogRocket/redux-logger/tree/master)

Maintained by [Kubric](http://kubric.io)

[![](https://res.cloudinary.com/ddbxzcb7k/image/upload/c_scale,w_151/v1565414508/kubric-logo_xio8pa.png)](http://kubric.io)

## Table of contents

-   [Install](#install)
-   [Usage](#usage)
-   [Recipes](#recipes)
-   [Options (Coming Soon) ](#options)

## Install

`yarn add @kubric/redux-knob`

Typescript types will be also available soon.

## Usage

```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import { ActionQueue, enableBatching, ENABLE_ACTION_QUEUE, FLUSH_ACTION_QUEUE } from "@kubric/redux-knob";

// ActionQueue with default options
const actionQueue = new ActionQueue();
store = createStore(
	enableBatching(
		combineReducers({
			data
		})
	),
	applyMiddleware(...[actionQueue.getWare()])
);
```

```javascript
store.dispatch({ type: ENABLE_ACTION_QUEUE });
store.dispatch(actions[0]);
store.dispatch(actions[1]);
store.dispatch({
	type: FLUSH_ACTION_QUEUE,
	payload: actions
});
```

## Recipes

We will be taking help of the following reducer across the recipes.

```javascript
const data = (state = defaultState, action) => {
	switch (action.type) {
		case "reset":
			return defaultState;
		case "🧀":
			return {
				...state,
				cheese: state.cheese + 1
			};
		case "🍕":
			return {
				...state,
				pizza: state.pizza + 1
			};
		case "🥦":
			return {
				...state,
				broccoli: state.broccoli + 1
			};
		case "🥬":
			return {
				...state,
				leafygreens: state.leafygreens + 1
			};
		default:
			return state;
	}
};
```

**1. Batched Action**

```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import { enableBatching } from "@kubric/redux-knob";
store = createStore(
	enableBatching(
		combineReducers({
			data
		}),
		{
			batchType: "batchedType"
		}
	),
	{}
);

const actions = [{ type: "🥦" }, { type: "🥬" }, { type: "🥦" }, { type: "🥦" }];

store.dispatch({
	type: "batchedType",
	payload: actions
});

console.log(store.getState());
// { data: { broccoli: 3, leafygreens: 1, pizza: 0, cheese: 0 } }
```

**2. ActionQueue (With Enable Flush Actions)**

```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import { ActionQueue, enableBatching } from "@kubric/redux-knob";

const actionQueue = new ActionQueue({ enableType: "👍", flushType: "👎" });

store = createStore(
	enableBatching(
		combineReducers({
			data // The reducer
		}),
		{
			batchType: BATCH_TYPE
		}
	),
	applyMiddleware(...[actionQueue.getWare()])
);

store.dispatch({ type: "🥦" }); // Follows normal execution
store.dispatch({ type: "👍" }); // Enables the queue, starts queing
store.dispatch({ type: "🥬" }); // Pushes to the queue
store.dispatch({ type: "🥦" }); // Pushes to the queue
store.dispatch({ type: "👎" }); // Flushes the queue, dispatched a batched action
store.dispatch({ type: "🥬" }); // Follows normal execution
```

**3. ThrottleQueue**

```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import { ThrottleQueue, enableBatching } from "@kubric/redux-knob";

const throttler = new ThrottleQueue({ filterTypes: [🧀, 🍕], filter: 'include', delay: 1000 });

store = createStore(
	enableBatching(
		combineReducers({
			data // Reducer maintaining counts of food items
		}),
		{
			batchType: BATCH_TYPE
		}
	),
	applyMiddleware(...[throttler.getWare()])
);

store.dispatch({ type: "🧀" }); // This will get queued
store.dispatch({ type: "🧀" }); // This will get queued
store.dispatch({ type: "🥦" });
store.dispatch({ type: "🥦" });
store.dispatch({ type: "🥬" });
store.dispatch({ type: "🍕" }); // This will get queued
store.dispatch({ type: "🥬" });
console.log(store.getState());
// { data: { broccoli: 2, leafygreens: 2, pizza: 0, cheese: 0 } }

// ⏰ After 1000ms the first two actions will be batched & dispatched
console.log(store.getState());
// { data: { broccoli: 2, leafygreens: 2, pizza: 1, cheese: 2 } }
```
