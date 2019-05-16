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
				type.created();
			}
			this.type = type;
			this.text = text;
			this.children = children;
			if (this.children) {
				this.children.forEach(it => it.setParent(this));
			}
			this.node = undefined;
	}
	public setParent(parent: VNode) {
		this.parent = parent;
		if (this.type instanceof Component) {
			this.type.parent = parent;
		}
	}
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