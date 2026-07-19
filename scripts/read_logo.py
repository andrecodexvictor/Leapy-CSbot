import urllib.request
import re

url = "https://www.leapy.com.br/"
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    print("Parsing HTML for img src containing logo/logotipo...")
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    for src in img_srcs:
        if 'logo' in src.lower() or 'logotipo' in src.lower() or 'brand' in src.lower():
            print("Found image match:", src)
            
    print("\nParsing HTML for svg path/source...")
    svgs = re.findall(r'<svg[^>]+>.*?</svg>', html, re.DOTALL)
    print("Found", len(svgs), "SVGs in HTML.")
    
except Exception as e:
    print("Error:", e)
