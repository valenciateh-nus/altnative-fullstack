import os
from flask import Flask, request
from flask_cors import CORS, cross_origin
from search import Search

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/", methods=["GET", 'POST'])
@cross_origin()
def home():

    file = request.files.get('file')
    image_in_bytes = file.stream
    output = Search(file=image_in_bytes)

    return output


if __name__ == "__main__":
    app.run(debug=True)
