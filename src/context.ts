import Browser from '@src/vdom/render/browser';
import Scheduler from '@src/scheduler';
import { default as DOMQueue } from '@src/vdom/update';
import { default as WatcherQueue } from '@src/observer/update';

const Context = {
	scheduler: new Scheduler,
	updateQueue: new DOMQueue,
	watcherQueue: new WatcherQueue,
	render: new Browser
};

export default Context;