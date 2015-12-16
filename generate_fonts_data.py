import math
import numpy
from PIL import Image, ImageDraw, ImageFont

rowN = 28
colN = 28

def convertCharToImage(character, font_type):
  out = open("characters", 'a')
  img = Image.new('RGB', (100,100), "black")
  draw = ImageDraw.Draw(img)
  font = ImageFont.truetype(font_type, 50)

  draw.text((0,0), character, "white", font=font)
  d = numpy.asarray(img.convert('L'))

  xMax = yMax = 0
  yMin = xMin = 100000
  for i in range(len(d)):
    for j in range(len(d[i])):
      if d[i][j] > 100:
        if xMin > j:
          xMin = j
        if xMax < j:
          xMax = j
        if yMin > i:
          yMin = i
        if yMax < i:
          yMax = i

  img_new = img.crop((xMin, yMin, xMax, yMax))
  img_new = img_new.resize((colN, rowN), Image.BICUBIC)
  d_new = numpy.asarray(img_new.convert('L'))
  Matrix = [[0 for x in range(colN)] for x in range(rowN)]
  #print character
  out.write(character)
  # print '\n'
  for i in range(rowN):
    for j in range(colN):
      if(d_new[i][j] > 100):
        Matrix[i][j] = 1
  for row in Matrix:
    for val in row:
      out.write(str(val))
    out.write('\n')
  out.write('************************\n')
  #   print row
  # print "***************************\n"
  return Matrix

if __name__ == '__main__':
  array = ['a', 'b', 'c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3',
  '4','5','6','7','8','9','<','>','#','{','}','(',')',';']
  fonts = ['Courier New.ttf']

  f = open('data.csv','w')
  for font in fonts:
    for char in array:
      M = convertCharToImage(char, font)
      curStr = []
      for row in M:
        for val in row:
          curStr.append(str(val))
      curStr.append(str(ord(char)))
      example = ",".join(curStr)
      f.write(example + "\n")
  f.close()