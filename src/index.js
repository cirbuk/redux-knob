import { BATCH_TYPE } from "./constants";

const defaultOptions = { batchType: BATCH_TYPE };

export * from "./constants";
export * from "./ActionQueue";
export * from "./ThrottleQueue";

export const composeReducers = (reducers = [], defaultState = {}) => (state = defaultState, action) =>
	reducers.reduce((state, reducer) => reducer(state, action), state);

export const compose = (functions = [], defaultState = {}) => functions.reduce((state, fn) => fn(state), defaultState);

export const enableBatching = (reducer, options = {}) => (state, action) => {
	const { batchType } = { ...defaultOptions, ...options };
	if (action.type === batchType) {
		let { payload = [] } = action;
		if (!Array.isArray(payload)) {
			payload = [payload];
		}
		return payload.reduce(reducer, state);
	} else {
		return reducer(state, action);
	}
};
