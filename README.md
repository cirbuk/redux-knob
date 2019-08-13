# Redux Middleware Toolbelt
[![Build Status](https://circleci.com/gh/LogRocket/redux-logger/tree/master.svg?style=svg)](https://circleci.com/gh/LogRocket/redux-logger/tree/master)

Maintained by [Kubric](http://kubric.io)

[![](https://res.cloudinary.com/ddbxzcb7k/image/upload/v1565414508/kubric-logo_xio8pa.png)](http://kubric.io)


## Table of contents
* [Install](#install)
* [Usage](#usage)
* [Options (Coming Soon) ](#options)
* [Recipes (Coming Soon) ](#recipes) 
* [License](#license)

## Install
`yarn add redux-knob`

Typescript types will be also available.

## Usage
```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import { ActionQueue } from "redux-knob";

// ActionQueue with default options
const actionQueue = new ActionQueue();
store = createStore(
			enableBatching(
				combineReducers({
					data
				}),
				{
					batchType: BATCH_TYPE
				}
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
