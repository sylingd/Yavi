import Browser from '@src/vdom/render/browser';
import { IChangedNode } from '@src/vdom/diff';
import Scheduler from '@src/scheduler';
import Update from '@src/vdom/update';

const Context = {
	scheduler: new Scheduler,
	updateQueue: new Update,
	render: new Browser
};

export default Context;