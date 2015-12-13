#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi
import json
from train_network import Trainer

PORT_NUMBER = 8080

class myHandler(BaseHTTPRequestHandler):

  #Handler for the POST requests
  def do_POST(self):
    if self.path=="/":
      print "in post method"
      self.data_string = self.rfile.read(int(self.headers['Content-Length']))

      self.send_response(200)
      self.end_headers()

      data = json.loads(self.data_string)
      trainer = Trainer()
      self.wfile.write(trainer.testNetwork(data))
      return      
      
      
try:
  server = HTTPServer(('', PORT_NUMBER), myHandler)
  print 'Started httpserver on port ' , PORT_NUMBER
  
  server.serve_forever()

except KeyboardInterrupt:
  print '^C received, shutting down the web server'
  server.socket.close()