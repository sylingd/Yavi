import { create as createVNode, createText, VNode } from '@src/vdom/vnode';

export function normalizeChildren(children: (VNode | string | VNode[])[]): VNode[] {
	let res: VNode[] = [];
	children.forEach((it: VNode | string | VNode[]) => {
		if (typeof(it) === "string") {
			res.push(createText(it));
		} else if (it instanceof Array) {
			res = res.concat(it);
		} else {
			res.push(it);
		}
	});
	return res;
}

export function createElement(type: any, props?: any, children?: (VNode | string | VNode[])[]) {
	return type ? createVNode(type, props, children) : createText(props);
}

export function isArray(obj: any) {
	return typeof(obj) === "object" && obj instanceof Array;
}