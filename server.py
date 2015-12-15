#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi
import json
from train_network import Trainer

PORT_NUMBER = 8080

trainer = Trainer()

class myHandler(BaseHTTPRequestHandler):


  #Handler for the POST requests
  def do_POST(self):
    global trainer
    if self.path=="/test":
      print "in post method, test"
      self.data_string = self.rfile.read(int(self.headers['Content-Length']))

      self.send_response(200)
      self.send_header('Access-Control-Allow-Origin', '*')
      self.end_headers()

      #data = json.loads(self.data_string)
      #print data
      print "after json data"
      ans = trainer.testNetwork(self.data_string)
      print "after trainer testNetwork"
      print ans
      self.wfile.write(ans)
      return

    if self.path=="/train":
      print "in post method, train"
      self.data_string = self.rfile.read(int(self.headers['Content-Length']))

      self.send_response(200)
      self.end_headers()

      data = json.loads(self.data_string)
      trainer = Trainer()
      trainer.addTrainingSetEntry(data, 'a') #change the target appropriately
      return

      
      
try:
  server = HTTPServer(('', PORT_NUMBER), myHandler)
  print 'Started httpserver on port ' , PORT_NUMBER
  
  server.serve_forever()

except KeyboardInterrupt:
  print '^C received, shutting down the web server'
  server.socket.close()