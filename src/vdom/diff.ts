import { VNode } from './vnode';

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

interface IChangedProp {
	name: string;
	value: any;
}

export function diff(oldNode: VNode, newNode: VNode | undefined): IChangedNode[] {
	const result: IChangedNode[] = [];
	diffVNode(oldNode, newNode, result);
	return result;
}

/**
 * Check diff between two VNode
 * 
 * @param oldNode Old VNode
 * @param newNode New VNode
 */
function diffVNode(oldNode: VNode, newNode: VNode | undefined, res: IChangedNode[]) {
	const result: IChangedNode[] = [];
	if (typeof(newNode) === "undefined" || newNode === oldNode) {
		return;
	}
	if (typeof(oldNode.tag) === "undefined" && typeof(newNode.tag) === "undefined") {
		if (oldNode.text === newNode.text) {
			return;
		} else {
			// Patch text node
			result.push({
				type: NodeState.Replace,
				old: oldNode,
				node: newNode
			});
		}
	}
	if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
		// Same node
		newNode.node = oldNode.node;
		// Check props
		const props = diffProps(oldNode.props, newNode.props);
		if (props.length > 0) {
			result.push({
				type: NodeState.Prop,
				node: oldNode,
				prop: props
			});
		}
		// Check children
		diffVNodes(oldNode.children || [], newNode.children || [], res);
	} else {
		// Just replace it
		result.push({
			type: NodeState.Replace,
			old: oldNode,
			node: newNode
		});
	}
	res = res.concat(result);
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
	const newKeys = newNodes.map(it => it.key);
	// If exists in oldKeys but not in newKeys, remove it
	oldKeys.forEach((it, idx) => {
		// Hove not key, remove it
		if (!it) {
			res.push({
				type: NodeState.Remove,
				node: oldNodes[idx]
			});
			return;
		}
		const index = newKeys.indexOf(it);
		if (index === -1) {
			res.push({
				type: NodeState.Remove,
				node: oldNodes[idx]
			});
		} else {
			if (index !== idx) {
				// Node has moved
				res.push({
					type: NodeState.Move,
					node: oldNodes[idx],
					index: index
				});
			}
			diffVNode(oldNodes[idx], newNodes[index], res);
		}
	});
	newNodes.forEach((it, idx) => {
		// Hove not key, render it
		if (!it.key) {
			res.push({
				type: NodeState.Insert,
				node: it,
				index: idx
			});
			return;
		}
		if (!oldKeys.includes(it.key)) {
			res.push({
				type: NodeState.Insert,
				node: it,
				index: idx
			});
		}
	});
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
		if (newProps.hasOwnProperty(it)) {
			result.push({
				name: it,
				value: undefined
			});
		}
	});
	Object.keys(newProps).forEach(it => {
		if (oldProps.hasOwnProperty(it)) {
			if (newProps[it] !== oldProps[it]) {
				result.push({
					name: it,
					value: newProps[it]
				});
			}
		} else {
			result.push({
				name: it,
				value: newProps[it]
			});
		}
	});
	return result;
}