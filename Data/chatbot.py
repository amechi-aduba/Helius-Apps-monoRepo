def handle_choice(choices):
    while True:
        print("Choose an option:")
        for i, choice in enumerate(choices):
            print(f"{i + 1}. {choice}")

        user_input = input("Enter the number of your choice: ")

        if user_input.isdigit():
            choice_index = int(user_input) - 1
            if 0 <= choice_index < len(choices):
                return choices[choice_index]
            else:
                print("Invalid choice. Please enter a number within the range.")
        else:
            print("Invalid input. Please enter a number.")

def get_valid_input(prompt, valid_options=None, input_type=str):
    while True:
        user_input = input(prompt).strip()
        if not user_input:
            print("Input cannot be empty. Please try again.")
            continue
        if valid_options and user_input not in valid_options:
            print(f"Invalid input. Please choose from: {', '.join(valid_options)}")
            continue
        try:
            return input_type(user_input)
        except ValueError:
            print(f"Invalid input. Please enter a valid {input_type.__name__}.")

def chatbot():
    print("Hi! My name is Helius🙂, and I'm excited to show you nursing specialties that fit your unique personality! First let me ask a couple of questions to get to know you.")
    
    # Get name and email
    name = get_valid_input("Ok, what is your full name? ")
    email = get_valid_input("And what is your email address? ")
    print(f"Nice to meet you {name}! Let's get started.")

    # Check if user is a licensed nurse or a student
    prof = get_valid_input("Now let's get to know you. Are you a licensed Nurse or still a Student? Please type 'Licensed Nurse' or 'Student' and press Enter: ", ["Licensed Nurse", "Student"])
    
    if prof == 'Licensed Nurse':
        print("Great! Let's continue.")
        exampass = get_valid_input("When did you pass the NCLEX exam? (e.g., MM/YYYY): ")
        print(f"Ok, so you passed the NCLEX exam in {exampass}.")
        expyear = get_valid_input("How many years of nursing experience do you have? ", input_type=int)
        print(f"Ok, so you have {expyear} years of nursing experience.")
        dept = get_valid_input("Which department are you working in right now? ")
        print(f"Ok, so you are working in the {dept} department.")
        print("Cool, we are almost done🙂")
        intdept = get_valid_input("Which Nursing departments are you interested in working in? Please list all that apply, separated by commas: ")
        print(f"Ok, so you are interested in working in the {intdept} departments.")
    elif prof == 'Student':
        print("Great! Let's continue.")
        school = get_valid_input("What is the name of your school? ")
        print(f"Ok, so you are attending {school}.")
        intdept = get_valid_input("Which Nursing specialties are you interested in working in? Please list all that apply, separated by commas: ")
        print(f"Ok, so you are interested in working in the {intdept} departments.")
        gradyear = get_valid_input("When do you expect to graduate? (e.g., YYYY): ")
        print(f"Ok, so you expect to graduate in {gradyear}.")
        major = get_valid_input("What is your major? ")
        print(f"Ok, so your major is {major}.")
        print("Cool, we are almost done🙂")
        extracurr = get_valid_input("If you were part of any extra-curricular groups, clubs, or activities? Please list all that apply! Separated by commas: ")
    
    # Common questions for both licensed nurses and students
    print("Thank you for sharing that information with me! ")
    awards = get_valid_input("Have you ever received any academic or professional awards? Please list all that apply! Separated by commas: ")
    print(f"Ok, so you have received the following awards: {awards}.")
    state = get_valid_input("Ok, which state do you live in? ")
    print(f"Ok, so you live in {state}.")
    relocate = get_valid_input("Are you willing to relocate for a new role or specialty? Please type 'Yes' or 'No' and press Enter: ", ["Yes", "No"])
    if relocate == 'Yes':
        print(f"Ok, so you are willing to relocate for a new role or specialty.")
    elif relocate == 'No':
        print("Ok, so you are not willing to relocate.")
    
    # Ask about availability
    print("If offered a new career opportunity, how soon can you start?")
    options = ["Immediately", "In less than 3 weeks", "In more than 3 weeks"]
    selected_option = handle_choice(options)
    print(f"You selected: {selected_option}")

    # Final message
    print("Perfect, Click here: [helis.click/xxx] to complete our 15-minute personality profile. Once you’re done, we’ll text you the 🩺 Nursing specialties that fit your unique personality.")

# Run the chatbot
chatbot()