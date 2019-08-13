import { createStore, combineReducers, applyMiddleware } from "redux";
import { ThrottleQueue, enableBatching } from "../src";

const defaultState = {
	cheese: 0,
	pizza: 0,
	broccoli: 0,
	leafygreens: 0
};

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

let store;
describe("Test Throttler with defaults", () => {
	const throttler = new ThrottleQueue({ types: ["🧀", "🍕"], delay: 3000 });

	store = createStore(
		enableBatching(
			combineReducers({
				data
			})
		),
		applyMiddleware(...[throttler.getWare()])
	);
	it("Dispatching 🧀 > 🧀 > 🥦 > 🥦 >🥬 > 🍕 > 🥬 test after delay", done => {
		store.dispatch({ type: "reset" });
		store.dispatch({ type: "🧀" });
		store.dispatch({ type: "🧀" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥬" });
		store.dispatch({ type: "🍕" });
		store.dispatch({ type: "🥬" });
		setTimeout(() => {
			expect(store.getState()).toEqual({
				data: {
					cheese: 2,
					broccoli: 2,
					leafygreens: 2,
					pizza: 1
				}
			});
			done();
		}, 4000);
	});

	it("Dispatching 🧀 > 🧀 > 🥦 > 🥦 >🥬 > 🍕 > 🥬 test before delay", done => {
		store.dispatch({ type: "reset" });
		store.dispatch({ type: "🧀" });
		store.dispatch({ type: "🧀" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥦" });
		store.dispatch({ type: "🥬" });
		store.dispatch({ type: "🍕" });
		store.dispatch({ type: "🥬" });
		expect(store.getState()).toEqual({
			data: {
				cheese: 0,
				broccoli: 2,
				leafygreens: 2,
				pizza: 0
			}
		});
		done();
	});
});
