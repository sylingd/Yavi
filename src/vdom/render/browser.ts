import { VNode } from '../vnode';
import { IChangedNode } from '../diff';

export function create(vdom: VNode): Element | Node {
	const tag = vdom.tag;
	if (tag) {
		const result = document.createElement(tag);
		if (vdom.props && Object.keys(vdom.props).length > 0) {
			Object.keys(vdom.props).forEach(it => result.setAttribute(it, vdom.props[it]));
		}
		if (vdom.children && vdom.children.length > 0) {
			vdom.children.forEach(it => result.appendChild(create(it)));
		}
		return result;
	} else {
		return document.createTextNode(vdom.text || "");
	}
	throw new Error("Unknown vdom");
}

export function patch(changes: IChangedNode[]) {
	changes.forEach(it => {
		//
	})
}