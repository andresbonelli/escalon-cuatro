from flask import Flask, request, jsonify
from flask_cors import CORS
from game import Game
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

game = Game()

@app.route('/get_word')
def get_word():
    try:
        data = game.run()
        logging.info(f"Returning data: {data}")
        return jsonify(data)
    except Exception as e:
        logging.error(f"Error fetching word: {e}")
        return jsonify({"error": "An error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)

    
    
    
