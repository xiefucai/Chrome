import { bus } from '../lib/bus';
const appId = 'ooooooooooooooooxxxxxxxxxxxxx';
const saveKey = appId + '-article';
const defaultRule = {
	title: '',
	content: '',
	ignoreElems: null,
	imgToBase64: false,
	script: null
};

const clientStore = new (class Store {
	data = {
		id: appId,
		nav: '',
		rule: { ...defaultRule },
		floatlayer: { visible: false },
		blockAdv: 0,
		pick: {
			elem: '',
			replaceOld: true,
			//selector: '',
			data: {}
		},
		mdbookUrl: {
			development: 'http://localhost:3333/category/*/article/*',
			production: 'https://gitee.xiefucai.com/category/*/article/*'
		}[process.env.NODE_ENV],
		svgUrl: {
			development: 'http://localhost:3333/svg',
			production: 'https://gitee.xiefucai.com/svg'
		}[process.env.NODE_ENV],
		ruleUrl: {
			development: 'http://localhost:3333/rules',
			production: 'https://gitee.xiefucai.com/rules'
		}[process.env.NODE_ENV]
	};

	getId = () => {
		return this.data.id;
	};

	getRule = key => {
		if (key) {
			return this.rule[key];
		}
		return this.data.rule;
	};

	saveConfig = (data, key) => {
		if (key === 'article') {
			this.data.rule = data;
		} else if (key === 'blockAdv') {
			this.data.blockAdv = data;
		} else {
			this.data.floatlayer = data;
		}

		if (key === 'disableSelectors') {
			if (data) {
				localStorage.setItem(`${appId}-${key}`, data);
				this.data.advCss = data;
			} else {
				localStorage.removeItem(`${appId}-${key}`);
				this.data.advCss = undefined;
			}
			return;
		}
		localStorage.setItem(`${appId}-${key}`, JSON.stringify(data));
	};

	getConfig = key => {
		return localStorage.getItem(`${appId}-${key}`);
	};

	getJsonConfig = key => {
		const str = this.getConfig(key);
		return str ? JSON.parse(str) : null;
	};

	resetRule = () => {
		let stored = {};
		if (localStorage.getItem(saveKey)) {
			stored = JSON.parse(localStorage.getItem(saveKey));
		}

		// if (!stored.title && !stored.content) {
		// 	bus.on('ready', data => {
		// 		clientStore.saveConfig(
		// 			{
		// 				...defaultRule,
		// 				...data
		// 			},
		// 			'article'
		// 		);
		// 	});
		// 	bus.openFrame(this.data.ruleUrl + '?' + location.host)
		// 		.then(() => { })
		// 		.catch(err => { });
		// 	return;
		// }
		clientStore.saveConfig(
			{
				...defaultRule,
				...stored
			},
			'article'
		);
	};

	resetFloatLayer = () => {
		const mykey = appId + '-floatlayer';
		if (localStorage.getItem(mykey)) {
			clientStore.saveConfig(
				JSON.parse(localStorage.getItem(mykey)),
				'floatlayer'
			);
		} else {
			clientStore.saveConfig({ visible: false }, 'floatlayer');
		}
	};

	resetBlockAdv = () => {
		const mykey = appId + '-blockAdv';
		if (localStorage.getItem(mykey)) {
			clientStore.saveConfig(
				Number(localStorage.getItem(mykey)),
				'blockAdv'
			);
		} else {
			clientStore.saveConfig(0, 'blockAdv');
		}
		const advkey = appId + '-disableSelectors';
		if (localStorage.getItem(advkey)) {
			clientStore.data.advCss = localStorage.getItem(advkey);
		}
	};

	setNav = nav => {
		this.data.nav = nav;
	};

	setPickList = elems => {
		this.data.pick.list = elems;
	};

	pick = selector => {
		if (this.data.pick.elem === 'ignoreElems') {
			const oldVals = (this.data.rule[this.data.pick.elem] || '').split(',').filter(Boolean);
			oldVals.push(selector);
			this.data.rule[this.data.pick.elem] = oldVals.join(',');
		} else {
			this.data.rule[this.data.pick.elem] = selector;
		}

	};
})();

clientStore.resetRule();
clientStore.resetFloatLayer();
clientStore.resetBlockAdv();

export default clientStore;
