from flask import Flask, render_template, url_for,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlite3

app = Flask(__name__, static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)
#db.init_app(app)

def create_table():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            label TEXT NOT NULL,
            details TEXT NOT NULL,
            due_date DATE
        )
''')#questiion here how to handle NULL
    conn.commit()
    conn.close()

#connect to the database
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

#login page
@app.route('/')
def login():
    return (render_template("login.html"))

#page for main page
@app.route('/main')
def index():
    conn = get_db_connection()
    tasks = conn.execute('SELECT * FROM tasks').fetchall()
    conn.close()
    return render_template('index.html', tasks=tasks)


@app.route('/add-task', methods=['POST'])
def add_task():
    task_name = request.form['taskName']
    task_label = request.form['taskLabel']
    task_details = request.form['taskDetails']
    task_date = request.form['taskDate']

    conn = get_db_connection()
    conn.execute('INSERT INTO tasks (name, label, details, due_date) VALUES (?, ?, ?, ?)',
                 (task_name, task_label, task_details, task_date))
    conn.commit()
    conn.close
    return jsonify({'message': 'Task added successfully!'})

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)#don't want to be empty
    due_date = db.Column(db.DateTime, default = datetime.utcnow)
    user_id = db.Column(db.Integer, nullable=False)  # If you're adding user authentication

    def __repr__(self):
        return '<Task %r>' % self.id
if __name__ == '__main__':
    create_table()
    app.run(debug=True)
