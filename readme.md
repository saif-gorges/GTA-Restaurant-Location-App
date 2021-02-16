# Toronto Restaurant Data Application

**Submitted By:** Dong Yi Kim | Saif Gorges | Saloni Gupta | Sooyeon Kim </br>
_Date_: February, 18th, 2021\
Visualization Project- **Toronto Restaurant Data Application** <br/>

![Toronto readme1](./Toronto-Analysis-Heroku/static/css/Images/toronto_readme1.jpg)

## Table of Contents
  * [Overview](#overview)
  * [Data Sources](#data-sources)
  * [Data Visualization](#data-visualization)
    * [Toronto Neighbourhood Map](#map)
    * [Toronto Neighbourhood Overview](#interactive-map)
    * [Ethinicty](#ethnicity)
    * [Restaurant Categories and Price Range ](#restaurant2)
  * [Fianl Proposal](#final-proposal)

## <a name="overview"></a>Overview
What are the best neighbourhoods in Toronto to open up a restaurant business? Choosing a new restaurant location is the most important, at the same time, the most difficult decision throughout the whole process. Our goal for this project is to create a dashboard page with multiple interactive graphs and maps that gives an insight at restaurant data as well as neighbourhood information in Toronto. The dashboard would help new restaurant owners decide as to where the best placement of a new restaurant could be considering ethnicity, local competition, income and crime rate per neighborhood to help determine whether a restaurant could potentially be profitable or not for each neighborhood.

## <a name="data-sources"></a>Data Sources
In this project, we created a dashboard page with these transformed datasets: Toronto Neighbourhood, Income, Crime, Toronto Restaurants Data, Restaurants Ratings. 
 
 * Datasets Sources:   
  * Toronto Neighbourhood Data - Toronto City Open Data
  * Toronto Neighbourhood Income - Toronto City Open Data
  * Toronto Crime Data - Toronto City Open Data
  * Toronto Ethnicity Data - Toronto City Open Data Json API
  * Toronto Restaurant Data - Kaggle
  * Restaurant Ratings & number of reviews - Yelp API
  
  ## <a name="data-sources"></a> Data Architecture
  ![Toronto readme1](./Toronto-Analysis-Heroku/static/css/Images/Data_architecture.JPG)
  
  ## <a name="data-visualization"></a>Data Visualization
  ### [1] <a name="map"></a>Toronto Neighbourhood Map 
  * A Toronto Neighbourhood Geomap was created using Leaflet, other graphs which give restaurant data as well as neighbourhood information in Toronto are connected to this core map. The user picks a nighbourhood by clicking on a map.   
  
  ![map](./Toronto-Analysis-Heroku/static/css/Images/map.gif)
  
  ### [2] <a name="interactive-map"></a>Toronto Neighbourhood Overview 
  * A interactive scatter plot was created using the D3 techniques, It displays Average, Median Income and Average Crime Rate for all neighbourhoods in Toronto and corresponding number of restaurants. Furthermore, Selected neighbourhood information(Average/Median income, Crime rate) is displayed on Panel.
  
  ![panel](./Toronto-Analysis-Heroku/static/css/Images/panel.jpg) ![restaurant-gif](./Toronto-Analysis-Heroku/static/css/Images/restaurant-gif.gif) 
  
  ### [3] <a name="ethnicity"></a>Totonro Ethinicty in Each Neighbourhood 
  * The selected neighbourhood information from Toronto Geomap is passed into the ethnicity. The Toronto Ethnicity Barchart is created and annotated from API calls with labels, text and hover information. Bar graph represents the ethnicity of each region in Toronto. 
  
  ![ethnicity](./Toronto-Analysis-Heroku/static/css/Images/ethnicity.gif)
  
  ### [4] <a name="restaurant2"></a>Toronto Restaurant Categories and Price Range 
  * The selected neighhourhood information is also passed into the price range routes which will then run a query to the PostgreSQL Database via SQLAlchemy to fetch their corresponding data for the neighbourhood selected on the map. The data returned was used to generate a D3 barchart for Category--Restaurant Number and for Price Range--Restaurant Number.
  
  ![restaurant1](./Toronto-Analysis-Heroku/static/css/Images/restaurant1.gif)
  
  ## <a name="final-proposal"></a>Fianl Proposal
  * The final proposal is deployed through the Heroku.
  
  ![final1](./Toronto-Analysis-Heroku/static/css/Images/final1.JPG)
  ![final2](./Toronto-Analysis-Heroku/static/css/Images/final2.JPG)
  
 
