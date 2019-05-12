export class VNode {
	tag?: string;
	key?: string;
	node?: Node | Element;
	text?: string;
	props?: any;
	state?: any;
	children?: VNode[];
	parent?: VNode;
	constructor(tag?: string,
		props?: any,
		state?: any,
		text?: string,
		key?: string,
		children?: VNode[]) {
			this.tag = tag;
			this.props = props || {};
			this.state = state;
			this.key = key;
			this.text = text;
			this.children = children;
			if (this.children) {
				this.children.forEach(it => it.parent = this);
			}
			if (this.props && this.props.key) {
				this.key = this.props.key;
				delete this.props.key;
			}
			this.node = undefined;
	}
}

export function createText(text: string) {
	return new VNode(undefined, undefined, undefined, text);
}

export function create(tag: string, props: any, children?: VNode[]) {
	return new VNode(tag, props, undefined, undefined, undefined, children);
}