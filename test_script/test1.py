from sklearn import metrics
labels_true = [0, 0, 1, 1]
labels_pred = [0, 1, 0, 1]

print(metrics.adjusted_rand_score(labels_true, labels_pred))