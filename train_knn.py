from train_network import Trainer

if __name__ == '__main__':
  file = open('UJIpenchars', 'r')
  #file = open('A.txt', 'r')
  lines = file.readlines()

  currCharacter = 'a'
  multiple = False
  count = 0
  points = []
  trainer = Trainer()

  i = 0
  while i < len(lines):
    line = lines[i]
    if ".SEGMENT" in lines[i]:
      if len(points) > 0:
        if currCharacter[0] < 'A' or currCharacter[0] > 'Z':
          trainer.addTrainingSetEntry([points], currCharacter, False)
      currCharacter = line.strip().split(' ')[-1].strip('"')
      points = []
      # curClass = 
    elif ".PEN"  in line or ".COMMENT" in line or ".DT" in line or ".LEXICON" in line or ".HIERAR" in line or len(line) == 1:
      a = True
    else:
      # else add point to points
      data = [int(x) for x in line.strip().split(' ') if x != '']
      points.append(data)
    i += 1
  trainer.addTrainingSetEntry([points], currCharacter, False)
  trainer.trainNetwork()