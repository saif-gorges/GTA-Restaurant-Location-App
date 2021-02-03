# import necessary libraries
# from models import create_classes
import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, render_template, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
engine = create_engine('postgres://ssbhhlzo:ml3hJfrli7AgJRwhxx_nIHmSITfYYTz4@ziggy.db.elephantsql.com:5432/ssbhhlzo')

Base = automap_base()
Base.prepare(engine, reflect=True)

print(Base.classes.keys())

# Save references to each table
Income = Base.classes.income
Crime = Base.classes.crime
Ethnicity = Base.classes.ethnicity
Restaurant = Base.classes.restaurant
NeighbourhoodRestaurant = Base.classes.neighbourhood_restaurant
YelpRatings = Base.classes.yelp_ratings


# Create our session (link) from Python to the DB
session = Session(engine)


#################################################
# Flask Routes
#################################################


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Query the database and send the jsonified results
@app.route('/api/ethnicity/<neighbourhood>', methods=['GET'])
def get_ethnicity_data(neighbourhood):
    
    sel = [Ethnicity.neighbourhood_name,
            Ethnicity.oceania_origins,
            Ethnicity.asian_origins,
            Ethnicity.north_american_aboriginal_origins,
            Ethnicity.other_north_american_origins,
            Ethnicity.latin_origins,
            Ethnicity.european_origins,
            Ethnicity.african_origins,
            Ethnicity.caribbean_origins]

    results = session.query(*sel).filter(Ethnicity.neighbourhood_name == neighbourhood).all()

    data_all = []

    for item in results:
        data = {}
        data['neighbourhood'] = item[0]
        data['oceania_origins']=item[1]
        data['asian_origins']=item[2]
        data['north_american_aboriginal_origins']=item[3]
        data['latin_origins']=item[4]
        data['european_origins']=item[5]
        data['african_origins']=item[6]
        data['caribbean_origins']=item[6]
        data_all.append(data)
    return jsonify(data_all)







# @app.route("/api/pals")
# def pals():
#     results = db.session.query(Pet.name, Pet.lat, Pet.lon).all()

#     hover_text = [result[0] for result in results]
#     lat = [result[1] for result in results]
#     lon = [result[2] for result in results]

#     pet_data = [{
#         "type": "scattergeo",
#         "locationmode": "USA-states",
#         "lat": lat,
#         "lon": lon,
#         "text": hover_text,
#         "hoverinfo": "text",
#         "marker": {
#             "size": 50,
#             "line": {
#                 "color": "rgb(8,8,8)",
#                 "width": 1
#             },
#         }
#     }]

#     return jsonify(pet_data)


if __name__ == "__main__":
    app.run()
