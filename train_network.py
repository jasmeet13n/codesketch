from sklearn.svm import SVC
# from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from feature_extraction import Features
import json
import random
import pickle
import os

class Trainer:
  def __init__(self):
    # self.dataset = []
    self.input_arr = []
    self.target = []
    self.clf = SVC(kernel='rbf')
    #self.clf = KNeighborsClassifier()
    # if os.path.exists('clf.pkl'):
    #   self.clf = pickle.load(open('clf.pkl', "rb"))

  def addTrainingSetEntry(self, data, target, convert):
    if convert:
      data = convertJsonToList(data)
    featuresObject = Features(data)
    featuresObject.processFeatures()
    input = featuresObject.getFeatures()
    outfile = open('training_data.csv', 'a')
    outfile.write(','.join(map(str, input)))
    outfile.write(',')
    outfile.write(str(ord(target)))
    outfile.write('\n')
    outfile.close()

  def trainNetwork(self):
    tf = open('training_data.csv','r')

    lines = tf.readlines()
    for i in range(5):
      for line in lines:
        data = [float(x) for x in line.strip().split(',') if x != '']
        self.input_arr.append(data[:-1])
        self.target.append(data[-1])

    self.clf.fit(self.input_arr, self.target)
    predicted = self.clf.predict(self.input_arr)
    count = 0.0
    for i in range(len(self.target)):
      if predicted[i] == self.target[i]:
        count += 1

    print "Accuracy:", count/(len(self.target))
    pickle.dump(self.clf, open('clf.pkl', "wb"))
    tf.close()

  

  def testNetwork(self, data):
    converted_json = self.convertJsonToList(data)
    featuresObject = Features(converted_json)
    featuresObject.processFeatures()
    input_arr = featuresObject.getFeatures()
    print "in testNetwork"
    print input_arr
    return chr(self.clf.predict(input_arr))

  def convertJsonToList(self, json_data):
    data = json.loads(json_data)
    final_out = []

    for stroke in data:
      theStroke = []
      for points in stroke['points']:
        thePoints = []
        thePoints.append(points['x'])
        thePoints.append(points['y'])
        thePoints.append(points['time'])
        theStroke.append(thePoints)
      final_out.append(theStroke)

    return final_out
