import urllib.request

try:
    url = "http://localhost:3000/"
    response = urllib.request.urlopen(url)
    html = response.read().decode('utf-8')
    print("Length of HTML:", len(html))
    
    # Let's search for some keywords in the HTML
    keywords = ["Tu Salud", "hero-content", "why-colombia", "Por Qué Colombia", "video", "hero-video"]
    for kw in keywords:
        found = kw in html
        print(f"Keyword '{kw}': {'FOUND' if found else 'NOT FOUND'}")
        
    # Write a snippet around hero-content
    idx = html.find("hero-content")
    if idx != -1:
        print("\nSnippet around hero-content:")
        print(html[max(0, idx-200):min(len(html), idx+1000)])
    else:
        print("\nCould not find 'hero-content' in HTML.")
        
except Exception as e:
    print("Error fetching page:", e)
