class DBConnection {
	constructor() { }

	async innit() {
		try {
			console.log('Init DB connection...');
			this._conn = await this._getDB();
			console.log('Connection successful!');
		} catch (err) {
			throw err;
		}
	}

	async _getDB() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:3000/js/placesDB.json', true);
		xhr.send();
		return new Promise((resolve, reject) => {
			xhr.onload = function () {
				if (xhr.readyState == 4 && xhr.status == 200) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(`There was an error making the request!\n${xhr.responseText}`);
				}
			};

			xhr.onerror = function () {
				reject(`There was an error making the request!\n${xhr.responseText}`);
			};
		});
	}

	getCountries() {
		let countries = [];
		for (let obj of this._conn) {
			countries.push(obj.name);
		}
		return countries;
	}

	getStates(id) {
		return this._conn[id].states ? Object.keys(this._conn[id].states) : null;
	}

	getCities(id, state) {
		return this._conn[id].states ? this._conn[id].states[state] : null;
	}
};

export { DBConnection };