import { VNode } from './vdom/vnode';
import * as utils from './utils';
import Component from './component';

interface IOptions {
	el: Element;
	render: () => VNode
}

export default class RootComponent extends Component<{}, {}> {
	private static render: () => VNode;
	private static root: VNode;
	private static createRoot(el: Element) {
		const root = utils.createElement(el.tagName.toLowerCase(), undefined);
		root.node = el;
		return root;
	}
	constructor(options: IOptions) {
		RootComponent.root = RootComponent.createRoot(options.el);
		RootComponent.render = options.render;
		super({});
	}
	public render(): VNode {
		const res: VNode = RootComponent.render.apply(this);
		res.parent = RootComponent.root;
		return res;
	}
}