export const composeReducers = (reducers = [], defaultState = {}) => (state = defaultState, action) =>
	reducers.reduce((state, reducer) => reducer(state, action), state);

export const compose = (functions = [], defaultState = {}) => functions.reduce((state, fn) => fn(state), defaultState);

export const enableBatching = (reducer, { batchType = "BATCHED_ACTION" }) => (state, action) => {
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
