import Watcher from './watcher';
import Context from '@src/context';

let id = 0;

export default class Dep {
	public id: number;
	private watchers: Watcher[];
	constructor() {
		this.id = id++;
		this.watchers = [];
	}

	public add(watcher: Watcher) {
		if (!this.watchers.includes(watcher)) {
			this.watchers.push(watcher);
		}
	}

	public remove(watcher: Watcher) {
		const index = this.watchers.indexOf(watcher);
		if (index >= 0) {
			this.watchers.splice(index, 1);
		}
	}

	public notify() {
		this.watchers.forEach(it => {
			Context.watcherQueue.add(it);
		});
	}
}