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
engine = create_engine('postgres://ssbhhlzo:ml3hJfrli7AgJRwhxx_nIHmSITfYYTz4@ziggy.db.elephantsql.com:5432/ssbhhlzo')

Base = automap_base()
Base.prepare(engine, reflect=True)

# Save references to each table
Income = Base.classes.income
Crime = Base.classes.crime
Ethnicity = Base.classes.ethnicity
Restaurant = Base.classes.restaurant
NeighbourhoodRestaurant = Base.classes.neighbourhood_restaurant
YelpRatings = Base.classes.yelp_ratings


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
        data['latin_origins'] = result[4]
        data['european_origins'] = result[5]
        data['african_origins'] = result[6]
        data['caribbean_origins'] = result[7]
        data_all.append(data)
    
    # Return the JSON representation of the dictionary
    return jsonify(data_all)

@app.route('/api/restaurant/<neighbourhood>', methods=['GET'])
def get_restaurant_data(neighbourhood):
    # Create a database session object
    session = Session(engine) 

    category_results = session.query(Restaurant.category, func.count(Restaurant.restaurant_name)).\
                    filter(func.lower(Restaurant.neighbourhood_name) == func.lower(neighbourhood)).\
                    group_by(Restaurant.category).\
                    order_by(func.count(Restaurant.restaurant_name).desc()).limit(10)
    
    pricerange_results = session.query(Restaurant.price_range, func.count(Restaurant.restaurant_name)).\
                    filter(func.lower(Restaurant.neighbourhood_name) == func.lower(neighbourhood)).\
                    group_by(Restaurant.price_range).all()        

    session.close()

    categories = [result[0] for result in category_results]
    num_restaurants = [result[1] for result in category_results]

    price_range = [result[0] for result in pricerange_results]
    num_restaurants_pr = [result[1] for result in pricerange_results]

    data = [
    # Category
    {
        "category" : categories,   # Plot 1 - x axis
        "num_restaurants_ca" : num_restaurants,   # Plot 1 - y axis value
    # Price Range 
        "price_range" : price_range,  # Plot 2 - x axis (multiple Xaxes)
        "num_restaurants_pr" : num_restaurants_pr    # Plot 2 - y axis value
    }]
    
    return jsonify(data)

    # for item in categories:
    #     data = {}
    #     data['category'] = item[0]
    #     data['num_restaurants']=item[1]
    #     data_all.append(data)

    # return jsonify(data_all)

@app.route('/api/scatterplotdata', methods=['GET'])
def get_scatterplot_data():

    # Create a database session object
    session = Session(engine) 

    results = session.query(Income, Crime, NeighbourhoodRestaurant).\
            filter(Income.neighbourhood_id == Crime.neighbourhood_id).\
            filter(Income.neighbourhood_id == NeighbourhoodRestaurant.neighbourhood_id).all()

    session.close()

    # data_all = []

    # for i, c, n in results:
    #     data = {}
    #     data['neighbourhood'] = i.neighbourhood_name
    #     data['median_income'] = i.median_income
    #     data['average_income'] = i.average_income
    #     data['total_average_crime_rate'] = c.total_average_crime_rate
    #     data['number_of_restaurants'] = n.number_of_restaurants
    #     data_all.append(data)

    # return jsonify(data_al)

    neighbourhood = [i.neighbourhood_name for i, c, n in results]
    median_income = [i.median_income for i, c, n in results]
    average_income = [i.average_income for i, c, n in results]
    total_average_crime_rate = [c.total_average_crime_rate for i, c, n in results]
    number_of_restaurants = [n.number_of_restaurants for i, c, n in results]

    data = [{
        "neighbourhood" : neighbourhood,
        "median_income" : median_income,
        "average_income" : average_income,
        "total_average_crime_rate" : total_average_crime_rate,
        "number_of_restaurant" : number_of_restaurants
    }]
    
    return jsonify(data)



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
