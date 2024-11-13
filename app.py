from flask import Flask, render_template, url_for,request, jsonify,session,redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash 

app = Flask(__name__, static_folder='static')
#set up the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SECRET_KEY'] ='secret key'
db = SQLAlchemy(app)

#created a modelk
class User(db.Model):
    id = db.Column(db.Integer, primary_key= True)
    name = db.Column(db.String(100),nullable = False)
    username = db.Column(db.String(100),nullable = False,unique = True)
    password = db.Column(db.String(200),nullable = False)
    date_added = db.Column(db.DateTime,default = datetime.utcnow)



class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Ensure this is not NULL
    label = db.Column(db.String(100), nullable=False)  # Ensure this is not NULL
    details = db.Column(db.String(200), nullable=False)  # Ensure this is not NULL
    due_date = db.Column(db.DateTime, default=datetime.utcnow)

# home page
@app.route('/')
def home():
    if 'username' in session:
        return render_template("home.html",username=session['username'])
    else:
        return redirect(url_for('login'))

# login page
@app.route('/login', methods=['GET','POST'])
def login():
    # check post request
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        #get the user
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):  # Verify password
            session['username'] = user.name  # assume this is the user in this session
            return redirect(url_for('home'))  # now he can access home page
        else:
            return render_template("login.html", error="Invalid username or password") # incrrect passord or wrong username give errors 
        
    else:
        return render_template("login.html")


@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        #check if the username is already taken
        exist_user = User.query.filter(User.username == username).first()
        if exist_user:
            return render_template("register.html", error = "Username already exists")
        #if not, then create a new user in the database
        hashed_password = generate_password_hash(password)
        new_user = User(name = name,  username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        #then redirect to login page
        return redirect(url_for('login'))
        
        

    return render_template("register.html")



@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear the session
    return redirect(url_for('login'))




# #page for main page
# @app.route('/main')
# def index():
#     conn = get_db_connection()
#     tasks = conn.execute('SELECT * FROM tasks').fetchall()
#     conn.close()
#     return render_template('index.html', tasks=tasks)


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


if __name__ == '__main__':

    with app.app_context():
        db.drop_all()
        db.create_all()
    app.run(debug=True)
