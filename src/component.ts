import { VNode } from '@src/vdom/vnode';
import { diff } from '@src/vdom/diff';
import * as utils from '@src/utils';
import Context from '@src/context';
import Dep from '@src/observer/dep';
import Watcher from './observer/watcher';

export default abstract class Component<P extends object, T extends object> {
	public parent: VNode;
	protected state: T;
	protected props: P;
	protected node?: VNode;
	protected watcher: Watcher;
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
		this.watcher = new Watcher(this.update.bind(this));
	}
	public created() {
		this.state = this.addProxy(this.state);
	}
	private addProxy<E extends object>(data?: E): E {
		const _this = this;
		if (typeof(data) !== "undefined" && typeof(data) !== "object") {
			return data;
		}
		if (typeof(data) === "object") {
			Object.keys(data).forEach(it => {
				if (typeof(data[it]) === "object") {
					this.addProxy(data[it]);
				}
			});
		}
		const dep = new Dep();
		return new Proxy(data || {}, {
			get(target: any, key: string | number | symbol, receiver: any) {
				if (!utils.isArray(target) || typeof(key) !== "number") {
					// Add watcher
					_this.watcher.add(dep);
				}
				return Reflect.get(target, key, receiver);
			},
			set(target: object, key: string | number | symbol, value: any, receiver?: any) {
				if (typeof(value) === "object") {
					value = _this.addProxy(value);
				}
				dep.notify();
				return Reflect.set(target, key, value, receiver);
			}
		});
	}
	public update() {
		this.beforeRender();
		const newNode = this.render();
		newNode.setParent(this.parent);
		this.afterRender();
		this.patch(newNode);
		this.node = newNode;
	}
	public patch(newNode: VNode) {
		Context.updateQueue.add(diff(this.node, newNode));
	}
	public createElement = utils.createElement;
	public beforeRender() {
		this.watcher.start();
	}
	public afterRender() {
		this.watcher.end();
	}
	public abstract render(): VNode;
}