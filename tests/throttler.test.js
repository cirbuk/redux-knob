import { createStore, combineReducers, applyMiddleware } from "redux";
import { BATCH_TYPE } from "../src/constants";
import ThrottleQueue from "../src/ThrottleQueue";
import { enableBatching } from "../src";

const defaultState = {
	action1: 0,
	action2: 0,
	action3: 0
};

const data = (state = defaultState, action) => {
	switch (action.type) {
		case "reset":
			return defaultState;
		case "action1":
			return {
				...state,
				action1: state.action1 + 1
			};
		case "action2":
			return {
				...state,
				action2: state.action2 + 1
			};
		case "action3":
			return {
				...state,
				action3: state.action3 + 1
			};
		default:
			return state;
	}
};

const actions = [
	{
		type: "reset"
	},
	{
		type: "action1"
	},
	{
		type: "action2"
	},
	{
		type: "action3"
	}
];

let store;
describe("Test Throttler with defaults", () => {
	const throttler = new ThrottleQueue({ types: ["action1", "action3"], delay: 1000 });
	beforeEach(() => {
		store = createStore(
			enableBatching(
				combineReducers({
					data
				}),
				{
					batchType: BATCH_TYPE
				}
			),
			applyMiddleware(...[throttler.getWare()])
		);
	});

	it("Dispatching action1>action1>action2>action2>action3>action3 test after delay", done => {
		store.dispatch(actions[1]);
		store.dispatch(actions[1]);
		store.dispatch(actions[2]);
		store.dispatch(actions[2]);
		store.dispatch(actions[3]);
		store.dispatch(actions[3]);
		setTimeout(() => {
			expect(store.getState()).toEqual({
				data: {
					action1: 2,
					action2: 2,
					action3: 2
				}
			});
			done();
		}, 4000);
	});

	it("Dispatching action1>action1>action2>action2>action3>action3 test before delay", done => {
		store.dispatch(actions[1]);
		store.dispatch(actions[1]);
		store.dispatch(actions[2]);
		store.dispatch(actions[2]);
		store.dispatch(actions[3]);
		store.dispatch(actions[3]);
		expect(store.getState()).toEqual({
			data: {
				action1: 0,
				action2: 2,
				action3: 0
			}
		});
		done();
	});
});
