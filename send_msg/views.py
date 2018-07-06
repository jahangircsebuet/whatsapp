import os
from selenium import webdriver
from django.http import HttpResponse
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from django.views.decorators.csrf import csrf_exempt
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# if it happens
# HTTP "Content-Type" of "audio/mpeg" is not supported. Load of media resource http://localhost:8000/api/b9acced67260b0f35be87fd7cefd2ddc/play failed.
# then install missing codecs in Ubuntu by
# sudo apt-get install ubuntu-restricted-extras
driver = None

def index(request):
    return HttpResponse("Send msg app.")

@csrf_exempt
def login(request):
    # for headless firefox
    # display = Display(visible=0, size=(800, 600))
    # display.start()
    global driver

    profile = webdriver.FirefoxProfile()
    # profile.accept_untrusted_certs = True
    # profile.set_preference("security.fileuri.strict_origin_policy", False)
    # print("Firefox default pref: ")
    # print(profile.default_preferences)

    profile.set_preference("browser.cache.disk.enable", False)
    profile.set_preference("browser.cache.memory.enable", False)
    profile.set_preference("browser.cache.offline.enable", False)
    profile.set_preference("network.http.use-cache", False)

    driver = webdriver.Firefox(firefox_profile=profile)
    # driver = webdriver.Firefox()

    driver.get('https://web.whatsapp.com/')

    wait = WebDriverWait(driver, 10)
    element = wait.until(EC.visibility_of_element_located((By.ID, 'pane-side')))

    script_path = os.path.dirname(os.path.abspath(__file__))
    print("jqueryjs path"+script_path)
    script = open(os.path.join(script_path, "jquery.js"), "r").read()

    driver.execute_script(script)

    print('executing add_eventlistener.js')

    script_path = os.path.dirname(os.path.abspath(__file__))
    print("add_eventlistenerjs path"+script_path)
    script = open(os.path.join(script_path, "add_eventlistener-1.js"), "r").read()

    driver.execute_script(script)

    # img = driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div[1]/div[1]/div/img')

    # html = "<img alt = 'Scan me!' style = 'display: block;' src ='"+img.get_attribute('src')+"'>"

    resp = HttpResponse('show qrcode page')
    resp["Access-Control-Allow-Origin"] = "*"
    return resp

# this view method can be called by ajax request to echo back incoming messages
@csrf_exempt
def echo_back(request):
    global driver
    username = request.POST.get('user')

    recentList = driver.find_elements_by_xpath("//span[@class='emojitext ellipsify']")
    for head in recentList:
        if head.text == username:
            head.click()
            all_msgs = driver.find_elements_by_xpath("//div[@class='msg']")

            incoming_msg = ""
            for i, curr_msg in reversed(list(enumerate(all_msgs))):
                sub_elem = curr_msg.find_element_by_class_name('message')
                if 'message-out' in sub_elem.get_attribute('class'):
                    print('message-out: '+ curr_msg.find_element_by_class_name('selectable-text').text)
                    break
                else:
                    print('message-in: '+curr_msg.find_element_by_class_name('selectable-text').text)
                    incoming_msg += curr_msg.find_element_by_class_name('selectable-text').text + "\n"

            chat_box = driver.find_element_by_xpath("//div[@contenteditable='true']")
            chat_box.send_keys(incoming_msg)
            chat_box.send_keys(Keys.RETURN)
            break

    resp = HttpResponse("Message sent successfully")
    resp["Access-Control-Allow-Origin"] = "*"
    return resp