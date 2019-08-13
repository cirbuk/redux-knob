import { ActionQueue } from "./ActionQueue";

const defaultOptions = {
	types: [],
	delay: 0
};

export class ThrottleQueue {
	constructor(options) {
		const { types, delay } = { ...defaultOptions, ...options };
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
