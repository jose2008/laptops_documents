from sklearn import datasets
from sklearn.cluster import KMeans
from sklearn import metrics
from sklearn.cluster import Birch

data = datasets.load_iris()

km = KMeans(n_clusters=3)
km.fit(data.data)
print(km.predict(data.data))
print( metrics.silhouette_score(data.data, km.predict(data.data), metric='sqeuclidean') )



birch = Birch(branching_factor=50, n_clusters=3, threshold=0.5)
birch.fit(data.data)
print(birch.predict(data.data))
print( metrics.silhouette_score(data.data, birch.predict(data.data), metric='sqeuclidean') )


