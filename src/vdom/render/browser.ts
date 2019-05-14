import { VNode } from '../vnode';
import { IChangedNode, NodeState } from '../diff';

export function create(vdom: VNode): Element | Node {
	const tag = vdom.tag;
	if (tag) {
		const result = document.createElement(tag);
		vdom.node = result;
		if (vdom.props && Object.keys(vdom.props).length > 0) {
			Object.keys(vdom.props).forEach(it => result.setAttribute(it, vdom.props[it]));
		}
		if (vdom.children && vdom.children.length > 0) {
			vdom.children.forEach(it => result.appendChild(create(it)));
		}
		return result;
	} else {
		const result = document.createTextNode(vdom.text || "");
		vdom.node = result;
		return result;
	}
}

export function patch(changes: IChangedNode[]) {
	changes.forEach(it => {
		switch (it.type) {
			case NodeState.Replace:
				if (it.old && it.old.node && it.old.parent && it.old.parent.node) {
					it.old.parent.node.replaceChild(create(it.node), it.old.node);
				}
				break;
			case NodeState.Insert:
				if (it.node.parent && it.node.parent.node) {
					if (typeof(it.index) !== "undefined" && it.node.parent.node.childNodes.length > it.index) {
						it.node.parent.node.insertBefore(create(it.node), it.node.parent.node.childNodes[it.index]);
					} else {
						it.node.parent.node.appendChild(create(it.node));
					}
				}
				break;
			case NodeState.Remove:
				if (it.node.node && it.node.parent && it.node.parent.node) {
					it.node.parent.node.removeChild(it.node.node);
				}
				break;
			case NodeState.Prop:
				if (it.prop && it.node.node && it.node.node instanceof Element) {
					const el = it.node.node as Element;
					it.prop.forEach(prop => {
						if (prop.value) {
							el.setAttribute(prop.name, prop.value);
						} else {
							el.removeAttribute(prop.name);
						}
					});
				}
				break;
			case NodeState.Move:
				if (it.node.node && it.node.parent && it.node.parent.node && typeof(it.index) !== "undefined") {
					if (it.node.parent.node.childNodes.length > it.index) {
						it.node.parent.node.insertBefore(it.node.node, it.node.parent.node.childNodes[it.index]);
					} else {
						it.node.parent.node.appendChild(it.node.node);
					}
				}
				break;
		}
	})
}