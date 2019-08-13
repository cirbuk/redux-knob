import { isUndefined } from "litedash";
import { BATCH_TYPE, ENABLE_ACTION_QUEUE, FLUSH_ACTION_QUEUE } from "./constants";

const defaultOptions = {
	controlByActions: true,
	enableAction: ENABLE_ACTION_QUEUE,
	flushAction: FLUSH_ACTION_QUEUE,
	enabled: false,
	queueAll: true,
	filterTypes: [],
	excludeFilter: true,
	batchType: BATCH_TYPE
};

export default class ActionQueue {
	constructor(options = {}) {
		const mergedOptions = { ...defaultOptions, ...options };
		const { enabled, size, batchType, filterTypes, excludeFilter, enableAction, flushAction, controlByActions } = mergedOptions;
		this.queue = [];
		this.enabled = enabled;
		this.size = size;
		this.batchType = batchType;
		this.filterTypes = filterTypes;
		this.excludeFilter = excludeFilter;
		this.enableAction = enableAction;
		this.flushAction = flushAction;
		this.controlByActions = controlByActions;
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
			const { type } = action;

			if (this.controlByActions && (type === this.enableAction || type === this.flushAction)) {
				const actionMethod = this.enableAction === type ? "enable" : "flush";
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
