from flask import Flask#, render_template, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import eventlet
from game import Game


app = Flask(__name__)
#app.config['SECRET_KEY'] = 'your_secret_key' 
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="*")
CORS(app)

game = Game()

"""@app.route('/')
def index():
    return render_template('index.html')"""

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('get_word')
def start_game():
    data = game.run()
    print(data)
    emit('word_data', {'data': data})
    

if __name__ == '__main__':
    socketio.run(app, debug=True)
    
