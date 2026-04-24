from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def test_navigation_journal():
    driver = webdriver.Chrome()

    
    driver.get("http://localhost:4200/login")
    driver.find_element(By.CSS_SELECTOR, "input[type='email']").send_keys("fatima@smartkids.com")
    driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("anim123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(3)

 
    driver.find_element(By.LINK_TEXT, "Gestion du journal").click()
    time.sleep(2)
    assert "journal" in driver.current_url



    time.sleep(5)
    driver.quit()
