import { throttle, debounce } from "litedash";
import ActionQueue from "./ActionQueue";

const defaultOptions = {
	types: [],
	delay: 0
};

export default class ThrottleQueue {
	constructor(options) {
		const mergedOptions = { ...defaultOptions, ...options };
		const { types, delay } = mergedOptions;
		this.delay = delay;
		this.types = types;
		this.actionQueue = new ActionQueue({
			filterTypes: this.types,
			excludeFilter: false,
			enabled: true,
			controlByActions: false,
			timeInterval: delay
		});
	}

	enable() {
		this.actionQueue.enable();
	}

	disable() {
		this.actionQueue.flush();
	}

	getWare() {
		return this.actionQueue.getWare();
	}
}
