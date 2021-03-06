const { Pool } = require('pg');
class Database {
    constructor(){
        this.pool = new Pool({connectionString:"postgres://eahuades:lUS9GNIv8WITduW1JawMXYFgaIjSWh3Z@arjuna.db.elephantsql.com:5432/eahuades"});
    }

    GetUser(email, callback) {
        this.pool
        .query('SELECT password,username,id, userType, profile_pic_link FROM "users" WHERE email = $1',[email], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    GetUserFromId(id, callback){ //gets all the user information
        this.pool
        .query('SELECT username, email, profile_pic_link from users WHERE id = $1', [id], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    CreateUser(username, password,email, userType, callback) {
        this.pool
        .query(`INSERT INTO Users (username, password, email, userType) VALUES($1, $2, $3, $4)`, [username, password, email, userType], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })

    }

    StoreUserBiometrics(id, standing_reach, height, wingspan, callback){
        this.pool
        .query(`INSERT INTO user_biometrics(user_id,wingspan,height,standing_reach) VALUES($1,$2,$3,$4) ON CONFLICT (user_id) DO UPDATE SET wingspan = $2, height=$3, standing_reach=$4`, [id,wingspan,height,standing_reach], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    GetUserBiometrics(id ,callback){
        this.pool
        .query(`SELECT * from user_biometrics WHERE user_id=$1`, [id], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    updateProfile(id, username, pfp, email, callback) {
        this.pool
        .query('UPDATE users SET username = $2, profile_pic_link = $3, email = $4 WHERE id = $1', [id, username, pfp, email], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    assignLecturerToStudent(studentID, lecturerID, callback) {
        this.pool
        .query('UPDATE users SET supervisor_id = $1 WHERE id = $2', [lecturerID, studentID], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    removeLecturerFromStudent(studentID, callback) {
        this.pool
        .query('UPDATE users SET supervisor_id = null WHERE id = $1', [studentID], (err, res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    getMyStudents(id, callback){
        this.pool
        .query(`SELECT T1.id, T1.username, T1.email, T1.profile_pic_link, COUNT(T2) as "quizzes_taken", CAST( (CAST(SUM(T2.correct_questions) AS float) / CAST(SUM(T2.total_questions) AS FLOAT) * 100) AS float)::numeric(10,2)  as "percentage", SUM(T2.correct_questions) as "Correct", SUM(T2.total_questions) as "Total" 
        FROM users T1 LEFT JOIN quiz_history T2 on T1.id = T2.user_id WHERE T1.supervisor_id= $1 GROUP BY T1.id ORDER BY T1.id `, [id], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    getQuestion(callback) {
        this.pool
        .query(`SELECT question, id FROM "question_bank" ORDER BY random() LIMIT 5`, (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    getQuizHistory(userid, callback) {
        this.pool
        .query(`SELECT id, total_questions, correct_questions, extract(epoch from time_of_quiz) as "time_of_quiz" FROM "quiz_history" WHERE user_id = $1 ORDER BY time_of_quiz DESC`, [userid], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    getAllStudents(callback) {
        this.pool
        .query(`SELECT T1.id, T1.username, T1.email, T1.profile_pic_link, T1.supervisor_id, T2.username as "lecturer_name" FROM users T1 
        LEFT JOIN users T2 on T1.supervisor_id = T2.id WHERE T1.userType = 1 ORDER BY T1.id`, (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    
    postQuizResult(userid,totalQuestions,correctQuestions, callback) {
        this.pool
        .query(`INSERT into quiz_history(user_id,total_questions,correct_questions,time_of_quiz) values($1, $2, $3, current_timestamp);`, [userid,totalQuestions,correctQuestions], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    postArticle(authorId, videolink, title, content, callback) {
        this.pool
        .query(`INSERT into articles(authorId, videolink, title, content) values($1,$2,$3,$4);`, [authorId, videolink, title, content], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    getAllArticles(callback) { //for sidebar
        this.pool
        .query(`SELECT id, title from articles ORDER BY id`, (err, res) => {
            if(err){return callback({'error':err, 'results': null})}
            console.log("OKhere");
            return callback({'error':err, 'results': res.rows})
        })
    }

    getArticle(id, callback) {
        this.pool
        .query(`SELECT * from articles WHERE id = $1`, [id], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    postIP(ip, callback){ //used for the IP checking inside of Marshalling@VR
        this.pool
        .query(`INSERT into ip_list(ip_address, creation_date) values($1, current_timestamp) ON CONFLICT (ip_address) DO UPDATE SET creation_date = current_timestamp`, [ip], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    checkIP(ip, callback){ //used for the IP checking inside of Marshalling@VR.
        this.pool
        .query(`SELECT EXTRACT(EPOCH FROM current_timestamp-creation_date)/60 AS "AgeInMinutes", ip_address from ip_list
        WHERE ip_address = $1`, [ip], (err,res) => {
            if(err){return callback({'error':err,'results':null})}
            return callback({'error':err, 'results': res.rows})
        })
    }

    // resetTables(callback) {
    //     this.pool
    //     .query('DELETE FROM customers; DELETE FROM companies', (err, res) => {
    //         if(err){return callback({'error':err,'results':null})}
    //         return callback({'error':err, 'results': res.rows})
    //     })
    //     /**
    //      * return a promise that resolves when the database is successfully reset, and rejects if there was any error.
    //      */
    // }

    closeDatabaseConnections() {
        /**
         * return a promise that resolves when all connection to the database is successfully closed, and rejects if there was any error.
         */
    }

}

module.exports = Database;
