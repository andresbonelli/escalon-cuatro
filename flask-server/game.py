import requests
from pyrae import dle
import json
import re
from bs4 import BeautifulSoup

def separate_sentences(text: str) -> object:
    sentences = re.findall(r'\d+\.\s*[fm]\.\s*(.*?)(?=\s*\d+\.\s*[fm]\.|$)', text)
    return sentences

def extract_first_sentence(text: str, word: str) -> str:
    # regex to match the first sentence
    pattern = r'(?:\d+\. [a-z]+\.\s*)?(.*?)(?=\d+\. [a-z]+\.|$)'

    # find all matches of the pattern
    sentences = re.findall(pattern, text, flags=re.IGNORECASE | re.DOTALL)

    # Filter out sentences that could potentially reveal the word
    filtered_sentences = [
        sentence.strip() for sentence in sentences
        if not re.match(r'^Definición RAE de «[^»]+»', sentence)
        and "Entradas que contienen la forma «" not in sentence
        and word not in sentence
    ]

    # Return the first non-empty sentence
    for sentence in filtered_sentences:
        if sentence:
            return sentence.strip()

    return None 

class Game:
    def __init__(self):
        self.data: dict = {
            'word': '',
            'definition': ''
        }

    def run(self):

        word: str = ""

        response = requests.get("https://www.palabrasque.com/palabra-aleatoria.php?Submit=Nueva+palabra")
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract text from <font data="palabra"> in HTML
            font_element = soup.find('font', {'data': 'palabra'}) 
            pattern = re.compile(r'<font data="palabra" size="6" /><b>(.*?)<\/b><\/font>')
            match = pattern.search(response.text)

            if match:
                word = match.group(1)
            else:
                print("Word not found in the HTML.")
        else:
            print(f"Request failed with status code: {response.status_code}")
        
        self.data['word'] = word

        definition = dle.search_by_word(word)

        self.data['definition'] = extract_first_sentence(definition._meta_description, word)
        
        return self.data



