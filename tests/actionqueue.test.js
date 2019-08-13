import { createStore, combineReducers, applyMiddleware } from "redux";
import { ActionQueue, enableBatching } from "../src";

const defaultState = {
	brocolli: 0,
	leafygreens: 0
};

const data = (state = defaultState, action) => {
	switch (action.type) {
		case "reset":
			return defaultState;
		case "🥦":
			return {
				...state,
				brocolli: state.brocolli + 1
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

let store;

describe("Test ActionQueue with defaults", () => {
	const actionQueue = new ActionQueue({ enableType: "👍", flushType: "👎" });
	beforeEach(() => {
		store = createStore(
			enableBatching(
				combineReducers({
					data
				})
			),
			applyMiddleware(...[actionQueue.getWare()])
		);
	});

	afterEach(() => {
		store.dispatch({ type: "reset" });
	});

	it("Dispatching 👍 >  🥦 > 🥬", () => {
		store.dispatch({ type: "👍" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥬" });
		return expect(store.getState()).toEqual({
			data: {
				brocolli: 0,
				leafygreens: 0
			}
		});
	});

	it("Dispatching 👍 >  🥦 > 🥬 > 👎", () => {
		store.dispatch({ type: "👍" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥬" });
		store.dispatch({ type: "👎" });
		return expect(store.getState()).toEqual({
			data: {
				brocolli: 1,
				leafygreens: 1
			}
		});
	});
});

describe("Test ActionQueue with controlByAction set false", () => {
	const actionQueue = new ActionQueue({ controlByActions: false });
	beforeEach(() => {
		store = createStore(
			enableBatching(
				combineReducers({
					data
				})
			),
			applyMiddleware(...[actionQueue.getWare()])
		);
	});

	it("Dispatching - 👍 >  🥦 > 🥬", () => {
		store.dispatch({ type: "👍" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥬" });
		return expect(store.getState()).toEqual({
			data: {
				brocolli: 1,
				leafygreens: 1
			}
		});
	});
});

describe("Test ActionQueue with excludeFilter set false", () => {
	beforeEach(() => {
		const actionQueue = new ActionQueue({ filterTypes: ["🥦"], enableType: "👍", flushType: "👎" });
		store = createStore(
			enableBatching(
				combineReducers({
					data
				})
			),
			applyMiddleware(...[actionQueue.getWare()])
		);
	});

	it("Dispatching - 👍 >  🥦 > 🥬", () => {
		store.dispatch({ type: "👍" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥬" });

		return expect(store.getState()).toEqual({
			data: {
				brocolli: 1,
				leafygreens: 0
			}
		});
	});

	it("Dispatching - 👍 >  🥦 > 🥬 > 👎", () => {
		store.dispatch({ type: "👍" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥬" });
		store.dispatch({ type: "👎" });
		return expect(store.getState()).toEqual({
			data: {
				brocolli: 1,
				leafygreens: 1
			}
		});
	});
});
