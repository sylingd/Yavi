import * as VNode from './vdom/vnode';
import * as browser from './vdom/render/browser';
import * as diff from './vdom/diff';

interface IOptions {
	el: Node | Element;
}

export default class {
	private options: IOptions;
	private render: (vnode: VNode.VNode) => Node;
	constructor(options: IOptions) {
		this.options = options;
		this.render = browser.create;
	}
	public create(tag: string, props: any, children: VNode.VNode[]) {
		const vnode = VNode.create(tag, props, children);
		return vnode;
	}
	public append(vnode: VNode.VNode) {
		const node = this.render(vnode);
		if (node) this.options.el.appendChild(node);
	}
	public patch(v1: VNode.VNode, v2: VNode.VNode) {
		const d = diff.diff(v1, v2);
		console.log(d);
		browser.patch(d);
	}
}