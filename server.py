from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/olympiads')
def olympiads():
    return render_template('olympiads.html')

@app.route('/news')
def news():
    return render_template('news.html')

@app.route('/library')
def library():
    return render_template('library.html')

@app.route('/favorites')
def favorites():
    return render_template('favorites.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/olympiada/<int:id>')
def olympiada(id):
	return render_template('olympiada.html')

@app.route('/online-olympiad')
def do_olymp():
    return render_template('online-olympiad.html')

@app.route('/news-page')
def fnew():
    return render_template('news-page.html')

@app.route('/register')
def reg():
    return render_template('register.html')

@app.route('/tregister')
def teach_reg():
    return render_template('tregister.html')

@app.route('/tlogin')
def teach_log():
    return render_template('tlogin.html')

@app.route('/test/<int:id>')
def test(id):
    return render_template('test.html')

@app.route('/profile-st')
def student():
    return render_template('profile-st.html')

@app.route('/tprofile')
def teacher():
    return render_template('tprofile.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == '__main__':
    app.run(debug=True)