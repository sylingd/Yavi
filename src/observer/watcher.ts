import Dep from './dep';

type Callback = () => void;

export default class Watcher {
	private deps: Dep[];
	private depsId: Set<number>;
	private newDeps: Dep[]
	private newDepsId: Set<number>;
	private collecting: boolean;
	private callback: Callback;
	constructor(callback: Callback) {
		this.deps = [];
		this.newDeps = [];
		this.depsId = new Set();
		this.newDepsId = new Set();
		this.collecting = false;
		this.callback = callback;
	}

	public start() {
		this.collecting = true;
	}

	public add(dep: Dep) {
		if (this.collecting && !this.newDepsId.has(dep.id)) {
			this.newDeps.push(dep);
			this.newDepsId.add(dep.id);
			dep.add(this);
		}
	}

	public update() {
		this.callback();
	}

	public end() {
		this.collecting = false;
		this.deps.forEach(it => {
			if (!this.newDepsId.has(it.id)) {
				// remove dep
				it.remove(this);
			}
		});
		const it = this.depsId;
		it.clear();
		this.deps = this.newDeps;
		this.depsId = this.newDepsId;
		this.newDeps = [];
		this.newDepsId = it;
	}
}