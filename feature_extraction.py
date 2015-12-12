import math

class Features:
  def __init__(self, data):
    # data is a list of strokes; each stroke is a list of coordinates
    self.data = data
    self.resampledData = []
    self.xMax = 0
    self.xMin = 0
    self.yMax = 0
    self.yMin = 0
    self.leftToRight = 0
    self.rightToLeft = 0
    self.upToDown = 0
    self.downToUp = 0
    self.numStroke = 0
    self.totalStrokeLength = 0.0
    self.curviness = 0
    self.visualFeatures = []

  def getFeatures(self):
    ret = []
    # 25 values for visual matrix
    for val in self.visualFeatures:
      ret.append(val)
    # direction changes
    ret.append(self.leftToRight)
    ret.append(self.rightToLeft)
    ret.append(self.upToDown)
    ret.append(self.downToUp)
    # height/width
    ret.append((self.yMax - self.yMin) / (self.xMax - self.xMin))
    # curviness
    ret.append(self.curviness)
    # numStroke
    ret.append(self.numStroke)
    return ret

  def calculateTotalStrokeLength(self):
    xLast = 0
    yLast = 0
    notFirst = False
    # find if contians multiple strokes
    self.numStroke = len(self.data)

    for stroke in self.data:
      for row in stroke:
        if notFirst:
          self.totalStrokeLength = self.totalStrokeLength + math.sqrt((row[0] - xLast)^2 + (row[1] - yLast)^2)
        xLast = row[0]
        yLast = row[1]
        notFirst = True

  def calculateNonVisualFeatures(self):
    xLast = 0
    yLast = 0
    notFirst = False
    angleSum = 0
    currentLeftRight = 0 # 0 for going left, 1 for going right
    currentUpDown = 0 # 0 for going up, 1 for going down
    
    for row in self.resampledData:
      if self.xMax < row[0]:
        self.xMax = row[0]
      if self.xMin > row[0]:
        self.xMin = row[0]
      if self.yMax < row[1]:
        self.yMax = row[1]
      if self.yMin > row[1]:
        self.yMin = row[1]
      if notFirst:
        oppSide = math.fabs(row[1] - yLast)
        adjSide = math.fabs(row[0] - xLast)
        if adjSide != 0:
          angleSum = angleSum + math.fabs(math.atan(oppSide/adjSide))
        
        if currentLeftRight == 0 and row[0] > xLast:
          self.leftToRight = self.leftToRight + 1
          currentLeftRight = 1
        elif currentLeftRight == 1 and row[0] < xLast:
          self.rightToLeft = self.rightToLeft + 1
          currentLeftRight = 0
        
        if currentUpDown == 0 and row[1] < yLast:
          self.upToDown = self.upToDown + 1
          currentUpDown = 1
        elif currentUpDown == 1 and row[1] > yLast:
          self.downToUp = self.downToUp + 1
          currentUpDown = 0

      xLast = row[0]
      yLast = row[1]
      notFirst = True
    
    self.curviness = angleSum / self.totalStrokeLength

    # calculate sharpness

  def resampleTheData(self):
    n = 0
    length = 0
    for stroke in self.data:
      length = length + len(stroke)
    if length > 128:
      n = length / 128
    elif length > 64:
      n = length / 64
    else:
      n = length / 32
    temp = n - 1
    first = True
    resampledData.append((self.data[0])[0])
    for stroke in self.data:
      for row in stroke:
        if first:
          continue
        if(temp == 0):
          resampledData.append(row)
          temp = n - 1
        else:
          temp = temp - 1

  def calculateVisualFeatures(self):
    Matrix = [[0 for x in range(5)] for x in range(5)]
    xCellLength = (self.xMax - self.xMin) / 5.0
    yCellLength = (self.yMax - self.yMin) / 5.0
    for row in self.resampledData:
      x = 0
      y = 0
      if row[0] == self.xMin:
        x = 0
      elif row[0] == self.xMax:
        x = 4
      else:
        x = math.floor(row[0] / xCellLength)

      if row[1] == self.yMin:
        y = 0
      elif row[1] == self.yMax:
        y = 4
      else:
        y = math.floor(row[1] / yCellLength)

      Matrix[x][y] = 1

    for row in Matrix:
      for val in row:
        self.visualFeatures.append(val)

  def processFeatures(self):
    calculateTotalStrokeLength()
    resampleTheData()
    calculateVisualFeatures()
    calculateNonVisualFeatures()