import { compose } from "../src";

const compose1 = (state = {}) => ({
	...state,
	action1: true
});

const compose2 = (state = {}) => ({
	...state,
	action2: true
});

describe("Compose tests", () => {
	it("1. Composing multiple functions", () => {
		return expect(
			compose(
				[compose1, compose2],
				{
					action3: true
				}
			)
		).toEqual({
			action1: true,
			action2: true,
			action3: true
		});
	});
});
