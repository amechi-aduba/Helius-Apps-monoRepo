// supabase/functions/helius-chatbot-strict-prompt/index.js
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// SmartParser utility (identical to the previous version)
const SmartParser = {
    parseName: (name)=>{
        if (!name || !name.trim()) {
          return "Unknown";
        }
        name = name.trim().replace(/[^\w\s\-\']/g, '');
        return name.split(' ').map((part)=>part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
      },
      parseEmail: (email)=>{
        if (!email) return "";
        email = email.trim().toLowerCase();
        if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
          email = email.replace(/\s/g, '');
          if (email.includes('@gmail') && !email.endsWith('@gmail.com')) {
            email = email.replace('@gmail', '@gmail.com');
          }
          if (email.includes('@yahoo') && !email.endsWith('@yahoo.com')) {
            email = email.replace('@yahoo', '@yahoo.com');
          }
           if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
             return email;
           }
        }
        return email;
      },
      parseDate: (dateStr)=>{
        if (!dateStr) return "";
        dateStr = dateStr.trim();
        if (!dateStr) {
          return "";
        }
        if (/^\d{4}$/.test(dateStr)) {
          return `05/${dateStr}`;
        }
        if (/^\d{2}$/.test(dateStr)) {
          const year = parseInt(dateStr);
          const prefix = (year >= 0 && year <= (new Date().getFullYear() % 100 + 5)) ? '20' : '19';
          return `05/${prefix}${dateStr.padStart(2, '0')}`;
        }
        const match = dateStr.match(/(\d{1,2})[\/\-\. ](\d{2,4})/);
        if (match) {
          let month = match[1].padStart(2, '0');
          let year = match[2];
          if (year.length === 2) {
             const numericYear = parseInt(year);
             const prefix = (numericYear >= 0 && numericYear <= (new Date().getFullYear() % 100 + 5)) ? '20' : '19';
             year = `${prefix}${year.padStart(2, '0')}`;
          }
          if (parseInt(month) >= 1 && parseInt(month) <= 12) {
            return `${month}/${year}`;
          } else {
            return `05/${year}`;
          }
        }
        const yearMatch = dateStr.match(/(?:19|20)\d{2}/);
        if (yearMatch && yearMatch[0]) {
          return `05/${yearMatch[0]}`;
        }
        return "";
      },
      parseYear: (dateStr)=>{
         if (!dateStr) return "";
         dateStr = dateStr.trim();
        if (/^\d{4}$/.test(dateStr)) {
          return dateStr;
        }
        let match = dateStr.match(/.*[/\-\. ](\d{4})$/);
        if (match && match[1]) {
          return match[1];
        }
        match = dateStr.match(/(\d{4})$/);
        if (match && match[1]) {
            return match[1];
        }
        match = dateStr.match(/(\d{2})$/);
        if (match && match[1]) {
           const year = parseInt(match[1]);
           const prefix = (year >= 0 && year <= (new Date().getFullYear() % 100 + 5)) ? '20' : '19';
           return `${prefix}${match[1]}`;
        }
        return "";
      },
       parseList: (itemsStr)=>{
        if (!itemsStr || !itemsStr.trim()) {
          return "";
        }
        const items = itemsStr.split(/[,;]/);
        const cleanedItems = items
          .map(item => item.trim())
          .filter(item => item)
          .map(item =>
            item.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
          );
        return cleanedItems.join(', ');
      },
      parseYesNo: (response)=>{
        if (!response) return "No";
        response = response.trim().toLowerCase();
        if (response.startsWith('y')) {
          return "Yes";
        } else if (response.startsWith('n')) {
          return "No";
        }
        return "No";
      },
      parseState: (state)=>{
         if (!state) return "";
         state = state.trim().toUpperCase();
        const usStates = {
            AL: 'AL', AK: 'AK', AZ: 'AZ', AR: 'AR', CA: 'CA', CO: 'CO', CT: 'CT', DE: 'DE', FL: 'FL', GA: 'GA',
            HI: 'HI', ID: 'ID', IL: 'IL', IN: 'IN', IA: 'IA', KS: 'KS', KY: 'KY', LA: 'LA', ME: 'ME', MD: 'MD',
            MA: 'MA', MI: 'MI', MN: 'MN', MS: 'MS', MO: 'MO', MT: 'MT', NE: 'NE', NV: 'NV', NH: 'NH', NJ: 'NJ',
            NM: 'NM', NY: 'NY', NC: 'NC', ND: 'ND', OH: 'OH', OK: 'OK', OR: 'OR', PA: 'PA', RI: 'RI', SC: 'SC',
            SD: 'SD', TN: 'TN', TX: 'TX', UT: 'UT', VT: 'VT', VA: 'VA', WA: 'WA', WV: 'WV', WI: 'WI', WY: 'WY'
        };
        const fullStateNames = {
            'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA',
            'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA',
            'HAWAII': 'HI', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA', 'KANSAS': 'KS',
            'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA',
            'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO', 'MONTANA': 'MT',
            'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM',
            'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH', 'OKLAHOMA': 'OK',
            'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC', 'SOUTH DAKOTA': 'SD',
            'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA',
            'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY'
        };
        if (usStates[state]) {
          return state;
        }
        if (fullStateNames[state]) {
          return fullStateNames[state];
        }
        return state;
      },
      parseNumeric: (input) => {
        if (!input) return "0";
        const cleaned = input.replace(/\D/g, '');
        return cleaned || "0";
      }
};

// Chatbot states (identical to previous version)
const CHATBOT_STATES = {
  NEW: 'new',
  NAME_ASKED: 'name_asked',
  EMAIL_ASKED: 'email_asked',
  PROFESSION_TYPE_ASKED: 'profession_type_asked',
  // Licensed Nurse path
  EXAM_PASSED_ASKED: 'exam_passed_asked',
  EXPERIENCE_YEARS_ASKED: 'experience_years_asked',
  CURRENT_DEPARTMENT_ASKED: 'current_department_asked',
  INTERESTED_DEPARTMENTS_NURSE_ASKED: 'interested_departments_nurse_asked',
  // Student path
  SCHOOL_NAME_ASKED: 'school_name_asked',
  INTERESTED_SPECIALTIES_STUDENT_ASKED: 'interested_specialties_student_asked',
  GRADUATION_YEAR_ASKED: 'graduation_year_asked',
  MAJOR_ASKED: 'major_asked',
  EXTRACURRICULARS_ASKED: 'extracurriculars_asked',
  // Common questions
  AWARDS_ASKED: 'awards_asked',
  STATE_ASKED: 'state_asked',
  RELOCATE_ASKED: 'relocate_asked',
  AVAILABILITY_ASKED: 'availability_asked',
  COMPLETED: 'completed'
};

// processChatbotInteraction (identical to previous version)
function processChatbotInteraction(userInfo, prevText, currText) {
  const { currentState = CHATBOT_STATES.NEW, userProfile = {} } = userInfo;
  const nextState = getNextState(currentState, currText, userProfile);
  // *** Use the strictly literal getNextPrompt function ***
  const nextPrompt = getNextPromptStrict(nextState, userProfile);
  const isValidForStorage = validateUserResponse(currentState, currText, userProfile);

  return {
    resText: nextPrompt,
    textValid: isValidForStorage,
    storeUserInfo: isValidForStorage,
    nextState: nextState,
    userProfile: userProfile
  };
}

// *** Modified getNextPromptStrict function ***
// Returns the exact prompts from the Python script.
function getNextPromptStrict(state, userProfile) { // Renamed for clarity
  switch(state){
    case CHATBOT_STATES.NEW:
      // Combines the initial print and the first input prompt
      return "Hi! My name is Helius🙂, and I'm excited to show you nursing specialties that fit your unique personality!\nFirst let me ask a couple of questions to get to know you.\n\nOk, what is your full name?";
    case CHATBOT_STATES.NAME_ASKED:
      return "And what is your email address?";
    case CHATBOT_STATES.EMAIL_ASKED:
       // Combines the print and the input prompt structure from python
       // The actual choice handling (1 or 2) is done in getNextState
      return "Now let's get to know you. Are you a Licensed Nurse or still a Student?\n\n(You can reply with 'Licensed Nurse' or 'Student')"; // Clarified input expectation
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
      // Prompt depends on the *next* question based on profession chosen
      if (userProfile.profession === 'Licensed Nurse') {
        return "When did you pass the NCLEX exam? (e.g., MM/YYYY):";
      } else { // Assuming Student
        return "What is the name of your school?";
      }
     // Licensed Nurse Path
    case CHATBOT_STATES.EXAM_PASSED_ASKED:
       return "How many years of nursing experience do you have?";
    case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
       return "Which department are you working in right now?"; // Python just asked this, no confirmation
    case CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED:
        // Combines the print("Cool...") and the input prompt
        return "Cool, we are almost done🙂\n\nWhich Nursing departments are you interested in working in? Please list all that apply, separated by commas:";
    // Student Path
    case CHATBOT_STATES.SCHOOL_NAME_ASKED:
        return "Which Nursing specialties are you interested in working in? Please list all that apply, separated by commas:";
    case CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED:
        return "When do you expect to graduate? (e.g., YYYY):"; // Original python example used YYYY
    case CHATBOT_STATES.GRADUATION_YEAR_ASKED:
        return "What is your major?";
    case CHATBOT_STATES.MAJOR_ASKED:
        // Combines the print("Cool...") and the input prompt
        return "Cool, we are almost done🙂\n\nIf you were part of any extra-curricular groups, clubs, or activities? Please list all that apply! Separated by commas:";
    // Common Path
    case CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED:
    case CHATBOT_STATES.EXTRACURRICULARS_ASKED:
       return "Have you ever received any academic or professional awards? Please list all that apply! Separated by commas:"; // Python script directly asked this after respective paths
    case CHATBOT_STATES.AWARDS_ASKED:
       return "Ok, which state do you live in?"; // Python script used "Ok," here
    case CHATBOT_STATES.STATE_ASKED:
       return "Are you willing to relocate for a new role or specialty? (Yes/No):";
    case CHATBOT_STATES.RELOCATE_ASKED:
        // Combines the print statements and the input prompt format
       return "If offered a new career opportunity, how soon can you start?\n1. Immediately\n2. In less than 3 weeks\n3. In more than 3 weeks\n\nEnter your choice (1-3):";
    case CHATBOT_STATES.AVAILABILITY_ASKED:
       // The final message before completion (from python script)
       return "Perfect, Click here: [helis.click/xxx] to complete our 15-minute personality profile. Once you're done, we'll text you the 🩺 Nursing specialties that fit your unique personality.";
    case CHATBOT_STATES.COMPLETED:
       // No further prompts expected in the original script's flow after the final message
       return "Thank you for providing your information!"; // A simple closing remark
    default:
      console.error("Reached default case in getNextPromptStrict. Current state:", state);
      return "I'm sorry, there seems to be an issue. Let's try starting over. What is your full name?";
  }
}

// getNextState function (identical to previous version)
function getNextState(currentState, userResponse, userProfile) {
    switch(currentState){
      case CHATBOT_STATES.NEW:
        userProfile.name = SmartParser.parseName(userResponse);
        return CHATBOT_STATES.NAME_ASKED;
      case CHATBOT_STATES.NAME_ASKED:
        userProfile.email = SmartParser.parseEmail(userResponse);
        return CHATBOT_STATES.EMAIL_ASKED;
      case CHATBOT_STATES.EMAIL_ASKED:
        const professionLower = userResponse.trim().toLowerCase();
        if (professionLower.includes("licen") || professionLower.includes("nurse") || professionLower === '1') { // Allow '1' based on python prompt structure
           userProfile.profession = "Licensed Nurse";
        } else {
           userProfile.profession = "Student";
        }
        return CHATBOT_STATES.PROFESSION_TYPE_ASKED;

      case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
        if (userProfile.profession === 'Licensed Nurse') {
          userProfile.exampass = SmartParser.parseDate(userResponse);
          return CHATBOT_STATES.EXAM_PASSED_ASKED;
        } else {
          userProfile.school = SmartParser.parseName(userResponse);
          return CHATBOT_STATES.SCHOOL_NAME_ASKED;
        }

      // Licensed Nurse Path
      case CHATBOT_STATES.EXAM_PASSED_ASKED:
        userProfile.expyear = SmartParser.parseNumeric(userResponse);
        return CHATBOT_STATES.EXPERIENCE_YEARS_ASKED;
      case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
        userProfile.dept = SmartParser.parseList(userResponse);
        return CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED;
      case CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED:
        userProfile.intdept = SmartParser.parseList(userResponse);
        return CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED;

      // Student Path
      case CHATBOT_STATES.SCHOOL_NAME_ASKED:
        userProfile.intdept = SmartParser.parseList(userResponse);
        return CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED;
      case CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED:
        userProfile.gradyear = SmartParser.parseYear(userResponse);
        return CHATBOT_STATES.GRADUATION_YEAR_ASKED;
      case CHATBOT_STATES.GRADUATION_YEAR_ASKED:
        userProfile.major = SmartParser.parseName(userResponse);
        return CHATBOT_STATES.MAJOR_ASKED;
      case CHATBOT_STATES.MAJOR_ASKED:
        userProfile.extracurr = SmartParser.parseList(userResponse);
        if (userProfile.extracurr.trim().toLowerCase() === 'none') userProfile.extracurr = "None";
        return CHATBOT_STATES.EXTRACURRICULARS_ASKED;

      // Common Path
      case CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED:
      case CHATBOT_STATES.EXTRACURRICULARS_ASKED:
        userProfile.awards = SmartParser.parseList(userResponse);
        if (userProfile.awards.trim().toLowerCase() === 'none') userProfile.awards = "None";
        return CHATBOT_STATES.AWARDS_ASKED;
      case CHATBOT_STATES.AWARDS_ASKED:
        userProfile.state = SmartParser.parseState(userResponse);
        return CHATBOT_STATES.STATE_ASKED;
      case CHATBOT_STATES.STATE_ASKED:
        userProfile.relocate = SmartParser.parseYesNo(userResponse);
        return CHATBOT_STATES.RELOCATE_ASKED;
      case CHATBOT_STATES.RELOCATE_ASKED:
        const options = [
          "Immediately",
          "In less than 3 weeks",
          "In more than 3 weeks"
        ];
        const choice = parseInt(userResponse.trim());
        userProfile.availability = (choice >= 1 && choice <= 3) ? options[choice - 1] : "In more than 3 weeks";
        return CHATBOT_STATES.AVAILABILITY_ASKED;
      case CHATBOT_STATES.AVAILABILITY_ASKED:
        return CHATBOT_STATES.COMPLETED;

      case CHATBOT_STATES.COMPLETED:
         return CHATBOT_STATES.COMPLETED;

      default:
         console.error("Reached default case in getNextState. Current state:", currentState);
         userProfile.name = SmartParser.parseName(userResponse);
         return CHATBOT_STATES.NAME_ASKED;
    }
  }

// validateUserResponse function (identical to previous version)
function validateUserResponse(currentState, userResponse, userProfile) {
    if (!userResponse || userResponse.trim() === '') {
        if (currentState === CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED ||
            currentState === CHATBOT_STATES.EXTRACURRICULARS_ASKED ||
            currentState === CHATBOT_STATES.MAJOR_ASKED || // Input for Extracurriculars can be empty/None
            currentState === CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED) { // Input for Awards can be empty/None
           return true;
       }
      return false;
    }

    switch(currentState){
      case CHATBOT_STATES.NAME_ASKED:
        return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(userProfile.email || "");
      case CHATBOT_STATES.AWARDS_ASKED:
         return /^[A-Z]{2}$/.test(userProfile.state || ""); // Check if parsed state is valid abbr
      case CHATBOT_STATES.RELOCATE_ASKED:
        const choice = userResponse.trim();
        return choice === '1' || choice === '2' || choice === '3';
     case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
        if (userProfile.profession === 'Licensed Nurse') {
             return (userProfile.exampass || "").includes('/'); // Very basic check for date format
        } else {
            return (userProfile.school || "") !== "Unknown";
        }
     case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
        return (userProfile.dept || "") !== "";
     case CHATBOT_STATES.SCHOOL_NAME_ASKED:
        return (userProfile.intdept || "") !== "";
     case CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED:
        return /^\d{4}$/.test(userProfile.gradyear || "");
     // Add more specific validations if needed for other fields

      default:
        return true; // Default to valid if non-empty for most text fields
    }
  }

// The main edge function handler (identical to previous version, but calls the strict prompt function)
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 405 });
    }
    const { userInfo = { currentState: CHATBOT_STATES.NEW, userProfile: {} }, prevText = "", currText } = await req.json();
    if (userInfo.currentState !== CHATBOT_STATES.NEW && !currText) {
      return new Response(JSON.stringify({ error: 'Missing current text parameter (currText)' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 });
    }

    // *** Use the main process function which now calls getNextPromptStrict ***
    const result = processChatbotInteraction(userInfo, prevText, currText || "");

    return new Response(JSON.stringify({
      resText: result.resText,
      textValid: result.textValid,
      storeUserInfo: result.storeUserInfo,
      nextState: result.nextState,
      userProfile: result.userProfile
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 200 });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 });
  }
});

// Log statement for local testing (optional)
// console.log(`Helius Chatbot (Strict Prompt) function listening...`);
