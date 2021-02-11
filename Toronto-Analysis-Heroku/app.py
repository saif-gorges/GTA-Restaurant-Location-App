# import necessary libraries
# from models import create_classes
import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, render_template, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
engine = create_engine('postgres://njvrdjyvjmdbff:8574a3313def94cb7b048ef3496350a723d4ebcbb2ae1a709d66a79eab0112fe@ec2-54-211-77-238.compute-1.amazonaws.com:5432/d7ne1s21u49i5u')

Base = automap_base()
Base.prepare(engine, reflect=True)

# Save references to each table
Income = Base.classes.income
Crime = Base.classes.crime
Ethnicity = Base.classes.ethnicity
Restaurant = Base.classes.restaurant
NeighbourhoodRestaurant = Base.classes.neighbourhood_restaurant


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
    # Create a database session object
    session = Session(engine)
    
    sel = [Ethnicity.neighbourhood_name,
            Ethnicity.oceania_origins,
            Ethnicity.asian_origins,
            Ethnicity.north_american_aboriginal_origins,
            Ethnicity.other_north_american_origins,
            Ethnicity.latin_origins,
            Ethnicity.european_origins,
            Ethnicity.african_origins,
            Ethnicity.caribbean_origins]

    results = session.query(*sel).filter(func.lower(Ethnicity.neighbourhood_name) == func.lower(neighbourhood)).all()
    session.close()

    data_all = []
    for result in results:
        data = {}
        data['oceania_origins'] = result[1]
        data['asian_origins'] = result[2]
        data['north_american_aboriginal_origins'] = result[3]
        data['other_north_american_origins'] = result[4]
        data['latin_origins'] = result[5]
        data['european_origins'] = result[6]
        data['african_origins'] = result[7]
        data['caribbean_origins'] = result[8]
        data_all.append(data)
    
    
    # Return the JSON representation of the dictionary
    return jsonify(data_all)

@app.route('/api/category/<neighbourhood>', methods=['GET'])
def get_category_data(neighbourhood):
    # Create a database session object
    session = Session(engine) 

    results = session.query(Restaurant.category, func.count(Restaurant.restaurant_name)).\
                    filter(func.lower(Restaurant.neighbourhood_name) == func.lower(neighbourhood)).\
                    group_by(Restaurant.category).\
                    order_by(func.count(Restaurant.restaurant_name).desc()).limit(10)
    
    session.close()

    data_all = []

    for result in results:
        data = {}
        data['category'] = result[0]
        data['num_restaurants'] = result[1]
        data_all.append(data)
    
    return jsonify(data_all)

@app.route('/api/pricerange/<neighbourhood>', methods=['GET'])
def get_pricerange_data(neighbourhood):
    # Create a database session object
    session = Session(engine) 

    results = session.query(Restaurant.price_range, func.count(Restaurant.restaurant_name)).\
                    filter(func.lower(Restaurant.neighbourhood_name) == func.lower(neighbourhood)).\
                    group_by(Restaurant.price_range).all()        

    session.close()

    data_all = []

    for result in results:
        data = {}
        data['price_range'] = result[0]
        data['num_restaurants'] = result[1]
        data_all.append(data)
    
    return jsonify(data_all)


@app.route('/api/scatterplotdata', methods=['GET'])
def get_scatterplot_data():

    # Create a database session object
    session = Session(engine) 

    results = session.query(Income, Crime, NeighbourhoodRestaurant).\
            filter(Income.neighbourhood_id == Crime.neighbourhood_id).\
            filter(Income.neighbourhood_id == NeighbourhoodRestaurant.neighbourhood_id).all()
   

    data_all = []

    for i, c, n in results:
        data = {}
        data['neighbourhood'] = i.neighbourhood_name
        data['median_income'] = i.median_income
        data['average_income'] = i.average_income
        data['total_average_crime_rate'] = c.total_average_crime_rate
        data['number_of_restaurants'] = n.number_of_restaurants
        data_all.append(data)

    session.close()

    return jsonify(data_all)




if __name__ == "__main__":
    app.run()
