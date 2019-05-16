import Watcher from './watcher';
import Context from '@src/context';

export default class Update {
	private queue: Watcher[];
	private waiting: boolean;
	constructor() {
		this.queue = [];
		this.waiting = false;
	}
	public add(watcher: Watcher) {
		if (!this.queue.includes(watcher)) {
			this.queue.push(watcher);
		}
		if (!this.waiting) {
			this.waiting = true;
			Context.scheduler.nextTick(this.execute.bind(this));
		}
	}
	public execute() {
		while (this.queue.length) {
			const watcher = this.queue.shift();
			if (watcher) {
				watcher.update();
			}
		}
		this.waiting = false;
	}
}