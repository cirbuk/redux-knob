import { isUndefined } from "@kubric/litedash";
import { BATCH_TYPE, ENABLE_ACTION_QUEUE, FLUSH_ACTION_QUEUE } from "./constants";

const defaultOptions = {
	controlByActions: true,
	enableType: ENABLE_ACTION_QUEUE,
	flushType: FLUSH_ACTION_QUEUE,
	enabled: false,
	queueAll: true,
	filterTypes: [],
	excludeFilter: true,
	batchType: BATCH_TYPE
};

export class ActionQueue {
	constructor(options = {}) {
		const { enabled, size, batchType, filterTypes, excludeFilter, enableType, flushType, controlByActions, timeInterval } = {
			...defaultOptions,
			...options
		};
		this.queue = [];
		this.enabled = enabled;
		this.size = size;
		this.batchType = batchType;
		this.filterTypes = filterTypes;
		this.excludeFilter = excludeFilter;
		this.enableType = enableType;
		this.flushType = flushType;
		this.controlByActions = controlByActions;
		this.timeInterval = timeInterval;
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
			this.dispatch(store);
		}
	}

	getWare() {
		return store => next => action => {
			if (!isUndefined(this.timeInterval)) {
				setInterval(() => {
					this.dispatch(store);
				}, this.timeInterval);
			}
			const { type } = action;

			if (this.controlByActions && (type === this.enableType || type === this.flushType)) {
				const actionMethod = this.enableType === type ? "enable" : "flush";
				this[actionMethod](store);
				return next(action);
			}

			const actionNeedsToBeIncluded =
				(!this.excludeFilter && this.filterTypes.includes(type)) || (this.excludeFilter && !this.filterTypes.includes(type));
			const actionNeedsToBePushToQueue = this.enabled && actionNeedsToBeIncluded;

			if (actionNeedsToBePushToQueue) {
				this.queue.push(action);
				this.checkForSize(store);
			} else {
				return next(action);
			}
		};
	}
}
