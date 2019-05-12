import * as VNode from './vdom/vnode';
import * as browser from './vdom/render/browser';
import * as diff from './vdom/diff';

interface IOptions {
	el: Element;
}

export default class {
	private options: IOptions;
	private root: VNode.VNode;
	constructor(options: IOptions) {
		this.options = options;
		this.root = this.createRoot();
	}
	public create(tag: string, props: any, children: VNode.VNode[]) {
		const vnode = VNode.create(tag, props, children);
		return vnode;
	}
	public append(vnode: VNode.VNode) {
		const newRoot = Object.assign({}, this.root);
		if (!newRoot.children) {
			newRoot.children = [];
		}
		vnode.parent = newRoot;
		newRoot.children.push(vnode);
		this.patch(this.root, newRoot);
	}
	public patch(v1: VNode.VNode, v2: VNode.VNode) {
		const d = diff.diff(v1, v2);
		console.log(d);
		browser.patch(d);
	}
	private createRoot(): VNode.VNode {
		const root = VNode.create(this.options.el.tagName.toLowerCase(), undefined);
		root.node = this.options.el;
		return root;
	}
}