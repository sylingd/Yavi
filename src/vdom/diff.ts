import { VNode } from '@src/vdom/vnode';

export const enum NodeState {
	Remove, Insert, Prop, Replace, Move
}

export interface IChangedNode {
	type: NodeState;
	old?: VNode;
	node: VNode;
	index?: number;
	prop?: IChangedProp[];
}

export interface IChangedProp {
	name: string;
	old: any;
	value: any;
}

export function diff(oldNode: VNode | undefined, newNode: VNode | undefined): IChangedNode[] {
	const result: IChangedNode[] = [];
	if (typeof(newNode) === "undefined") {
		if (typeof(oldNode) !== "undefined") {
			result.push({
				type: NodeState.Remove,
				node: oldNode
			});
		}
		return result;
	}
	if (typeof(oldNode) === "undefined") {
		if (typeof(newNode) !== "undefined") {
			result.push({
				type: NodeState.Insert,
				node: newNode
			});
		}
		return result;
	}
	diffVNode(oldNode, newNode, result);
	return result;
}

/**
 * Check diff between two VNode
 * 
 * @param oldNode Old VNode
 * @param newNode New VNode
 */
function diffVNode(oldNode: VNode, newNode: VNode, res: IChangedNode[]) {
	if (newNode === oldNode) {
		return;
	}
	if (typeof(oldNode.type) === "undefined" && typeof(newNode.type) === "undefined") {
		if (oldNode.text !== newNode.text) {
			// Patch text node
			res.push({
				type: NodeState.Replace,
				old: oldNode,
				node: newNode
			});
		}
		return;
	}
	if (isSameType(oldNode, newNode)) {
		// Same node
		newNode.node = oldNode.node;
		// Check props
		const props = diffProps(oldNode.props, newNode.props);
		if (props.length > 0) {
			res.push({
				type: NodeState.Prop,
				node: oldNode,
				prop: props
			});
		}
		// Check children
		diffVNodes(oldNode.children || [], newNode.children || [], res);
	} else {
		// Just replace it
		res.push({
			type: NodeState.Replace,
			old: oldNode,
			node: newNode
		});
	}
}

/**
 * Check diff between two VNode lists
 * 
 * @todo Move node
 * @param oldNodes Old VNode list 
 * @param newNodes New VNode list
 */
function diffVNodes(oldNodes: VNode[], newNodes: VNode[], res: IChangedNode[]) {
	// Get keys
	const oldKeys = oldNodes.map(it => it.key);
	const skipOldNodes: number[] = [];
	newNodes.forEach((it, idx) => {
		// If has key, use key to check it
		if (it.key) {
			const index = oldKeys.indexOf(it.key);
			if (index === -1) {
				// If exists in new but not in old, insert it
				res.push({
					type: NodeState.Insert,
					node: it,
					index: idx
				});
			} else {
				if (index !== idx) {
					// Node has moved
					it.node = oldNodes[index].node;
					res.push({
						type: NodeState.Move,
						node: it,
						index: idx
					});
				}
				diffVNode(oldNodes[index], it, res);
			}
		} else {
			// find same node, check its type
			for (let index = 0; index < oldNodes.length; index++) {
				if (!oldNodes[index].key && !skipOldNodes.includes(index) && isSameType(it, oldNodes[index])) {
					// Node has moved
					it.node = oldNodes[index].node;
					if (index !== idx) {
						res.push({
							type: NodeState.Move,
							node: it,
							index: idx
						});
					}
					diffVNode(oldNodes[index], it, res);
					skipOldNodes.push(index);
					return;
				}
			}
			res.push({
				type: NodeState.Insert,
				node: it,
				index: idx
			});
		}
	});
	oldNodes.forEach((it, idx) => {
		if (!it.key && !skipOldNodes.includes(idx)) {
			res.unshift({
				type: NodeState.Remove,
				node: it
			});
		}
	});
}

function isSameType(node1: VNode, node2: VNode): boolean {
	if (typeof(node1.type) === "object" && typeof(node2.type) === "object") {
		return node1.type.__proto__ === node2.type.__proto__;
	}
	return node1.type === node2.type;
}

/**
 * Check props diff between two VNode
 * 
 * @param oldProps Old props
 * @param newProps New props
 * @return IChangedProp[]
 */
function diffProps(oldProps: any, newProps: any): IChangedProp[] {
	const result: IChangedProp[] = [];
	Object.keys(oldProps).forEach(it => {
		if (!newProps.hasOwnProperty(it)) {
			result.push({
				name: it,
				old: oldProps[it],
				value: undefined
			});
		}
	});
	Object.keys(newProps).forEach(it => {
		if (oldProps.hasOwnProperty(it)) {
			if (newProps[it] !== oldProps[it]) {
				result.push({
					name: it,
					old: oldProps[it],
					value: newProps[it]
				});
			}
		} else {
			result.push({
				name: it,
				old: undefined,
				value: newProps[it]
			});
		}
	});
	return result;
}