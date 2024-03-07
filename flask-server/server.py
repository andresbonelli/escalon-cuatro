from flask import Flask, request, jsonify
from flask_cors import CORS
from game import Game

app = Flask(__name__)
CORS(app)

game = Game()

@app.route('/get_word')
def get_word():
    data = game.run()
    print(data)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
    
    
    
