import { BATCH_TYPE, ENABLE_ACTION_QUEUE, FLUSH_ACTION_QUEUE } from "./constants";
import { isUndefined } from "litedash";

export default class ActionQueue {
	constructor(batchType = BATCH_TYPE, exclude = [], size) {
		this.queue = [];
		this.enabled = false;
		this.exclude = exclude;
		this.size = size;
		this.batchType = batchType;
	}

	enable() {
		this.enabled = true;
	}

	flush() {
		this.enabled = false;
		this.dispatch(this.store);
	}

	dispatch(store) {
		if (this.queue && this.queue.length > 0) {
			const payload = [...this.queue];
            this.queue = [];
			store.dispatch({
				type: this.batchType,
				payload
			});
		}
	}

	getWare() {
		return store => next => action => {
			const { type } = action;

			if (type === ENABLE_ACTION_QUEUE) {
				this.enable();
				next(action);
			} else if (type === FLUSH_ACTION_QUEUE) {
				this.flush();
				next(action);
			}

			if (this.enabled && !this.exclude.includes(type)) {
				this.queue.push(action);
				if (!isUndefined(this.size) && this.queue.length === this.size) {
					this.dispatch(this.store);
				}
				this.store = store;
			} else {
				return next(action);
			}
		};
	}
}
