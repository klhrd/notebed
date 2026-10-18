import os
import urllib.parse
import re

def generate_bookmarklet(js_path:str,output_path:str):
    if (not os.path.exists(js_path)):
        print("no js file found")
        return

    with open(js_path,"r",encoding="utf-8")as f:
        js_code=f.read()

    pattern=r'/\*[\s\S]*?\*/|//.*'
    no_comments=re.sub(pattern, '', js_code)
    lines=[line.strip() for line in no_comments.splitlines() if line.strip()]
    clean_lines=" ".join(lines)

    if (not clean_lines.startswith("javascript:")):
        clean_lines="javascript:"+clean_lines

    bookmarklet=urllib.parse.quote(clean_lines,safe="javascript:();=:")

    with open (output_path,"w",encoding="utf-8")as f:
        f.write(bookmarklet)

    print("done output"+output_path)

if __name__=="__main__":
    NAME="notepad"

    JS_FILE_PATH=os.path.join("script",NAME+".js")
    OUTPUT_FILE_PATH=NAME+".txt"
    
    generate_bookmarklet(JS_FILE_PATH,OUTPUT_FILE_PATH)
