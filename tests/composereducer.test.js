import { createStore } from "redux";
import { composeReducers } from "../src";

const reducer1 = (state = {}, action) => {
	switch (action.type) {
		case "action1":
			return {
				...state,
				action1: true
			};
		default:
			return state;
	}
};

const reducer2 = (state = {}, action) => {
	switch (action.type) {
		case "action2":
			return {
				...state,
				action2: true
			};
		default:
			return state;
	}
};

const action1 = {
	type: "action1"
};

const action2 = {
	type: "action2"
};

const expectedCase = {
	action1: true,
	action2: true,
	action3: true
};

const composedReducer = composeReducers([reducer1, reducer2], {});

let store;

describe("Compose reducers tests", () => {
	beforeEach(() => {
		store = createStore(composedReducer, {
			action3: true
		});
	});

	it("1. Composed reducer test", () => {
		store.dispatch(action1);
		store.dispatch(action2);
		return expect(store.getState()).toEqual(expectedCase);
	});
});
