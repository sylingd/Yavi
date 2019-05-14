import { VNode } from './vdom/vnode';
import { diff } from './vdom/diff';
import * as utils from '@src/utils';
import * as browser from './vdom/render/browser';

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
		this.update();
	}
	public update() {
		const newNode = this.render();
		this.patch(newNode);
		this.node = newNode;
	}
	public patch(newNode: VNode) {
		const d = diff(this.node, newNode);
		console.log(d);
		browser.patch(d);
	}
	public setState(newState: T) {
		this.state = newState;
	}
	public createElement = utils.createElement;
	public abstract render(): VNode;
}