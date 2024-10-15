from flask import Flask, render_template, jsonify
import random
import json

app = Flask(__name__)

# Fungsi untuk membuat posisi ular dan tangga secara acak
def generate_snakes_and_ladders():
    snakes = {str(random.randint(11, 99)): random.randint(1, 10) for _ in range(5)}
    ladders = {str(random.randint(1, 89)): random.randint(90, 99) for _ in range(5)}
    return snakes, ladders

# Inisialisasi posisi ular dan tangga
snakes, ladders = generate_snakes_and_ladders()

app.static_folder = 'static'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/snake_game')
def snake_game():
    return render_template('snake.html', snakes=json.dumps(snakes), ladders=json.dumps(ladders))

@app.route('/regenerate', methods=['GET'])
def regenerate():
    global snakes, ladders
    snakes, ladders = generate_snakes_and_ladders()
    return jsonify({'snakes': snakes, 'ladders': ladders})

@app.route('/profile')
def profile():
    return render_template('profile.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
