import { createStore, combineReducers } from "redux";
import { enableBatching } from "../src";

const data = (state = {}, action) => {
	switch (action.type) {
		case "action1":
			return {
				...state,
				action1: true
			};
		case "action2":
			return {
				...state,
				action2: true
			};
		default:
			return state;
	}
};

const actions = [
	{
		type: "action1"
	},
	{
		type: "action2"
	}
];

const expectedCase = {
	data: {
		action1: true,
		action2: true
	}
};

let store;
describe("Batched reducer tests", () => {
	beforeEach(() => {
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
	});

	it("1. actions one after other", () => {
		store.dispatch(actions[0]);
		store.dispatch(actions[1]);
		return expect(store.getState()).toEqual(expectedCase);
	});
	it("2. batched actions", () => {
		store.dispatch({
			type: "batchedType",
			payload: actions
		});
		return expect(store.getState()).toEqual(expectedCase);
	});
});
