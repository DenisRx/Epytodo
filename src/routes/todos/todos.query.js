const db = require('../../config/db');

module.exports = {
	view_all_todos: async function () {
		return new Promise(function (resolve, reject) {
			const statement = `SELECT id, title, description, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%s') 'due_time', user_id, status FROM todo`;
			db.query(statement, function (err, result) {
				if (err || result == undefined) {
					reject(new Error());
				} else {
					resolve(result);
				}
			});
		});
	},

	view_todo: async function (id) {
		return new Promise(function (resolve, reject) {
			const statement = `SELECT id, title, description, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%s') 'due_time', user_id, status FROM todo WHERE id='${id}'`;
			db.query(statement, function (err, result) {
				if (err || result == undefined) {
					reject(new Error());
				} else if (result.length === 0) {
					reject('Not found');
				} else {
					resolve(result);
				}
			});
		});
	},

	create_todo: async function (data) {
		return new Promise(function (resolve, reject) {
			let status = '';
			if (data.status == undefined) {
				status = 'not started';
			} else {
				status = data.status;
				if (status !== 'not started' && status !== 'todo' && status !== 'in progress' && status !== 'done') {
					reject(new Error());
				}
			}
			const statement = `INSERT INTO todo (title, description, due_time, user_id, status) VALUES ('${data.title}', '${data.description}', '${data.due_time}', ${data.user_id}, '${status}')`;
			db.query(statement, function (insert_err, insert_result) {
				if (insert_err || insert_result == undefined) {
					reject(new Error());
				} else {
					db.query(
						`SELECT id, title, description, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%s') 'due_time', status, user_id FROM todo WHERE id=${insert_result.insertId}`,
						function (select_err, select_result) {
							if (select_err || select_result == undefined) {
								reject(new Error());
							} else {
								resolve(select_result);
							}
						}
					);
				}
			});
		});
	},

	update_toto: async function (id, data) {
		return new Promise(function (resolve, reject) {
			var status = '';
			if (data.status == undefined) {
				status = 'not started';
			} else {
				status = data.status;
				if (status !== 'not started' && status !== 'todo' && status !== 'in progress' && status !== 'done') {
					reject(new Error());
				}
			}
			const statement = `UPDATE todo SET title='${data.title}', description='${data.description}', due_time='${data.due_time}', user_id=${data.user_id}, status='${status}' WHERE id=${id}`;
			db.query(statement, function (update_err, update_result) {
				if (update_err || update_result == undefined) {
					reject(new Error());
				} else {
					db.query(
						`SELECT id, title, description, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') 'created_at', DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%s') 'due_time', status, user_id FROM todo WHERE id=${id}`,
						function (select_err, select_result) {
							if (select_err || select_result == undefined) {
								reject(new Error());
							} else {
								resolve(select_result);
							}
						}
					);
				}
			});
		});
	},

	delete_todo: async function (id) {
		return new Promise(function (resolve, reject) {
			db.query(`SELECT * FROM todo WHERE id=${id}`, function (err, result) {
				if (err) throw err;
				if (result.length === 0) reject(new Error());
			});
			const statement = `DELETE FROM todo WHERE id=${id}`;
			db.query(statement, function (err) {
				if (err) throw err;
				resolve();
			});
		});
	},
};
