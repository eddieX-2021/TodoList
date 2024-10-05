from flask import Flask, render_template, url_for,request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__, static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)
#db.init_app(app)

@app.route('/')
def index():
    return (render_template("index.html"))

# @app.route('/add-task', methods=['POST'])
# def add_task():
#     description = request.form.get('description')
#     task = Task(description=description)
#     db.session.add(task)
#     db.session.commit()
#     return jsonify({'status': 'Task added!'})

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)#don't want to be empty
    due_date = db.Column(db.DateTime, default = datetime.utcnow)
    user_id = db.Column(db.Integer, nullable=False)  # If you're adding user authentication

    def __repr__(self):
        return '<Task %r>' % self.id
if __name__ == '__main__':
    app.run(debug=True)
