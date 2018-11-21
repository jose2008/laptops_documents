import pandas as pd 
import numpy as np
from sklearn.cluster import KMeans
from sklearn import datasets
from sklearn.decomposition import PCA as sklearnPCA
from sklearn.preprocessing import StandardScaler
import json




iris = datasets.load_iris()
x = iris.data
kmean = KMeans(n_clusters=3)
y = kmean.fit(x)

print(kmeans.predict(X_test))