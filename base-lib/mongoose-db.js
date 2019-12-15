const _ = require('lodash'),
	modelSchema = require('../lib/schema/database/persisted-imdb-schema'),
	mongoose = require('mongoose');


module.exports = {

	createConnection(connectionString) {
		let me = this;
		return new Promise((resolve, reject) => {
			try {
				mongoose.connect(connectionString, (err, value) => {
					if (err)
						reject(err)
					const db = mongoose.connection;
					db.on('error', console.error.bind(console, 'connection error:'));
					db.once('open', function callback() {
					});
					resolve(db);
				});
			} catch (e) {
				reject(e);
			}
		});
	}


}
