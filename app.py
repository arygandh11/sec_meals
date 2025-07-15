from flask import Flask, render_template, request, jsonify
import csv
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# In-memory data
companies = {}
undo_stack = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/charts')
def charts():
    return render_template('charts.html')

@app.route('/add_company', methods=['POST'])
def add_company():
    data = request.get_json()
    name = data['name']
    count = int(data['count'])
    companies[name] = count
    undo_stack[name] = []
    return jsonify(success=True)

@app.route('/update_count', methods=['POST'])
def update_count():
    data = request.get_json()
    name = data['name']
    change = int(data['change'])
    if name in companies:
        undo_stack[name].append(companies[name])
        companies[name] += change
        companies[name] = max(0, companies[name])
    return jsonify(success=True, count=companies[name])

@app.route('/undo', methods=['POST'])
def undo():
    data = request.get_json()
    name = data['name']
    if undo_stack.get(name):
        companies[name] = undo_stack[name].pop()
    return jsonify(success=True, count=companies[name])

@app.route('/delete_company', methods=['POST'])
def delete_company():
    data = request.get_json()
    name = data['name']
    if name in companies:
        companies.pop(name)
        undo_stack.pop(name, None)
    return jsonify(success=True)

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '').lower()
    results = {k: v for k, v in companies.items() if query in k.lower()}
    return jsonify(results)

@app.route('/upload_csv', methods=['POST'])
def upload_csv():
    file = request.files['file']
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    with open(filepath, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row['Company'].strip()
            count = int(row['Recruiters'].strip())
            companies[name] = count
            undo_stack[name] = []
    return jsonify(success=True)

@app.route('/graph_data', methods=['GET'])
def graph_data():
    return jsonify(companies)

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
