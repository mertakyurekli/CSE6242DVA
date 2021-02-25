//////////////////////////////////////// Q3.a /////////////////////////////////////////////
// This code is using the template from this post: https://bl.ocks.org/d3noob/daecba427fed7c2d912d8abbe9f3e784
// set the dimensions and margins of the graph
var margin = {top: 50, right: 200, bottom: 50, left: 100},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define colors:
var lineArray = [],
    colorArray = [d3.schemeCategory10, d3.schemeAccent],
    colorScheme = d3.scaleOrdinal(colorArray[0]);
var svg1 = d3.select('body')
             .append('svg')
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define a function to draw multiple lines in a single canvas:
function multiLines(category) {
    return d3.line()
        .x(function (d) {
            return x(d.rating);
        })
        .y(function (d) {
            return y(d[category]);
        });
}


d3.csv('average-rating.csv').then(function(data) {

    // Format the data:
    data.forEach(function (d) {
        d.average_rating = Math.floor(d.average_rating);
        d.users_rated = +d.users_rated;
    });

    // Generate data before drawing:
    // Initialize data set for q1
    var q1Data = [],
        categories = [],
        maxCount = 0;
    for (let i = 0; i < 10; i++) {          // Initialize q1Data
        let currDict = {};
        for (let y = 2015; y < 2020; y++) {
            currDict['rating'] = i;
            currDict[y.toString()] = 0;
            if( i === 0) { categories.push(y.toString()); }
        }
        q1Data.push(currDict);
    }

    for (let y = 2015; y < 2020; y++) {  // We're interested in years from 2015-2019
        for (let i = 0; i < data.length; i++) {
            let currRating = data[i]['average_rating'];
            q1Data[currRating][y.toString()]++;
            maxCount = Math.max(maxCount, q1Data[currRating][y.toString()]);
        }
    }
    console.log('q1Data: ', q1Data);
    console.log('categories: ', categories);

    // Scale the range of the data:
    x.domain([0, 9]).nice();
    y.domain([0, maxCount]).nice();

    // Generate colors for each line:
    for (let i = 0; i < colorArray[0].length; i++) {
        var lineDict = {};
        lineDict.color = colorScheme(i);
        lineArray.push(lineDict);
    }
    console.log('lineArray: ', lineArray);

    // Add valueline to 'path' where 'valueline' represents ratings (e.g. 0, 1, ..., 9):
    for (let i = 0; i < categories.length; i++) {
        var lineFunction = multiLines(categories[i]);
        console.log(lineFunction)
        svg1.append("path")
            .data(q1Data)
            .attr("class", "line")
            .style('stroke', lineArray[i].color)
            .style('fill', 'none')                // Remove shaded area
            .attr("d", lineFunction);
    }



    svg1.append('text')
        .attr('x', 200)
        .attr('y', 0)
        .text('Board games by Rating 2015-2019');

    // Add the X axis:
    svg1.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))    // https://stackoverflow.com/questions/40173533/customize-the-d3-month-or-year-tick-format/40175517
    svg1.append('text')
        .attr('class', 'x label')
        .attr('x', 275)
        .attr('y', height+40)
        .text('Rating');

    // Add the Y Axis
    svg1.append("g")
        .call(d3.axisLeft(y));
    svg1.append('text')
        .attr('transform', 'rotate(270)')
        .attr('class', 'y label')
        .attr('x', -250)
        .attr('y', -50)
        .text('Count');

})











