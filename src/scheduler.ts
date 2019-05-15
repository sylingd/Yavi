type Task = () => void;

const macroTimerFunc = (() => {
	if (typeof setImmediate !== 'undefined') {
		return setImmediate;
	} else {
		return (task: any) => {
			setTimeout(task, 0)
		}
	}
})();
const microTimerFunc = (() => {
	if (typeof Promise !== 'undefined') {
		return (task: any) => {
			const p = Promise.resolve();
			p.then(task);
		}
	} else {
		return macroTimerFunc;
	}
})();

export default class Scheduler {
	private queue: Task[];
	private waiting: boolean;
	constructor() {
		this.queue = [];
		this.waiting = false;
	}
	public nextTick(task: Task) {
		this.queue.push(task);
		if (!this.waiting) {
			this.waiting = true;
			microTimerFunc(this.execute.bind(this));
		}
	}
	public execute() {
		while (this.queue.length) {
			const task = this.queue.pop();
			if (task) {
				task();
			}
		}
		this.waiting = false;
	}
}