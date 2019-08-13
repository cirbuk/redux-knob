import { createStore, combineReducers, applyMiddleware } from "redux";
import { ENABLE_ACTION_QUEUE, FLUSH_ACTION_QUEUE, BATCH_TYPE } from "../src/constants";
import { enableBatching } from "../src";
import ActionQueue from "../src/ActionQueue";

const defaultState = {
	action1: false,
	action2: false
};

const data = (state = defaultState, action) => {
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

let store;
describe("Test ActionQueue with defaults", () => {
	const actionQueue = new ActionQueue();
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
			applyMiddleware(...[actionQueue.getWare()])
		);
	});

	it("Dispatching enabled>action1>action2", () => {
		store.dispatch({ type: ENABLE_ACTION_QUEUE });
		store.dispatch(actions[0]);
		store.dispatch(actions[1]);
		return expect(store.getState()).toEqual({
			data: {
				action1: false,
				action2: false
			}
		});
	});

	it("Dispatching - enable>action1>action2>flush", () => {
		store.dispatch({ type: ENABLE_ACTION_QUEUE });
		store.dispatch(actions[0]);
		store.dispatch(actions[1]);
		store.dispatch({
			type: FLUSH_ACTION_QUEUE,
			payload: actions
		});
		return expect(store.getState()).toEqual({
			data: {
				action1: true,
				action2: true
			}
		});
	});
});

describe("Test ActionQueue with excludeFilter set false", () => {
	const actionQueue = new ActionQueue({ excludeFilter: false, filterTypes: [actions[0].type] });
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
			applyMiddleware(...[actionQueue.getWare()])
		);
	});

	it("Dispatching - enable>action1>action2", () => {
		store.dispatch({ type: ENABLE_ACTION_QUEUE });
		store.dispatch(actions[0]);
		store.dispatch(actions[1]);

		return expect(store.getState()).toEqual({
			data: {
				action1: false,
				action2: true
			}
		});
	});

	it("Dispatching - enable>action1>action2>flush", () => {
		store.dispatch({ type: ENABLE_ACTION_QUEUE });
		store.dispatch(actions[0]);
		store.dispatch(actions[1]);
		store.dispatch({
			type: FLUSH_ACTION_QUEUE,
			payload: actions
		});
		return expect(store.getState()).toEqual({
			data: {
				action1: true,
				action2: true
			}
		});
	});
});
