import { Twilio } from "twilio";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Twilio variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
console.log('Account SID:', accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN;
console.log('Auth token:', authToken);
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const userNumber = process.env.USER_NUMBER;

// Supabase variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

function validateEnvVars() {
    if (!accountSid || !authToken || !twilioNumber || !userNumber || !supabaseUrl || !supabaseKey) {
        throw new Error("Missing one or more required environment variables.");
    }
}

/**
 * gives dynamic response based on user input
 * @param {string} msg_text - users input message
 * @returns {string} - bots response
 */
function response_message(msg_text: string): string {
    if (msg_text.toLowerCase().includes("nurse")) {
        return "Great! As a licensed Nurse, we can help...";
    } else if (msg_text.toLowerCase().includes("student")) {
        return "No worries! As a student, ...";
    }
    return "Hello! Could you please clarify if you are a licensed Nurse or a Student?";
}

/**
 * sends message using Twilio and logs the conversation to Supabase
 * @param {string} response 
 */
async function sendAndStoreMessage(response: string) {
    const client = new Twilio(accountSid!, authToken!);
    const curr_date = new Date().toISOString();
    const user_txt = ""; // placeholder for the actual user text
    const userID = uuidv4();
    const botID = uuidv4();

    try {
        // send message with twilio
        const message = await client.messages.create({
            from: twilioNumber,
            to: userNumber!,
            body: response,
        });

        console.log("Message Sent: ", message.sid);

        // store message in supabase
        const { error } = await supabase
            .from("chat_logs")
            .insert({
                created_date: curr_date,
                msg_text: user_txt,
                response,
                update_date: new Date().toISOString(),
                user_id: userID,
                bot_id: botID,
            });

        if (error) {
            console.error("Error Logging Conversation:", error);
        } else {
            console.log("Message Saved Successfully");
        }
    } catch (err) {
        console.error("Error sending message or logging data:", err);
    }
}


async function main() {
    try {
        validateEnvVars();
        const initialMessage = "Hello! I am your Helius Assistant. Are you a licensed Nurse or still a Student?";
        await sendAndStoreMessage(initialMessage);

    } catch (err) {
        console.error("Initialization Error:", err);
    }
}

main();