import pandas as pd 
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn import datasets
from sklearn.decomposition import PCA as sklearnPCA
from sklearn.preprocessing import StandardScaler
import json


iris = datasets.load_iris()
x = iris.data
db = DBSCAN(eps=0.3, min_samples=5).fit(x)

print(db.labels_)



x_std = StandardScaler().fit_transform(x)
sklearn_pca = sklearnPCA(n_components=2)
feature = sklearn_pca.fit_transform(x_std)


matrix_x = np.matrix(feature)
matrix_y = np.matrix(db.labels_).transpose()


matrix_general = np.concatenate((matrix_x, matrix_y), axis=1)
#print(matrix_general)

l = []
for i in range(matrix_general.shape[0]-1):
	k = i*3
	d = {}
	d["x"] = matrix_general.item(k)
	d["y"] = matrix_general.item(k+1)
	d["label"] = matrix_general.item(k+2)
	l.append(d)

with open('data4.json','w') as outfile:
	json.dump(l, outfile)

