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
    self.dataset.append([input, [ord(target)]])

  def trainNetwork(self):
    trainingSet = SupervisedDataSet(2, 1);
    for ri in range(0,5000):
      input,target = dataset[random.randint(0,len(dataset) - 1)];
      trainingSet.addSample(input, target)

    net = buildNetwork(trainingSet.indim, 5, trainingSet.outdim, bias=True)
    trainer = BackpropTrainer(self.net, trainingSet, learningrate = 0.001, momentum = 0.99)
    trainer.trainUntilConvergence(verbose=True,
                                  trainingData=trainingSet,
                                  validationData=trainingSet,
                                  maxEpochs=10)
    NetworkWriter.writeToFile(net, 'trainedNet.xml')

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
      for points in stroke.values():
        for point in points:
          for val in point.values():
            theStroke.append(val)
      final_out.append(theStroke)

    return final_out
