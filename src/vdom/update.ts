import { IChangedNode, NodeState } from '@src/vdom/diff';
import Context from '@src/context';
import { VNode, isComponent } from '@src/vdom/vnode';

export default class Update {
	private queue: IChangedNode[];
	private waiting: boolean;
	constructor() {
		this.queue = [];
		this.waiting = false;
	}
	public add(task: IChangedNode | IChangedNode[]) {
		if (task instanceof Array) {
			this.queue = this.queue.concat(task);
		} else {
			this.queue.push(task);
		}
		if (!this.waiting) {
			this.waiting = true;
			Context.scheduler.nextTick(this.execute.bind(this));
		}
	}
	public execute() {
		while (this.queue.length) {
			const task = this.queue.shift();
			if (task) {
				this.executeOne(task);
			}
		}
		this.waiting = false;
	}
	private executeOne(task: IChangedNode) {
		switch (task.type) {
			case NodeState.Replace:
				if (task.node.parent && task.old && !isComponent(task.node)) {
					if (isComponent(task.node)) {
						task.node.type.update();
					} else {
						const node = Context.render.create(task.node);
						task.node.node = node;
						Context.render.replace(task.node.parent.node, task.old.node, node);
						this.createChild(task.node);
					}
				}
				break;
			case NodeState.Insert:
				if (task.node.parent) {
					if (isComponent(task.node)) {
						task.node.type.update();
					} else {
						const node = Context.render.create(task.node);
						task.node.node = node;
						Context.render.insert(task.node.parent.node, node, task.index);
						this.createChild(task.node);
					}
				}
				break;
			case NodeState.Remove:
				if (task.node.parent) {
					Context.render.remove(task.node.parent.node, task.node.node);
				}
				break;
			case NodeState.Prop:
				if (task.prop) {
					Context.render.prop(task.node.node, task.prop);
				}
				break;
			case NodeState.Move:
				if (task.node.parent && typeof(task.index) !== "undefined") {
					Context.render.move(task.node.parent.node, task.node.node, task.index);
				}
				break;
		}
	}
	private createChild(node: VNode) {
		if (!node.children) {
			return;
		}
		node.children.forEach((it, idx) => {
			it.setParent(node);
			this.add({
				type: NodeState.Insert,
				node: it,
				index: idx
			});
		});
	}
}