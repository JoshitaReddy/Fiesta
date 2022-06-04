import numpy as np
from flask import Flask, request, jsonify
import pickle
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
import pandas as pd


model = pickle.load(open('model.pkl', 'rb'))
print('model is loaded')
app = Flask(__name__)
dataset = pd.read_csv('HR_Dataset.csv')

@app.route('/',methods=['GET'])
def index():
    satisfaction_level=float(request.args['satisfaction_level'])
    last_evaluation=float(request.args['last_evaluation'])
    number_project=float(request.args['number_project'])
    average_montly_hours=float(request.args['average_montly_hours'])
    time_spend_company=float(request.args['time_spend_company'])
    Work_accident=float(request.args['Work_accident'])
    promotion_last_5years=float(request.args['promotion_last_5years'])
    Departments=str(request.args['Departments'])
    salary=str(request.args['salary'])
    X = dataset.iloc[:, :-1].values
    ct = ColumnTransformer(transformers=[('encoder', OneHotEncoder(), [7,8])], remainder='passthrough')
    X = np.array(ct.fit_transform(X))
    test=[[satisfaction_level,
           last_evaluation,
           number_project,
           average_montly_hours,
           time_spend_company,
           Work_accident,
           promotion_last_5years,
           Departments,
           salary
           ]]
    test=ct.transform(test)
    pred=model.predict(test)
    return jsonify(prediction=str(pred[0]))

if __name__ == "__main__":
    app.run(debug=True)