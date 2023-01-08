

class GlslExt:

	def __init__(self, ownercomp):
		self.ownercomp = ownercomp
		self.helpers = op("helpers")

	def ListFunctions(self):
		return self.getFunctions()

	def getFunctions(self):
		text = self.helpers.text
		lines = text.split("\n")
		out = []
		for line in lines:
			if line.startswith("//") or line.startswith('#'):
				continue
			no_spaces = line.replace(' ', '')
			if '\t' not in no_spaces:
				no_spaces = no_spaces.strip()
				if no_spaces != '' and no_spaces != '}' and no_spaces != '{':
					line = line[:line.find('{')]
					line = line.strip()
					if all(x in line for x in ['(', ')']):
						out.append(line)
		return out