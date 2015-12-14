from pybrain.datasets import SupervisedDataSet
from pybrain.tools.customxml import NetworkWriter
from pybrain.tools.customxml import NetworkReader
from pybrain.tools.shortcuts import buildNetwork
from pybrain.supervised.trainers import BackpropTrainer
from feature_extraction import Features
import json

class Trainer:
  def __init__(self):
    self.dataset = []

  def addTrainingSetEntry(self, data, target):
    converted_json = convertJsonToList(data)
    featuresObject = Features(converted_json)
    featuresObject.processFeatures()
    input = featuresObject.getFeatures()
    #self.dataset.append([input, [ord(target)]])
    outfile = open('training_data.csv', 'a')
    outfile.write(','.join(map(str, input)))
    outfile.write(',')
    outfile.write(ord(target))
    outfile.write('\n')
    outfile.close()

  def trainNetwork(self):
    tf = open('training_data.csv','r')

    for line in tf.readlines():
      data = [float(x) for x in line.strip().split(',') if x != '']
      indata =  data[:-1]
      outdata = int(data[-1])
      self.dataset.append([indata,outdata])

    trainingSet = SupervisedDataSet(len(self.dataset[0][0]), 1);
    for ri in range(0,50000):
      input,target = dataset[random.randint(0,len(dataset) - 1)];
      trainingSet.addSample(input, target)

    net = buildNetwork(trainingSet.indim, 5, trainingSet.outdim, bias=True)
    trainer = BackpropTrainer(self.net, trainingSet, learningrate = 0.001, momentum = 0.99)
    trainer.trainUntilConvergence(verbose=True,
                                  trainingData=trainingSet,
                                  validationData=trainingSet,
                                  maxEpochs=10)
    NetworkWriter.writeToFile(net, 'trainedNet.xml')
    tf.close()

  def testNetwork(self, data):
    converted_json = convertJsonToList(data)
    featuresObject = Features(converted_json)
    featuresObject.processFeatures()
    input = featuresObject.getFeatures()
    net = NetworkReader.readFrom('trainedNet.xml')
    return chr(int(round(net.activate(input))))

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
