from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/list')
def olymp_list():
    return render_template('olymp-list.html')

@app.route('/olymp')
def olympiada():
	return render_template('olympiada.html')

@app.route('/news')
def news():
	return render_template('news.html')

@app.route('/fnew')
def fnew():
    return render_template('fnew.html')

@app.route('/register')
def reg():
    return render_template('registration.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/library')
def library():
    return render_template('library.html')

@app.route('/teach-reg')
def teach_reg():
    return render_template('teach-reg.html')

@app.route('/teach-log')
def teach_log():
    return render_template('teach-log.html')

@app.route('/fav')
def fav():
    return render_template('favorites.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/do-olymp')
def do_olymp():
    return render_template('do-olymp.html')

if __name__ == '__main__':
    app.run(debug=True)