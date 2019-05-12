export class VNode {
	tag?: string;
	key?: string;
	node?: Node;
	text?: string;
	props?: any;
	state?: any;
	children?: VNode[];
	constructor(tag?: string,
		props?: any,
		state?: any,
		text?: string,
		key?: string,
		children?: VNode[]) {
			this.tag = tag;
			this.props = props;
			this.state = state;
			this.key = key;
			this.text = text;
			this.children = children;
			this.node = undefined;
	}
}

export function createText(text: string) {
	return new VNode(undefined, undefined, undefined, text);
}

export function create(tag: string, props: any, children?: VNode[]) {
	return new VNode(tag, props, undefined, undefined, undefined, children);
}