import { VNode } from '@src/vdom/vnode';
import { diff } from '@src/vdom/diff';
import * as utils from '@src/utils';
import Context from '@src/context';

export default abstract class Component<P, T> {
	private state: T;
	private props: P;
	private node?: VNode;
	constructor(props: P) {
		const children: any = Reflect.getPrototypeOf(this).constructor;
		if (children.hasOwnProperty("defaultProps")) {
			Object.keys(children.defaultProps).forEach(it => {
				if (!props.hasOwnProperty(it)) {
					props[it] = children.defaultProps[it];
				}
			});
		}
		this.props = props;
	}
	public update() {
		const newNode = this.render();
		this.patch(newNode);
		this.node = newNode;
	}
	public patch(newNode: VNode) {
		const d = diff(this.node, newNode);
		console.log(d);
		Context.updateQueue.add(d);
	}
	public setState(newState: T) {
		this.state = newState;
	}
	public createElement = utils.createElement;
	public abstract render(): VNode;
}