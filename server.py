#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi
import json
from train_network import Trainer
import urlparse

PORT_NUMBER = 8000

trainer = Trainer()
trainer.trainNetwork()

class myHandler(BaseHTTPRequestHandler):

  #Handler for the POST requests
  def do_POST(self):
    global trainer
    result = urlparse.urlparse(self.path)
    if result.path=="/test":
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

    if result.path=="/train":
      print "in post method, train"
      self.data_string = self.rfile.read(int(self.headers['Content-Length']))

      self.send_response(200)
      self.end_headers()

      self.addPointsToFile(self.data_string, result.query.split('=')[-1])
      
      #trainer.addTrainingSetEntry(data, result.query, True) #change the target appropriately

      return

  def addPointsToFile(self, data, character):
    print "in addPointsToFile for ", character
    converted_data = trainer.convertJsonToList(data)
    # print converted_data
    outfile = open('points_data', 'a')
    outfile.write('.SEGMENT "')
    outfile.write(character)
    outfile.write('"')
    outfile.write('\n')
    for stroke in converted_data:
      outfile.write(".PEN_DOWN\n")
      for points in stroke:
        outfile.write(str(points[0]))
        outfile.write(' ')
        outfile.write(str(points[1]))
        outfile.write('\n')
      outfile.write("\n.PEN_UP\n")
    outfile.write('\n')
    outfile.close()

      
      
try:
  server = HTTPServer(('', PORT_NUMBER), myHandler)
  print 'Started httpserver on port ' , PORT_NUMBER
  
  server.serve_forever()

except KeyboardInterrupt:
  print '^C received, shutting down the web server'
  server.socket.close()