import { VNode } from '@src/vdom/vnode';
import * as utils from '@src/utils';
import Component from '@src/component';
import { diff } from '@src/vdom/diff';
import Context from '@src/context';

interface IOptions {
	el: Element;
	render: () => VNode
}

export default class Root {
	private root: VNode;
	private options: IOptions;
	public static Component = Component;
	public static createElement = utils.createElement;
	private createRoot() {
		const root = utils.createElement(this.options.el.tagName.toLowerCase(), undefined);
		root.node = this.options.el;
		root.children = [this.root];
		return root;
	}
	constructor(options: IOptions) {
		this.options = options;
		const it = this.render();
		Context.updateQueue.add(diff(undefined, it));
		this.root = it;
	}
	public render(): VNode {
		const res = this.options.render.apply(this);
		res.setParent(this.createRoot());
		return res;
	}
	public update() {
		const it = this.render();
		Context.updateQueue.add(diff(this.root, it));
		this.root = it;
	}
}