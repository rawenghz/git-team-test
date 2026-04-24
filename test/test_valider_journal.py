from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_valider_journal():
    driver = webdriver.Chrome()

    driver.get("http://localhost:4200/login")
    driver.find_element(By.ID, "email").send_keys("fatima@smartkids.com")
    driver.find_element(By.ID, "password").send_keys("anim123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(3)

  
    driver.get("http://localhost:4200/animatrice/journal")
    time.sleep(2)

   
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Ex: Alphabet lettres M/N']").send_keys("Mathématiques")

    
    driver.find_element(By.CSS_SELECTOR, "input[placeholder='Ex: Dessin animaux']").send_keys("Dessin libre")

   
    evaluations = driver.find_elements(By.CSS_SELECTOR, "select")
    Select(evaluations[0]).select_by_visible_text("Bien")      
    Select(evaluations[1]).select_by_visible_text("Bien")      
    Select(evaluations[2]).select_by_visible_text("Très bien") 


    remarques = driver.find_elements(By.CSS_SELECTOR, "input[placeholder='Remarque...']")
    remarques[0].send_keys("Bonne participation")  
    remarques[1].send_keys("Très actif")           
    remarques[2].send_keys("Excellent")            

    time.sleep(2)

   
    driver.find_element(By.CLASS_NAME,"btn-valider").click()
    time.sleep(3)

    
    message=driver.find_element(By.CLASS_NAME,"msg-success").text
    assert "Journal déjà rempli pour cette date" in message
    time.sleep(5)
    driver.quit()
