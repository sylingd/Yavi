import { normalizeChildren } from '@src/utils';
import Component from '@src/component';

export class VNode {
	type: any;
	key?: string;
	node?: any;
	text?: string;
	props?: any;
	children?: VNode[];
	parent?: VNode;
	constructor(type: any,
		props?: any,
		text?: string,
		key?: string,
		children?: VNode[]) {
			this.key = key;
			this.props = props || {};
			if (this.props && this.props.key) {
				this.key = this.props.key;
				delete this.props.key;
			}
			if (typeof(type) === "function" && type.prototype instanceof Component) {
				type = new type(this.props);
			}
			this.type = type;
			this.text = text;
			this.children = children;
			if (this.children) {
				this.children.forEach(it => it.parent = this);
			}
			this.node = undefined;
	}
}

export function render(node: VNode): VNode {
	if (typeof(node.type) === "string" || typeof(node.type) === "undefined") {
		return node;
	}
	let currentNode = node;
	while (true) {
		if (typeof(currentNode.type) === "string" || typeof(currentNode.type) === "undefined") {
			break;
		} else if (isFunctionComponent(node)) {
			currentNode = node.type.apply(node);
		} else if (isClassComponent(node)) {
			currentNode = node.type.render();
		} else {
			throw new Error("Unknow node");
		}
	}
	return currentNode;
}

export function isComponent(node: VNode) {
	return isFunctionComponent(node) || isClassComponent(node);
}

export function isFunctionComponent(node: VNode) {
	return typeof(node.type) === "function";
}

export function isClassComponent(node: VNode) {
	return typeof(node.type) === "object" && node.type instanceof Component;
}

export function createText(text: string) {
	return new VNode(undefined, undefined, text);
}

export function create(type: any, props: any, children?: string | (VNode | string | VNode[])[]) {
	let normalizedChildren: VNode[] = [];
	if (children) {
		if (typeof(children) === "object" && children instanceof Array) {
			normalizedChildren = normalizeChildren(children);
		} else {
			normalizedChildren = [createText(children)];
		}
	}
	return new VNode(type, props, undefined, undefined, normalizedChildren);
}