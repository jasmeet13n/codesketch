# from pybrain.datasets import SupervisedDataSet
# from pybrain.tools.customxml import NetworkWriter
# from pybrain.tools.customxml import NetworkReader
# from pybrain.tools.shortcuts import buildNetwork
# from pybrain.supervised.trainers import BackpropTrainer
# from sklearn.svm import SVC
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
    self.clf = KNeighborsClassifier()
    if os.path.exists('clf.pkl'):
      self.clf = pickle.load(open('clf.pkl', "rb"))

  def addTrainingSetEntry(self, data, target):
    featuresObject = Features(data)
    featuresObject.processFeatures()
    input = featuresObject.getFeatures()
    #self.dataset.append([input, [ord(target)]])
    outfile = open('training_data.csv', 'a')
    outfile.write(','.join(map(str, input)))
    outfile.write(',')
    outfile.write(str(ord(target)))
    outfile.write('\n')
    outfile.close()

  def trainNetwork(self):
    tf = open('training_data.csv','r')

    for line in tf.readlines():
      data = [float(x) for x in line.strip().split(',') if x != '']
      # indata =  data[:-1]
      # outdata = int(data[-1])
      # self.dataset.append([indata,outdata])
      self.input_arr.append(data[:-1])
      self.target.append(data[-1])

    clf = KNeighborsClassifier()
    clf.fit(self.input_arr, self.target)
    pickle.dump(clf, open('clf.pkl', "wb"))

  # def trainNetwork(self):
  #   tf = open('training_data.csv','r')

    # for line in tf.readlines():
    #   data = [float(x) for x in line.strip().split(',') if x != '']
    #   indata =  data[:-1]
    #   outdata = int(data[-1])
    #   self.dataset.append([indata,outdata])

  #   trainingSet = SupervisedDataSet(len(self.dataset[0][0]), 1);
  #   for ri in range(0,50000):
  #     input,target = self.dataset[random.randint(0,len(self.dataset) - 1)];
  #     trainingSet.addSample(input, target)

  #   net = buildNetwork(trainingSet.indim, 5, trainingSet.outdim, bias=True)
  #   trainer = BackpropTrainer(net, trainingSet, learningrate = 0.001, momentum = 0.99)
  #   trainer.trainUntilConvergence(verbose=True,
  #                                 trainingData=trainingSet,
  #                                 validationData=trainingSet,
  #                                 maxEpochs=10)
  #   NetworkWriter.writeToFile(net, 'trainedNet.xml')
  #   tf.close()

  def testNetwork(self, data):
    converted_json = self.convertJsonToList(data)
    featuresObject = Features(converted_json)
    featuresObject.processFeatures()
    input_arr = featuresObject.getFeatures()
    print "in testNetwork"
    print input_arr
    # net = NetworkReader.readFrom('trainedNet.xml')
    # clf = KNeighborsClassifier()
    # self.clf = pickle.load(open('clf.pkl', "rb"))
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
