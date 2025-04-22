import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SmartParser } from './SmartParser.ts';

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

const CHATBOT_STATES = {
  INIT: 'init',
  NEW: 'new',
  EMAIL_ASKED: 'email_asked',
  PROFESSION_TYPE_ASKED: 'profession_type_asked',
  PROFESSION_TYPE_ASKED_NURSE: 'profession_type_asked_nurse',
  PROFESSION_TYPE_ASKED_STUDENT: 'profession_type_asked_student',
  EXAM_PASSED_ASKED: 'exam_passed_asked',
  EXPERIENCE_YEARS_ASKED: 'experience_years_asked',
  CURRENT_DEPARTMENT_ASKED: 'current_department_asked',
  INTERESTED_DEPARTMENTS_NURSE_ASKED: 'interested_departments_nurse_asked',
  SCHOOL_NAME_ASKED: 'school_name_asked',
  INTERESTED_SPECIALTIES_STUDENT_ASKED: 'interested_specialties_student_asked',
  GRADUATION_YEAR_ASKED: 'graduation_year_asked',
  MAJOR_ASKED: 'major_asked',
  EXTRACURRICULARS_ASKED: 'extracurriculars_asked',
  AWARDS_ASKED: 'awards_asked',
  STATE_ASKED: 'state_asked',
  RELOCATE_ASKED: 'relocate_asked',
  AVAILABILITY_ASKED: 'availability_asked',
  COMPLETE_SURVEY: 'complete_survey',
  COMPLETED: 'completed',
  DEFAULT: 'default'  
};

function getFieldName(chatBotState){
  switch (chatBotState) {
    case CHATBOT_STATES.INIT:
      return "full_name";
    case CHATBOT_STATES.NEW:
      return "full_name";
    case CHATBOT_STATES.EMAIL_ASKED:
      return "email";
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
      return "student_nurse_flag";
    case CHATBOT_STATES.EXAM_PASSED_ASKED:
      return "licensed_nurse";
    case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
      return "years_of_experience";
    case CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED:
      return "current_department";
    case CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED:
      return "interested_department";
    case CHATBOT_STATES.SCHOOL_NAME_ASKED:
      return "institution_name";
    case CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED:
      return "interested_specialty";
    case CHATBOT_STATES.GRADUATION_YEAR_ASKED:
      return "graduation_year";
    case CHATBOT_STATES.MAJOR_ASKED:
      return "field_of_study";
    case CHATBOT_STATES.EXTRACURRICULARS_ASKED:
      return "extra_curricular_name";
    case CHATBOT_STATES.AWARDS_ASKED:
      return "educational_achievements";
    case CHATBOT_STATES.STATE_ASKED:
      return "state_of_residency";
    case CHATBOT_STATES.RELOCATE_ASKED:
      return "willing_to_relocate";
    case CHATBOT_STATES.AVAILABILITY_ASKED:
      return "start_availability";
    case CHATBOT_STATES.COMPLETE_SURVEY:
      return "process_stage";
    case CHATBOT_STATES.COMPLETED:
      return "process_stage";
   }
}

function getTableName(chatBotState){
  switch (chatBotState) {
    case CHATBOT_STATES.INIT:
      return "hel_candidate";
    case CHATBOT_STATES.NEW:
      return "hel_candidate";
    case CHATBOT_STATES.EMAIL_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.EXAM_PASSED_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.SCHOOL_NAME_ASKED:
      return "hel_education";
    case CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.GRADUATION_YEAR_ASKED:
      return "hel_education";
    case CHATBOT_STATES.MAJOR_ASKED:
      return "hel_education";
    case CHATBOT_STATES.EXTRACURRICULARS_ASKED:
      return "hel_extra_curricular";
    case CHATBOT_STATES.AWARDS_ASKED:
      return "hel_education";
    case CHATBOT_STATES.STATE_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.RELOCATE_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.AVAILABILITY_ASKED:
      return "hel_candidate";
    case CHATBOT_STATES.COMPLETE_SURVEY:
      return "hel_candidate";
    case CHATBOT_STATES.COMPLETED:
      return "hel_candidate";
   }
}


function processChatbotInteraction(userInfo, prevText, currText, chatBotState) {
  console.log("chatBotState = " + chatBotState);
  const { currentState = chatBotState, userProfile = {} } = userInfo;
  let nextState = getNextState(currentState, currText, userProfile);
  console.log("nextState = " + nextState);
  let nextPrompt = getPromptStrict(nextState, userProfile);
  console.log("nextPrompt = " + nextPrompt);
  const isValidForStorage = validateUserResponse(currentState, currText, userProfile);
  return {
    resText: nextPrompt,
    textValid: isValidForStorage,
    storeUserInfo: isValidForStorage,
    nextState,
    userProfile
  };
}

function getNextState(currentState, userResponse, userProfile) {
  switch (currentState) {
    case CHATBOT_STATES.INIT:
      userProfile.name = SmartParser.parseName(userResponse);
      return CHATBOT_STATES.NEW;
    case CHATBOT_STATES.NEW:
      userProfile.name = SmartParser.parseName(userResponse);
      return CHATBOT_STATES.EMAIL_ASKED;
    case CHATBOT_STATES.EMAIL_ASKED:
      return CHATBOT_STATES.PROFESSION_TYPE_ASKED;
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
      return CHATBOT_STATES.EXAM_PASSED_ASKED;
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED_NURSE:
      return CHATBOT_STATES.EXAM_PASSED_ASKED;
    case CHATBOT_STATES.EXAM_PASSED_ASKED:
       return CHATBOT_STATES.EXPERIENCE_YEARS_ASKED;
    case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
      userProfile.dept = SmartParser.parseList(userResponse);
      return CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED;
    case CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED:
      userProfile.intdept = SmartParser.parseList(userResponse);
      return CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED;
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED_STUDENT:
      return CHATBOT_STATES.SCHOOL_NAME_ASKED;
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
      return CHATBOT_STATES.EXTRACURRICULARS_ASKED;
    case CHATBOT_STATES.EXTRACURRICULARS_ASKED:
    case CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED:
      userProfile.awards = SmartParser.parseList(userResponse);
      return CHATBOT_STATES.AWARDS_ASKED;
    case CHATBOT_STATES.AWARDS_ASKED:
      userProfile.state = SmartParser.parseState(userResponse);
      return CHATBOT_STATES.STATE_ASKED;
    case CHATBOT_STATES.STATE_ASKED:
      userProfile.relocate = SmartParser.parseYesNo(userResponse);
      return CHATBOT_STATES.RELOCATE_ASKED;
    case CHATBOT_STATES.RELOCATE_ASKED:
      const choice = parseInt(userResponse.trim());
      const options = ["Immediately", "In less than 3 weeks", "In more than 3 weeks"];
      userProfile.availability = options[choice - 1] || "In more than 3 weeks";
      return CHATBOT_STATES.AVAILABILITY_ASKED;
    case CHATBOT_STATES.AVAILABILITY_ASKED:
      return CHATBOT_STATES.COMPLETE_SURVEY;
    case CHATBOT_STATES.COMPLETE_SURVEY:
      return CHATBOT_STATES.COMPLETED;
    default:
      return CHATBOT_STATES.DEFAULT;
  }
}

function getPromptStrict(state, userProfile) {
  switch (state) {
    case CHATBOT_STATES.NEW:
      return "Hi! My name is Helius ??, and I'm excited to show you nursing specialties that fit your unique personality!\n\nOk, what is your full name?";
    case CHATBOT_STATES.EMAIL_ASKED:
      return "And  what is your email address?";
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
      return "Now let's get to know you. Are you a Licensed Nurse or still a Student?"
    case CHATBOT_STATES.EXAM_PASSED_ASKED:
      return "When did you pass the NCLEX exam? (e.g., MM/YYYY):";     
    case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
      return "How many years of nursing experience do you have?";
    case CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED:
      return "Which department are you working in right now?";
    case CHATBOT_STATES.SCHOOL_NAME_ASKED:
      return "What is the name of your school?";
    case CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED:
      return "Which Nursing specialties are you interested in working in?";
    case CHATBOT_STATES.GRADUATION_YEAR_ASKED:
      return "When do you expect to graduate? (e.g., YYYY):";
    case CHATBOT_STATES.MAJOR_ASKED:
      return "What is your major?";
    case CHATBOT_STATES.EXTRACURRICULARS_ASKED:
      return "Cool, we are almost done!\n\nWere you part of any extra-curricular groups, clubs, or activities?";
    case CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED:
      return "Cool, we are almost done!\n\nWhich Nursing departments are you interested in working in?";
    case CHATBOT_STATES.AWARDS_ASKED:
      return "Have you ever received any academic or professional awards?";
    case CHATBOT_STATES.STATE_ASKED:
      return "Ok, which state do you live in?";
    case CHATBOT_STATES.RELOCATE_ASKED:
      return "Are you willing to relocate for a new role or specialty? (Yes/No):";
    case CHATBOT_STATES.AVAILABILITY_ASKED:
      return "If offered a new career opportunity, how soon can you start?\n1. Immediately\n2. In less than 3 weeks\n3. In more than 3 weeks";
    case CHATBOT_STATES.COMPLETE_SURVEY:
      return "Perfect! Click here: [helis.click/xxx] to complete our 15-minute personality profile.";
    case CHATBOT_STATES.COMPLETED:
      return "Thank you for providing your information!";
    default:
      return "Sorry, something went wrong. Let's start over. What is your full name?";
  }
}


function getNextPromptStrict(state, userProfile) {
  switch (state) {
    case CHATBOT_STATES.NEW:
      return "Hi! My name is Helius ??, and I'm excited to show you nursing specialties that fit your unique personality!\n\nOk, what is your full name?";
    case CHATBOT_STATES.EMAIL_ASKED:
      return "Now let's get to know you. Are you a Licensed Nurse or still a Student?";
    case CHATBOT_STATES.PROFESSION_TYPE_ASKED:
      return "When did you pass the NCLEX exam? (e.g., MM/YYYY):"
    case CHATBOT_STATES.EXAM_PASSED_ASKED:
      return "How many years of nursing experience do you have?";
    case CHATBOT_STATES.EXPERIENCE_YEARS_ASKED:
      return "Which department are you working in right now?";
    case CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED:
      return "Cool, we are almost done!\n\nWhich Nursing departments are you interested in working in?";
    case CHATBOT_STATES.SCHOOL_NAME_ASKED:
      return "Which Nursing specialties are you interested in working in?";
    case CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED:
      return "When do you expect to graduate? (e.g., YYYY):";
    case CHATBOT_STATES.GRADUATION_YEAR_ASKED:
      return "What is your major?";
    case CHATBOT_STATES.MAJOR_ASKED:
      return "Cool, we are almost done!\n\nWere you part of any extra-curricular groups, clubs, or activities?";
    case CHATBOT_STATES.EXTRACURRICULARS_ASKED:
    case CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED:
      return "Have you ever received any academic or professional awards?";
    case CHATBOT_STATES.AWARDS_ASKED:
      return "Ok, which state do you live in?";
    case CHATBOT_STATES.STATE_ASKED:
      return "Are you willing to relocate for a new role or specialty? (Yes/No):";
    case CHATBOT_STATES.RELOCATE_ASKED:
      return "If offered a new career opportunity, how soon can you start?\n1. Immediately\n2. In less than 3 weeks\n3. In more than 3 weeks";
    case CHATBOT_STATES.AVAILABILITY_ASKED:
      return "Perfect! Click here: [helis.click/xxx] to complete our 15-minute personality profile.";
    case CHATBOT_STATES.COMPLETED:
      return "Thank you for providing your information!";
    default:
      return "Sorry, something went wrong. Let's start over. What is your full name?";
  }
}


function mapTextToState(text: string, userProfile: UserProfile): CHATBOT_STATES {
  const promptMap: Record<string, CHATBOT_STATES> = {
    "Hi! My name is Helius ??, and I'm excited to show you nursing specialties that fit your unique personality!\n\nOk, what is your full name?": CHATBOT_STATES.NEW,
    "And  what is your email address?": CHATBOT_STATES.EMAIL_ASKED,
    "Now let's get to know you. Are you a Licensed Nurse or still a Student?": CHATBOT_STATES.PROFESSION_TYPE_ASKED,
    "When did you pass the NCLEX exam? (e.g., MM/YYYY):": CHATBOT_STATES.EXAM_PASSED_ASKED ,
    "What is the name of your school?": CHATBOT_STATES.SCHOOL_NAME_ASKED,
    "How many years of nursing experience do you have?": CHATBOT_STATES.EXPERIENCE_YEARS_ASKED,
    "Which department are you working in right now?": CHATBOT_STATES.CURRENT_DEPARTMENT_ASKED,
    "Cool, we are almost done!\n\nWhich Nursing departments are you interested in working in?": CHATBOT_STATES.INTERESTED_DEPARTMENTS_NURSE_ASKED,
    "Which Nursing specialties are you interested in working in?": CHATBOT_STATES.INTERESTED_SPECIALTIES_STUDENT_ASKED,
    "When do you expect to graduate? (e.g., YYYY):": CHATBOT_STATES.GRADUATION_YEAR_ASKED,
    "What is your major?": CHATBOT_STATES.MAJOR_ASKED,
    "Cool, we are almost done!\n\nWere you part of any extra-curricular groups, clubs, or activities?": CHATBOT_STATES.EXTRACURRICULARS_ASKED ,
    "Have you ever received any academic or professional awards?": CHATBOT_STATES.AWARDS_ASKED,
    "Ok, which state do you live in?": CHATBOT_STATES.STATE_ASKED,
    "Are you willing to relocate for a new role or specialty? (Yes/No):": CHATBOT_STATES.RELOCATE_ASKED ,
    "If offered a new career opportunity, how soon can you start?\n1. Immediately\n2. In less than 3 weeks\n3. In more than 3 weeks": CHATBOT_STATES.AVAILABILITY_ASKED,
    "Perfect! Click here: [helis.click/xxx] to complete our 15-minute personality profile.": CHATBOT_STATES.COMPLETE_SURVEY,
    "Thank you for providing your information!": CHATBOT_STATES.COMPLETED,
    "Sorry, something went wrong. Let's start over. What is your full name?": CHATBOT_STATES.UNKNOWN
  };

 
  return promptMap[text] || CHATBOT_STATES.UNKNOWN;
}

function validateUserResponse(currentState, userResponse, userProfile) {
  return userResponse && userResponse.trim().length > 0;
}

export async function getUserIdByEmail(email: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000 // adjust based on expected user count
    });

    if (error) {
      console.error("Error fetching user list:", error.message);
      return null;
    }

    const user = data?.users?.find(u => u.email === email);
    return user?.id ?? null;

  } catch (err) {
    console.error("Unexpected error in getUserIdByEmail:", err);
    return null;
  }
}


export async function getUserIdByPhone(phone: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("hel_candidate")
      .select("candidate_id")
      .eq("phone_number", formatPhoneNumber(phone) )
      .limit(1);

    if (error) {
      console.error("Supabase query error:", error.message);
      return null;
    }

    if (data && data.length > 0) {
      console.log( "Candidate ID:" + data[0].candidate_id );
      return data[0].candidate_id;
    }
    
    console.log( "Returning null ID");

    return null;
  } catch (err) {
    console.error(`Exception while fetching candidate ID: ${err}`);
    return null;
  }
}

export function formatPhoneNumber(input: string): string {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');

  // Handle 11-digit numbers starting with country code '1'
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    const areaCode = digitsOnly.slice(1, 4);
    const centralOffice = digitsOnly.slice(4, 7);
    const lineNumber = digitsOnly.slice(7);
    return `(${areaCode}) ${centralOffice}-${lineNumber}`;
  }

  // Handle 10-digit US numbers
  if (digitsOnly.length === 10) {
    const areaCode = digitsOnly.slice(0, 3);
    const centralOffice = digitsOnly.slice(3, 6);
    const lineNumber = digitsOnly.slice(6);
    return `(${areaCode}) ${centralOffice}-${lineNumber}`;
  }

  // If the input is not a valid 10 or 11 digit number
  console.warn(`Unexpected phone format: ${input}`);
  return input;
}



type NameParts = {
  firstName: string;
  lastName: string;
};

export function splitFullName(fullName: string): NameParts {
  const name = fullName.trim().replace(/\s+/g, ' ');
  const parts = name.split(' ');

  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}


export async function populateHeliusTable(
  inputAnswer: string,
  tableName: string,
  fieldName: string,
  phoneNumber: string,
  emailAddress: string,
): Promise<void> {
   
    var formattedNumber = formatPhoneNumber(phoneNumber); 
    const answer = inputAnswer.toLowerCase();
    var candidateId = await getUserIdByPhone(formattedNumber);
    console.log(  "Candidate ID: " + candidateId );

    if (!candidateId){
       candidateId = await getUserIdByEmail(emailAddress);
    }

    let data: Record<string, any> = {
      candidate_id: candidateId,
      creation_date: new Date().toISOString().split('T')[0],
      created_by: 'ADMIN',
      last_update_date: new Date().toISOString().split('T')[0],
      last_updated_by: 'ADMIN'
    };
    
    if( fieldName === 'email'){
       //Update Admin User email address
	const { dataAdminUser, error } = await supabase.auth.admin.updateUserById(candidateId, {
	  email: answer
	});

	if (error) {
	  console.error("Error updating email:", error.message);
	} else {
	  console.log("User updated:", dataAdminUser);
	}       
    }

    if (fieldName === 'full_name') {
      const { firstName, lastName } = splitFullName(answer);
      data = {
        ...data,
        phone_number: formattedNumber,
        first_name: firstName,
        last_name: lastName
      };
    } else if (tableName !== 'hel_candidate') {
      data[fieldName] = answer;
    } else {
      data = {
        ...data,
        phone_number: formattedNumber,
        [fieldName]: answer
      };
    }

    try {
      const { error } = await supabase.from(tableName).upsert(data);

      if (error) {
        console.error(`Failed to upload: ${candidateId} - ${error.message}`);
      } else {
        console.log(`Successfully uploaded: ${candidateId}`);
      }
    } catch (err) {
      console.error(`Unexpected error: ${(err as Error).message}`);
    }
  
}


// Check if a user exists by email
async function checkUserExists(email: string): Promise<boolean> {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 4000
  });

  if (error) {
    console.error("Error checking user existence:", error.message);
    return false;
  }

  return data?.users?.some(user => user.email === email) ?? false;
}

// Create admin user
export async function createAdminUser(email: string, password: string, phone: string): Promise<void> {
 
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    console.error(`Failed to create user ${email}:`, error.message);
  } else {
    console.log(`User created successfully: ${email}`);
    
    let candidateId = await getUserIdByEmail(email);
    
	let dataCandidate: Record<string, any> = {
	  candidate_id: candidateId,
	  phone_number: formatPhoneNumber(phone),
	  email: email,
	  creation_date: new Date().toISOString().split('T')[0],
	  created_by: 'ADMIN',
	  last_update_date: new Date().toISOString().split('T')[0],
	  last_updated_by: 'ADMIN'
	};
	
    try {
      const { error } = await supabase.from("hel_candidate").upsert(dataCandidate);

      if (error) {
        console.error(`Failed to upload: ${candidateId} - ${error.message}`);
      } else {
        console.log(`Successfully uploaded Candidate: ${candidateId}`);
      }
    } catch (err) {
      console.error(`Unexpected error: ${(err as Error).message}`);
    }
	

    
    return candidateId;
  }
}




serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const phoneNumber = formData.get("From")?.toString() || "";
    const smsMessage = formData.get("Body")?.toString() || "";
    const smsCreatedDate = new Date().toISOString();

      
	const { data, error } = await supabase
	  .from("hel_chat_logs")
	  .select("bot_message")
	  .eq("phone_number", phoneNumber)
	  .order("creation_date", { ascending: false })
	  .limit(1);
	  
	  const lastEntry = data[0];

    let userInfo;
    let result;
    let chatbotState = null;

     if (!lastEntry || !lastEntry.bot_message) {   
        console.log("No Chat entries exist" );
     }
     else{
     	console.log("lastEntry.bot_message = " + lastEntry.bot_message);
     }


    if (!lastEntry || !lastEntry.bot_message) {    
      userInfo = { currentState: CHATBOT_STATES.INIT, userProfile: {} };
      result = processChatbotInteraction(userInfo, "", "", CHATBOT_STATES.NEW ); // no message yet, just return the welcome prompt
      chatbotState = CHATBOT_STATES.INIT ;
    } 
    else if ( lastEntry.bot_message == "Now let's get to know you. Are you a Licensed Nurse or still a Student?"){

      const professionLower = smsMessage.trim().toLowerCase();
      console.log("professionLower  = " + professionLower );
      let profession = professionLower.includes("nurse") ? "Licensed Nurse" : "Student";
      console.log("profession  = " + profession );
      if (profession === 'Licensed Nurse') {
	      userInfo = { currentState: CHATBOT_STATES.PROFESSION_TYPE_ASKED_NURSE, userProfile: {} };
	      result = processChatbotInteraction(userInfo, "", smsMessage,  CHATBOT_STATES.PROFESSION_TYPE_ASKED_NURSE);
      } else {
	      userInfo = { currentState: CHATBOT_STATES.PROFESSION_TYPE_ASKED_STUDENT, userProfile: {} };
	      result = processChatbotInteraction(userInfo, "", smsMessage,  CHATBOT_STATES.PROFESSION_TYPE_ASKED_STUDENT);
      }
      chatbotState = CHATBOT_STATES.PROFESSION_TYPE_ASKED;
    }
    else if (lastEntry.bot_message === "Thank you for providing your information!") {
	  let userProfile = {};
	  const isValidForStorage = validateUserResponse(CHATBOT_STATES.COMPLETED, "You have provided all the necessary information to the Helius Corporation. We will be in touch shortly.", userProfile);

	  result = {
	    resText: "You have provided all the necessary information to the Helius Corporation. We will be in touch shortly.",
	    textValid: isValidForStorage,
	    storeUserInfo: isValidForStorage,
	    nextState: CHATBOT_STATES.COMPLETED,
	    userProfile
	  };
	  chatbotState = CHATBOT_STATES.CHATBOT_STATES.COMPLETED;
	}
    else {
      userInfo = { currentState: mapTextToState( lastEntry.bot_message ), userProfile: {} };
      result = processChatbotInteraction(userInfo, "", smsMessage,  mapTextToState( lastEntry.bot_message ));
      chatbotState = mapTextToState( lastEntry.bot_message );
    }

      let userId = await getUserIdByPhone(phoneNumber);
      let emailAddress = phoneNumber + "@helius.com";
      
	    if ( userId != null && userId !== undefined ){
		console.log(  "User with Phone " + phoneNumber + " exists" );
	    }
	    else{
	       console.log(  "User with Phone " + phoneNumber + " does not exists" );
	       //Create Admin User
	       createAdminUser(emailAddress, "test123", phoneNumber);
	    }

   if( chatbotState != CHATBOT_STATES.INIT ){
      //Populate Helius Table
      populateHeliusTable(
        smsMessage,
        getTableName(chatbotState),
        getFieldName(chatbotState),
        phoneNumber,
        emailAddress
      );
   }
 
    //Insert Helius Chat Log
    await supabase.from("hel_chat_logs").insert({
      candidate_id: null,
      phone_number: phoneNumber,
      sms_message: smsMessage,
      bot_message: result.resText,
      sms_created_date: smsCreatedDate,
      creation_date: smsCreatedDate,
      created_by: "helius-bot",
      last_update_date: smsCreatedDate,
      last_updated_by: "helius-bot"
    });
    


    return new Response(`<Response><Message>${result.resText}</Message></Response>`, {
      headers: {
        'Content-Type': 'application/xml',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    return new Response(`<Response><Message>Oops! Something went wrong. Please try again later.</Message></Response>`, {
      headers: {
        'Content-Type': 'application/xml',
        ...corsHeaders
      },
      status: 500
    });
  }
});
