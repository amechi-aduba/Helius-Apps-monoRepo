import re
from datetime import datetime

class SmartParser:
    @staticmethod
    def parse_name(name):
        """Parse and format a person's name"""
        if not name.strip():
            return "Unknown"
        
        # Remove extra spaces and special characters (except hyphens and apostrophes)
        name = re.sub(r'[^\w\s\-\']', '', name.strip())
        # Capitalize each part
        return ' '.join([part.capitalize() for part in name.split()])

    @staticmethod
    def parse_email(email):
        """Parse and standardize email address"""
        email = email.strip().lower()
        # Basic email validation
        if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email):
            # Try to fix common mistakes
            if ' ' in email:
                email = email.replace(' ', '')
            if '@gmail' in email and not '@gmail.com' in email:
                email = email.replace('@gmail', '@gmail.com')
            if '@yahoo' in email and not '@yahoo.com' in email:
                email = email.replace('@yahoo', '@yahoo.com')
        return email

    @staticmethod
    def parse_date(date_str):
        """Parse various date formats and return as MM/YYYY or empty string if unparseable"""
        date_str = date_str.strip()
        
        # Return empty string if input is empty
        if not date_str:
            return ""
        
        # Try to extract just year if that's what was entered
        if re.match(r'^\d{4}$', date_str):
            return f"05/{date_str}"  # Default to May if only year given
        
        # Try to extract 2-digit year alone
        if re.match(r'^\d{2}$', date_str):
            return f"05/20{date_str.zfill(2)}"  # Default to May and assume 21st century
        
        # Try to extract month and year from various formats
        match = re.match(r'(\d{1,2})[/\-\. ](\d{2,4})', date_str)
        if match:
            month, year = match.groups()
            month = month.zfill(2)
            if len(year) == 2:
                year = f"20{year.zfill(2)}"
            # Validate month is between 01-12
            if 1 <= int(month) <= 12:
                return f"{month}/{year}"
            else:
                # If invalid month but valid year, use default month (May)
                return f"05/{year}"
        
        # Try to find year anywhere in the string
        year_match = re.search(r'(?:19|20)\d{2}', date_str)
        if year_match:
            return f"05/{year_match.group()}"  # Use found year with default month
        
        # If we can't find anything parseable, return empty string
        return ""

    @staticmethod
    def parse_year(date_str):
        """Extract year from various date formats"""
        date_str = date_str.strip()
        
        # If just year entered
        if re.match(r'^\d{4}$', date_str):
            return date_str
        
        # Try to extract year from date
        match = re.match(r'.*(\d{4})$', date_str)
        if match:
            return match.group(1)
        
        # Try to extract 2-digit year
        match = re.match(r'.*(\d{2})$', date_str)
        if match:
            return f"20{match.group(1)}"
        
        # Fallback to current year
        return ""

    @staticmethod
    def parse_list(items_str):
        """Parse comma-separated list and standardize formatting"""
        if not items_str.strip():
            return ""
        
        # Split by commas or other common separators
        items = re.split(r'[,;]', items_str)
        # Clean each item
        cleaned_items = []
        for item in items:
            item = item.strip()
            if item:
                # Capitalize first letter of each word
                item = ' '.join([word.capitalize() for word in item.split()])
                cleaned_items.append(item)
        return ', '.join(cleaned_items)

    @staticmethod
    def parse_yes_no(response):
        """Parse yes/no responses"""
        response = response.strip().lower()
        if response.startswith('y'):
            return "Yes"
        elif response.startswith('n'):
            return "No"
        # Default to "No" for unclear responses
        return "No"

    @staticmethod
    def parse_state(state):
        """Parse and standardize state names/abbreviations"""
        state = state.strip().upper()
        # US state abbreviations mapping
        us_states = {
            'AL': 'AL', 'AK': 'AK', 'AZ': 'AZ', 'AR': 'AR', 'CA': 'CA',
            'CO': 'CO', 'CT': 'CT', 'DE': 'DE', 'FL': 'FL', 'GA': 'GA',
            'HI': 'HI', 'ID': 'ID', 'IL': 'IL', 'IN': 'IN', 'IA': 'IA',
            'KS': 'KS', 'KY': 'KY', 'LA': 'LA', 'ME': 'ME', 'MD': 'MD',
            'MA': 'MA', 'MI': 'MI', 'MN': 'MN', 'MS': 'MS', 'MO': 'MO',
            'MT': 'MT', 'NE': 'NE', 'NV': 'NV', 'NH': 'NH', 'NJ': 'NJ',
            'NM': 'NM', 'NY': 'NY', 'NC': 'NC', 'ND': 'ND', 'OH': 'OH',
            'OK': 'OK', 'OR': 'OR', 'PA': 'PA', 'RI': 'RI', 'SC': 'SC',
            'SD': 'SD', 'TN': 'TN', 'TX': 'TX', 'UT': 'UT', 'VT': 'VT',
            'VA': 'VA', 'WA': 'WA', 'WV': 'WV', 'WI': 'WI', 'WY': 'WY'
        }
        # Check if input is a valid abbreviation
        if state in us_states:
            return state
        # Try to match full state names
        full_state_names = {
            'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
            'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT',
            'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI',
            'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA',
            'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME',
            'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI',
            'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO',
            'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV',
            'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM',
            'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND',
            'OHIO': 'OH', 'OKLAHOMA': 'OK', 'OREGON': 'OR',
            'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
            'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT',
            'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA',
            'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY'
        }
        if state in full_state_names:
            return full_state_names[state]
        # Try to match without case sensitivity
        for full_name, abbr in full_state_names.items():
            if state.upper() == full_name.upper():
                return abbr
        # Return original input if we can't parse
        return state

def chatbot():
    print("Hi! My name is Helius🙂, and I'm excited to show you nursing specialties that fit your unique personality! First let me ask a couple of questions to get to know you.")
    
    # Get name and email
    name = SmartParser.parse_name(input("Ok, what is your full name? "))
    email = SmartParser.parse_email(input("And what is your email address? "))
    print(f"Nice to meet you {name}! Let's get started.")

    # Check if user is a licensed nurse or a student
    prof = input("Now let's get to know you. Are you a licensed Nurse or still a Student? ").strip().capitalize()
    prof = "Licensed Nurse" if "licen" in prof.lower() or "nurse" in prof.lower() else "Student"
    
    if prof == 'Licensed Nurse':
        print("Great! Let's continue.")
        exampass = SmartParser.parse_date(input("When did you pass the NCLEX exam? (e.g., MM/YYYY): "))
        print(f"Ok, so you passed the NCLEX exam in {exampass}.")
        
        # Parse years of experience
        exp_input = input("How many years of nursing experience do you have? ").strip()
        expyear = ''.join(filter(str.isdigit, exp_input)) or "0"
        print(f"Ok, so you have {expyear} years of nursing experience.")
        
        dept = SmartParser.parse_list(input("Which department are you working in right now? "))
        print(f"Ok, so you are working in the {dept} department.")
        print("Cool, we are almost done🙂")
        intdept = SmartParser.parse_list(input("Which Nursing departments are you interested in working in? Please list all that apply, separated by commas: "))
        print(f"Ok, so you are interested in working in the {intdept} departments.")
    elif prof == 'Student':
        print("Great! Let's continue.")
        school = SmartParser.parse_name(input("What is the name of your school? "))
        print(f"Ok, so you are attending {school}.")
        intdept = SmartParser.parse_list(input("Which Nursing specialties are you interested in working in? Please list all that apply, separated by commas: "))
        print(f"Ok, so you are interested in working in the {intdept} departments.")
        gradyear = SmartParser.parse_year(input("When do you expect to graduate? (e.g., YYYY): "))
        print(f"Ok, so you expect to graduate in {gradyear}.")
        major = SmartParser.parse_name(input("What is your major? "))
        print(f"Ok, so your major is {major}.")
        print("Cool, we are almost done🙂")
        extracurr = SmartParser.parse_list(input("If you were part of any extra-curricular groups, clubs, or activities? Please list all that apply! Separated by commas: "))
    
    # Common questions for both licensed nurses and students
    print("Thank you for sharing that information with me! ")
    awards = SmartParser.parse_list(input("Have you ever received any academic or professional awards? Please list all that apply! Separated by commas: "))
    print(f"Ok, so you have received the following awards: {awards}.")
    state = SmartParser.parse_state(input("Ok, which state do you live in? "))
    print(f"Ok, so you live in {state}.")
    relocate = SmartParser.parse_yes_no(input("Are you willing to relocate for a new role or specialty? (Yes/No): "))
    print(f"Ok, so you are {'willing' if relocate == 'Yes' else 'not willing'} to relocate.")
    
    # Ask about availability
    print("If offered a new career opportunity, how soon can you start?")
    options = ["Immediately", "In less than 3 weeks", "In more than 3 weeks"]
    for i, option in enumerate(options, 1):
        print(f"{i}. {option}")
    choice = input("Enter your choice (1-3): ").strip()
    selected_option = options[int(choice)-1] if choice.isdigit() and 1 <= int(choice) <= 3 else "In more than 3 weeks"
    print(f"You selected: {selected_option}")

    # Final message
    print("Perfect, Click here: [helis.click/xxx] to complete our 15-minute personality profile. Once you're done, we'll text you the 🩺 Nursing specialties that fit your unique personality.")

# Run the chatbot
chatbot()
