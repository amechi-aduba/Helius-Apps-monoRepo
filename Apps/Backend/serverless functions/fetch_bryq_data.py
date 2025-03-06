import time
import re
import pandas as pd
import logging
import traceback
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# ------------------------------ LOGGING SETUP ------------------------------
logging.basicConfig(
    filename="bryq_scraper.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)
logging.getLogger().addHandler(console_handler)

# ------------------------------ CONFIGURATION ------------------------------
BRYQ_EMAIL = "support@heliuspower.com"
BRYQ_PASSWORD = "jzG2yT3E69Esek!"
LOGIN_URL = (
    "https://auth.bryq.com/u/login/identifier?state="
    "hKFo2SAzRTl3X3A0UG5yeGdoeWdSWGRpRUUtLXlyVU0wQWRoMqFur3Vua"
    "XZlcnNhbC1sb2dpbqN0aWTZIGVLX3MwX2dQcjNGZTA5c1pOZFhMSkFkWVJT"
    "YnRFa0xwo2NpZNkgcGViMFI5UFBaRWtUNFhRVlVySEJMWDZmamFDcHhlcko"
)
JOB_LINK_PARTIAL_HREF = "/acquisition/assessments/018612f3-2bd2-02a7-9d00-36108732e1eb/applicants"

# ------------------------------ HELPER FUNCTIONS ------------------------------

def extract_candidate_name(driver, wait):
    """
    Extracts the candidate's name from the candidate description paragraph.
    Example HTML:
      <p class="body-large-regular color-netural-70">
          Leverage your existing talent pool and fill your active jobs with the right people. 
          Explore our Talent Matching feature to identify which active jobs Hamit nasufi is a potential match for.
      </p>
    This function uses a regex pattern to capture only the candidate's name.
    """
    try:
        desc_elem = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "p.body-large-regular.color-netural-70"))
        )
        desc_text = desc_elem.text.strip()
        match = re.search(r'active jobs\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)\s+is a potential match', desc_text, re.IGNORECASE)
        if match:
            candidate_name = match.group(1).strip()
            logging.info(f"Extracted candidate name from description: {candidate_name}")
            return candidate_name
        else:
            logging.error("Candidate name pattern not found in description.")
            return "Unknown Candidate"
    except Exception as e:
        logging.error("Error extracting candidate name from description.")
        logging.error(traceback.format_exc())
        return "Unknown Candidate"

def scroll_until_talent_section_visible(driver, wait):
    """
    Waits until the Talent Matching section (id="talent-matching") is visible,
    then scrolls that section into view.
    """
    try:
        section = wait.until(
            EC.visibility_of_element_located((By.ID, "talent-matching"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", section)
        logging.info("Talent Matching section is visible.")
        time.sleep(2)
    except Exception as e:
        logging.error("Talent Matching section was not found.")
        logging.error(traceback.format_exc())

def extract_score_from_card(card):
    """
    Within a job card, finds the score by looking inside the score container
    (div whose class includes 'recommend-job-score-bar-and-tag') and returns
    the first numeric text found.
    """
    score = ""
    try:
        score_container = card.find_element(By.XPATH, ".//div[contains(@class, 'recommend-job-score-bar-and-tag')]")
        svgs = score_container.find_elements(By.TAG_NAME, "svg")
        for svg in svgs:
            text_val = svg.get_attribute("textContent").strip()
            if text_val.isdigit():
                score = text_val
                break
    except Exception as e:
        logging.error("Error extracting score from card.")
        logging.error(traceback.format_exc())
    return score

def extract_all_talent_matching_data(driver, wait, candidate_name, all_results):
    """
    Scrolls through the Talent Matching section, extracts job card details,
    assigns a sequential ranking for every job card (Top #1, Top #2, etc.),
    clicks "Load more recommendations" if available, and finally scrolls back to the top.
    """
    container_id = "recommended-jobs-list-content"
    job_card_selector = "div[id^='recommended-jobs-list-item-']"
    extracted_ids = set()
    ranking_counter = 1

    scroll_until_talent_section_visible(driver, wait)

    while True:
        try:
            container = driver.find_element(By.ID, container_id)
            driver.execute_script("arguments[0].scrollIntoView(false);", container)
            time.sleep(3)  # increased wait time to allow lazy loading
        except Exception as e:
            logging.error("Error scrolling the recommended jobs container.")
            logging.error(traceback.format_exc())

        job_cards = driver.find_elements(By.CSS_SELECTOR, job_card_selector)
        new_cards = [card for card in job_cards if card.get_attribute("id") not in extracted_ids]

        if new_cards:
            for card in new_cards:
                extracted_ids.add(card.get_attribute("id"))
                ranking = f"Top #{ranking_counter}"
                ranking_counter += 1
                try:
                    job_title = card.find_element(
                        By.XPATH, ".//div[contains(@class, 'body-large-bold') and contains(@class, 'color-neutral-90')]"
                    ).text.strip()
                except Exception:
                    job_title = ""
                try:
                    department = card.find_element(
                        By.XPATH, ".//div[contains(@class, 'body-large-regular') and contains(@class, 'color-neutral-50')]"
                    ).text.strip()
                except Exception:
                    department = ""
                score = extract_score_from_card(card)
                try:
                    rating_text = card.find_element(
                        By.XPATH, ".//div[contains(@class, 'bryq-templates-components-scores-__sten_score_tag-module__tag')]//span[contains(@class, 'body-medium-bold-uppercase')]"
                    ).text.strip()
                except Exception:
                    rating_text = ""
                try:
                    comparison = card.find_element(
                        By.XPATH, ".//div[contains(@class, 'bryq-templates-components-scores-__sten_score_tag-module__tag')]//span[contains(@class, 'body-medium-regular')]"
                    ).text.strip()
                except Exception:
                    comparison = ""

                all_results.append({
                    "Candidate Name": candidate_name,
                    "Ranking": ranking,
                    "Job Title": job_title,
                    "Department": department,
                    "Score": score,
                    "Rating": rating_text,
                    "Comparison": comparison
                })
            logging.info(f"Extracted {len(new_cards)} new job card(s); total extracted: {len(extracted_ids)}")
        else:
            logging.info("No new job cards found in this iteration.")

        # Check for "Load more recommendations" and wait until new cards are loaded
        try:
            load_more = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//div[@id='recommended-jobs-pagination']//a[contains(text(), 'Load more recommendations')]")
                )
            )
            pre_click_count = len(driver.find_elements(By.CSS_SELECTOR, job_card_selector))
            driver.execute_script("arguments[0].click();", load_more)
            logging.info("Clicked 'Load more recommendations' button.")
            time.sleep(5)  # wait for additional data to load
            post_click_count = len(driver.find_elements(By.CSS_SELECTOR, job_card_selector))
            if post_click_count == pre_click_count:
                logging.info("No new job cards loaded after clicking 'Load more recommendations'.")
                break
        except Exception:
            logging.info("No more 'Load more recommendations' button available. Finishing extraction for candidate.")
            break

    driver.execute_script("window.scrollTo(0, 0);")
    logging.info("Scrolled back to the top of the candidate page.")

def fetch_bryq_data():
    """Main function to scrape data from Bryq using the updated flow."""
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=service, options=options)
    wait = WebDriverWait(driver, 30)
    all_results = []

    try:
        logging.info("Starting Bryq scraping process.")

        driver.get(LOGIN_URL)
        wait.until(EC.presence_of_element_located((By.NAME, "username"))).send_keys(BRYQ_EMAIL)
        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        wait.until(EC.presence_of_element_located((By.NAME, "password"))).send_keys(BRYQ_PASSWORD)
        driver.find_element(By.XPATH, "//button[@type='submit']").click()

        wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(),'Active Jobs')]")))

        try:
            accept_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Accept All Cookies')]")))
            accept_btn.click()
            time.sleep(1)
        except Exception:
            logging.info("No cookie popup found.")

        job_link = wait.until(EC.element_to_be_clickable((By.XPATH, f"//a[contains(@href, '{JOB_LINK_PARTIAL_HREF}')]")))
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", job_link)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", job_link)
        logging.info("Clicked on 'Nursing -Helius Benchmark' job link.")
        time.sleep(3)

        candidate_table = wait.until(EC.presence_of_element_located((By.XPATH, "//table")))
        rows = candidate_table.find_elements(By.TAG_NAME, "tr")
        if len(rows) <= 1:
            logging.warning("No candidates found!")
            return

        first_candidate_cells = rows[1].find_elements(By.TAG_NAME, "td")
        if not first_candidate_cells:
            logging.warning("No candidate cells found in the first row!")
            return

        candidate_link = first_candidate_cells[1].find_element(By.TAG_NAME, "a")
        driver.execute_script("arguments[0].click();", candidate_link)
        logging.info("Clicked on first candidate.")
        time.sleep(5)

        while True:
            time.sleep(10)  # Allow candidate page to render fully

            candidate_name = extract_candidate_name(driver, wait)
            extract_all_talent_matching_data(driver, wait, candidate_name, all_results)
            
            # Update CSV file after processing each candidate.
            df = pd.DataFrame(all_results)
            df.to_csv("bryq_talent_matching.csv", index=False, encoding="utf-8")
            logging.info("CSV file updated with current candidate data.")

            # Click the "Next" arrow in the header to proceed to the next candidate.
            try:
                next_candidate_arrow = wait.until(
                    EC.element_to_be_clickable((By.XPATH, "//section[contains(@class, 'bryq-templates-candidates-website-employers-__candidate_form-module__page-navigation-header')]//a[@title='Next']"))
                )
                driver.execute_script("arguments[0].click();", next_candidate_arrow)
                logging.info("Clicked 'Next' arrow to go to next candidate.")
                time.sleep(4)
            except Exception:
                logging.info("No more candidates available or unable to click 'Next' arrow.")
                break

        df = pd.DataFrame(all_results)
        df.to_csv("bryq_talent_matching.csv", index=False, encoding="utf-8")
        logging.info("Final data saved to bryq_talent_matching.csv")
        print(df.head())

    except Exception as e:
        logging.error(f"Error during scraping: {e}")
        logging.error(traceback.format_exc())
    finally:
        driver.quit()
        logging.info("Scraping process completed.")

if __name__ == "__main__":
    fetch_bryq_data()
