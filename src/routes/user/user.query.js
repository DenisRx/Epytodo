const db = require('../../config/db');

module.exports = {
	view_all_users: async function () {
		return new Promise(function (resolve, reject) {
			db.query(
				`SELECT id, email, password, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', firstname, name FROM user`,
				function (err, result) {
					if (err || result == undefined) {
						reject(new Error('internal server error'));
					} else {
						resolve(result);
					}
				}
			);
		});
	},

	view_user_tasks: async function (user_id) {
		return new Promise(function (resolve, reject) {
			const statement = `SELECT id, title, description, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%s') 'due_time', user_id, status FROM todo WHERE user_id=${user_id}`;
			db.query(statement, function (err, result) {
				if (err || result == undefined) {
					reject(new Error('internal server error'));
				} else {
					resolve(result);
				}
			});
		});
	},

	view_user_infos: async function (id, email) {
		return new Promise(function (resolve, reject) {
			let statement = '';
			if (id != null) {
				statement = `SELECT id, email, password, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', firstname, name FROM user WHERE id=${id}`;
			} else if (email != null) {
				statement = `SELECT id, email, password, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', firstname, name FROM user WHERE email='${email}'`;
			} else {
				reject(new Error());
			}
			db.query(statement, function (err, result) {
				if (err || result == undefined) {
					reject(new Error('internal server error'));
				} else {
					resolve(result);
				}
			});
		});
	},

	update_user_infos: function (id, data) {
		const statement = `UPDATE user SET email='${data.email}', password='${data.password}', name='${data.name}', firstname='${data.firstname}' WHERE id=${id}`;
		db.query(statement, function (err) {
			if (err) throw err;
		});
	},

	delete_user: async function (id) {
		return new Promise(function (resolve, reject) {
			db.query(`SELECT * FROM user WHERE id=${id}`, function (err, result) {
				if (err) throw err;
				if (result.length === 0) reject(new Error());
			});
			const statement = `DELETE FROM user WHERE id=${id}`;
			db.query(statement, function (err) {
				if (err) throw err;
				resolve();
			});
		});
	},
};
