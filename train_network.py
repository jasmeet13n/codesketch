from pybrain.datasets import SupervisedDataSet
from pybrain.tools.customxml import NetworkWriter
from pybrain.tools.customxml import NetworkReader
from pybrain.tools.shortcuts import buildNetwork
from pybrain.supervised.trainers import BackpropTrainer
from feature_extraction import Features

class Trainer:
  def __init__(self):
    self.dataset = []

  def addTrainingSetEntry(self, data, target):
    featuresObject = Features(data)
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
    featuresObject = Features(data)
    featuresObject.processFeatures()
    input = featuresObject.getFeatures()
    net = NetworkReader.readFrom('trainedNet.xml')
    return chr(int(round(net.activate(input))))