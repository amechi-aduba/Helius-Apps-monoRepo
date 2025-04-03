import pandas as pd
import re
from datetime import datetime
from fuzzywuzzy import fuzz, process

class ChatbotResponseCleaner:
    def __init__(self):
        self.current_year = datetime.now().year
        self.common_phrases = {
            'asap': 'as soon as possible',
            'yep': 'yes',
            'nope': 'no',
            'n/a': 'No Response'
        }

    def clean_dates(self, text):
        # Replace relative dates with actual dates
        text = re.sub(r'last year', str(self.current_year - 1), text, flags=re.IGNORECASE)
        text = re.sub(r'this year', str(self.current_year), text, flags=re.IGNORECASE)
        text = re.sub(r'next year', str(self.current_year + 1), text, flags=re.IGNORECASE)
        text = re.sub(r'(?i)today', datetime.now().strftime('%Y-%m-%d'), text)
        text = re.sub(r'(?i)yesterday', (datetime.now() - pd.Timedelta(days=1)).strftime('%Y-%m-%d'), text)
        return text

    def fuzzy_clean(self, text):
        # Use fuzzy matching to clean known phrases
        for word in text.split():
            best_match, score = process.extractOne(word, self.common_phrases.keys())
            if score > 80:  # If similarity score is high enough
                text = text.replace(word, self.common_phrases[best_match])
        return text

    def clean_text(self, text):
        # Normalize abbreviations and shorthand
        text = self.fuzzy_clean(text)
        text = text.strip()
         # Capitalize the first letter of each response
        text = text.capitalize()
        return text

    def clean(self, text):
        # Clean the text by applying both date and text normalization
        cleaned_text = self.clean_text(text)
        cleaned_text = self.clean_dates(cleaned_text)
        return cleaned_text

# Example usage
# cleaner = ChatbotResponseCleaner()
# cleaned_text = cleaner.clean("I'll do it asap tomorrow.")
# print(cleaned_text)