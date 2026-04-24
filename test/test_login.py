from selenium import webdriver
from selenium.webdriver.common.by import By

import time

def test_login_smartkids():
    driver = webdriver.Chrome()
    driver.get("http://localhost:4200/login")

  
    driver.find_element(By.ID, "email").send_keys("fatima@smartkids.com")

  
    driver.find_element(By.ID, "password").send_keys("anim123")

    
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    time.sleep(5)

    message=driver.current_url
    assert "login"not in message
    
  
    time.sleep(5)
    driver.quit()

