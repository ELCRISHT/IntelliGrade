from flask import Flask, send_from_directory, jsonify, request
import os

app = Flask(__name__, static_folder="../frontend", static_url_path="")

# Serve frontend files
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def static_proxy(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# Example API endpoint for forecasting academic performance
@app.route("/api/forecast", methods=["POST"])
def forecast():
    data = request.json
    # Dummy response for now
    return jsonify({
        "predicted_grade": "A",
        "confidence": 0.92,
        "ai_tool_dependency": data.get("ai_tool_usage", {})
    })

# Example API endpoint for AI tool dependency analysis
@app.route("/api/ai-tool-usage", methods=["GET"])
def ai_tool_usage():
    # Dummy data for now
    return jsonify({
        "tools": [
            {"name": "ChatGPT", "usage_count": 42},
            {"name": "Grammarly", "usage_count": 30},
            {"name": "Quillbot", "usage_count": 15}
        ]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
