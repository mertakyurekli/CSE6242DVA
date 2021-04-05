---------------------
CONTENTS OF THIS FILE
---------------------

* DESCRIPTION
* INSTALLATION
* EXECUTION

-----------
DESCRIPTION
-----------
This package is the project by team 21 from CSE 6242 @ Georgia Tech. The project is about "Viusalize and forecast house value in US". The package has following files. Two html files under "template" folder. Two CSV files and one json file under "static/data" folder. One "housedata" database and two python files.

------------
INSTALLATION
------------
There is no specific installation to run these files. However, python 2.7 should be used. Also, interent connection is required. To setup the code, run "app.py" file. After showing "* Running on http://127.0.0.1:5000/", copy and paste the link into a browser. To ensure best performance, Safari and Chrome are recommended brosers.

---------
EXECUTION
---------
The first page is the homepage. Feel free to look through it to get basic information, instruction and team member contact. After you are ready, click "Start now" button and it will go to our mainpage.
The mainpage has following functions:
1. The select box in the top middle can change the display of color and data between "Current price" and "Growth potental".
2. Double click a state, the map will zoom in to that state and show its county. To go back, double click any county and the it will return to the national view.
3. Hover the cursor on the state or county, a tooltip will appear to show its name and data. If the select box is in current price, the data will be the current price of house value in that area. If the select box is in growth potential, the data will be the growth potential of that area. The larger the number of growth potential is, the greater growth potential it will get.
4. Single click on the state or county, a series of select boxes will emerge at the bottom. Choose the time and housetype, a line chart will appear.
5. If you want to see exact points of each time, change the "points" select box from hide to show. Hover the mouse on each point, a tooltip will appear to show the time and the price of that point.
6. To find out information from different areas, single click on area of interest on the map. The existing line chart will disappear. Choose time and housetype again to show the new line chart.
7. If you want to compare different housetypes, check the "compare" box on the right. Then continue selecting other housetypes, new lines will appear on the existing chart for comparison.

