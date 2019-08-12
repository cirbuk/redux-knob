import { isUndefined } from "litedash";
import { BATCH_TYPE, ENABLE_ACTION_QUEUE, FLUSH_ACTION_QUEUE } from "./constants";

const defaultOptions = {
	enabled: false,
	queueAll: true,
	filterTypes: [],
	excludeFilter: true,
	batchType: BATCH_TYPE
};

export default class ActionQueue {
	constructor({ enabled = false, batchType = BATCH_TYPE, filterTypes = [], excludeFilter = true, size } = defaultOptions) {
		this.enabled = enabled;
		this.queue = [];
		this.size = size;
		this.batchType = batchType;
		this.filterTypes = filterTypes;
		this.excludeFilter = excludeFilter;
	}

	enable() {
		this.enabled = true;
	}

	flush(store) {
		this.enabled = false;
		this.dispatch(store);
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

	checkForSize(store) {
		if (!isUndefined(this.size) && this.queue.length === this.size) {
			console.log("qqq");
			this.dispatch(store);
		}
	}

	getWare() {
		return store => next => action => {
			const { type } = action;

			if (type === ENABLE_ACTION_QUEUE) {
				this.enable();
				return next(action);
			} else if (type === FLUSH_ACTION_QUEUE) {
				this.flush(store);
				return next(action);
			}

			if (this.enabled) {
				if (this.excludeFilter) {
					if (!this.filterTypes.includes(type)) {
						this.queue.push(action);
					} else {
						return next(action);
					}
				} else {
					if (this.filterTypes.includes(type)) {
						this.queue.push(action);
					} else {
						return next(action);
					}
				}
				this.checkForSize(store);
			} else {
				return next(action);
			}
		};
	}
}
