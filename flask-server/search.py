from bs4 import BeautifulSoup
from flask import jsonify
import requests

def Search(file) -> str:

    headers = {
        'User-agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36'}

    result = ""
    try:
        searchUrl = 'http://www.google.com/searchbyimage/upload'
        multipart = {
            'encoded_image': file,
            'image_content': ''
        }
        response = requests.post(
            searchUrl, files=multipart, allow_redirects=False)
        fetchUrl = response.headers['location']
        r = requests.get(fetchUrl, headers=headers) # r.text is the webscraped page in html
        soup = BeautifulSoup(r.text, 'html.parser')

        for best in soup.find_all('div', {'class': 'r5a77d'}): # find the div of the google search bar displaying results
            result = best.get_text().replace(u'\xa0', u' ') # replace \xao
            
        result = result
        categoryList = result.split("Results for ")[1].title()
        return categoryList

    except (FileNotFoundError, PermissionError):
        raise

