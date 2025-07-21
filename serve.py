#!/usr/bin/env python3
"""
Simple HTTP server for development testing of the Falling Sand application.
Run with: python3 serve.py
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()

def main():
    # Change to the directory containing this script
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("Available pages:")
        print(f"  Main app: http://localhost:{PORT}/index.html")
        print(f"  Test page: http://localhost:{PORT}/test.html")
        print("\nPress Ctrl+C to stop the server")
        
        try:
            # Automatically open the browser
            webbrowser.open(f'http://localhost:{PORT}/index.html')
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()