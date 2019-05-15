import { VNode } from "../vnode";
import { IChangedProp } from '../diff';

export default interface IRender<T> {
	create(vnode: VNode): T;
	replace(parent: T, oldNode: T, newNode: T): void;
	insert(parent: T, node: T, index?: number): void;
	remove(parent: T, node: T): void;
	prop(node: T, props: IChangedProp[]): void;
	move(parent: T, node: T, index: number): void;
}