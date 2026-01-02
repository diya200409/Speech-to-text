from flask import Flask, render_template, request, jsonify
from translator import translate_text

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

# STEP 1: ANY LANGUAGE → ENGLISH
@app.route("/speech-to-english", methods=["POST"])
def speech_to_english():
    data = request.json
    spoken_text = data.get("text", "")

    if not spoken_text:
        return jsonify({"english_text": ""})

    english_text = translate_text(spoken_text, src="auto", dest="en")

    return jsonify({
        "english_text": english_text
    })

# STEP 2: ENGLISH → SELECTED LANGUAGE
@app.route("/english-to-language", methods=["POST"])
def english_to_language():
    data = request.json
    english_text = data.get("text", "")
    target_lang = data.get("dest", "hi")

    if not english_text:
        return jsonify({"translated_text": ""})

    translated = translate_text(english_text, src="en", dest=target_lang)

    return jsonify({
        "translated_text": translated
    })

if __name__ == "__main__":
    app.run(debug=False)
