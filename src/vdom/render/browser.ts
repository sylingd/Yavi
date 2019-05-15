import { VNode } from '@src/vdom/vnode';
import { IChangedProp } from '@src/vdom/diff';
import IRender from './inteface';

export default class Browser implements IRender<Node> {
	public create(node: VNode): Node {
		const tag = node.type;
		if (tag) {
			const result = document.createElement(tag);
			node.node = result;
			if (node.props && Object.keys(node.props).length > 0) {
				Object.keys(node.props).forEach(it => result.setAttribute(it, node.props[it]));
			}
			node.node = result;
			return result;
		} else {
			const result = document.createTextNode(node.text || "");
			node.node = result;
			return result;
		}
	}
	public replace(parent: Node, oldNode: any, newNode: any) {
		return parent.replaceChild(newNode, oldNode);
	}
	public insert(parent: Node, node: Node, index?: number) {
		if (typeof(index) !== "undefined" && parent.childNodes.length > index) {
			parent.insertBefore(node, parent.childNodes[index]);
		} else {
			parent.appendChild(node);
		}
	}
	public remove(parent: Node, node: Node) {
		parent.removeChild(node);
	}
	public prop(node: Node, props: IChangedProp[]) {
		const el = node as Element;
		props.forEach(prop => {
			if (prop.value) {
				el.setAttribute(prop.name, prop.value);
			} else {
				el.removeAttribute(prop.name);
			}
		});
	}
	public move(parent: Node, node: Node, index: number) {
		if (parent.childNodes.length > index) {
			parent.insertBefore(node, parent.childNodes[index]);
		} else {
			parent.appendChild(node);
		}
	}
}
