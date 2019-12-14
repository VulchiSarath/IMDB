const _ = require('lodash'),
	modelSchema = require('../lib/schema/database/persisted-imdb-schema'),
	mongoose = require('mongoose');


module.exports = {

	createConnection(connectionString) {
		let me = this;
		return new Promise((resolve, reject) => {
			try {
				mongoose.connect('mongodb://localhost:27017/imdb', (err, value) => {
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

	// async _createConnection(connectionString) {
	// 	let me = this;
	// 	try {
	// 		return new Promise((resolve, reject) => {
	// 			try {

	// 				mongoose.connect('mongodb://sarath:password@localhost:27017/imdb', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	// 					if (err)
	// 						reject(err)
	// 					const db = mongoose.connection;
	// 					db.on('error', console.error.bind(console, 'connection error:'));
	// 					db.once('open', function callback() {
	// 					});
	// 					let models = me.loadModels();
	// 					resolve(models);
	// 				})
	// 			} catch (e) {
	// 				reject(e);
	// 			}
	// 		})
	// 	} catch (e) {
	// 		throw e;
	// 	}
	// },



}
