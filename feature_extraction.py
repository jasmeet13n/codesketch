import math

class Features:
  def __init__(self, data):
    self.data = data
    self.xMax = 0
    self.xMin = 0
    self.yMax = 0
    self.yMin = 0
    self.leftToRight = 0
    self.rightToLeft = 0
    self.upToDown = 0
    self.downToUp = 0
    self.overlap = 0
    self.totalStrokeLength = 0
    self.curviness = 0

  def getFeatures(self):
    ret = []
    # direction changes
    ret.append(self.leftToRight)
    ret.append(self.rightToLeft)
    ret.append(self.upToDown)
    ret.append(self.downToUp)
    # height/width
    ret.append((self.yMax - self.yMin) / (self.xMax - self.xMin))
    # curviness
    ret.append(self.curviness)
    # overlap
    ret.append(self.overlap)
    return ret

  def calculateFeatures(self):
    xLast = 0
    yLast = 0
    notFirst = False
    angleSum = 0
    
    for row in self.data:
      if self.xMax < row[0]:
        self.xMax = row[0]
      if self.xMin > row[0]:
        self.xMin = row[0]
      if self.yMax < row[1]:
        self.yMax = row[1]
      if self.yMin > row[1]:
        self.yMin = row[1]
      if notFirst:
        self.totalStrokeLength += math.sqrt((row[0] - xLast)^2 + (row[1] - yLast)^2)
        oppSide = row[1] - yLast
        adjSide = row[0] - xLast
        if adjSide != 0:
          angleSum += math.fabs(math.atan(oppSide/adjSide))
      xLast = row[0]
      yLast = row[1]
      notFirst = True
    
    self.curviness = angleSum / totalStrokeLength

    # calculate whether there is an overlap