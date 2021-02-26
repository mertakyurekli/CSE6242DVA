//////////////////////////////////////// Q4.c /////////////////////////////////////////////
// This code is using the template from this post: https://bl.ocks.org/d3noob/daecba427fed7c2d912d8abbe9f3e784
// set the dimensions and margins of the graph
var margin = {top: 50, right: 200, bottom: 50, left: 200},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var xScalec = d3.scaleLinear().range([0, width]);
var yScalec = d3.scaleBand().range([height, 0]).padding(0.1);



d3.csv('average-rating.csv').then(function(data) {
    var q3Data = [],
        maxRated = [];
    for (let i = 0; i < data.length; i++) {
        if (Math.floor(parseInt(data[i]['average_rating'])) === 6 && data[i]['year'] === '2019') {
            if (q3Data.length < 5) {
                q3Data.push(data[i]);
                maxRated.push(parseInt(data[i]['users_rated']))
            }
            else if (q3Data.length >= 5 && parseInt(data[i]['users_rated']) > Math.min(... maxRated)) {
                let minIndex = maxRated.indexOf(Math.min(... maxRated));
                q3Data[minIndex] = data[i];
                maxRated[minIndex] = parseInt(data[i]['users_rated']);
            }
        }
    }
    function sortData(d) {                  // sort by descending order
        for (let i = 0; i < d.length; i++) {
            let key = d[i],
                j = i - 1;
            while (j >= 0 && parseInt(key['users_rated']) > parseInt(d[j]['users_rated'])) {
                d[j+1] = d[j];
                j--;
            }
            d[j+1] = key;
        }
    }
    sortData(q3Data);
    q3Data.forEach(function(d) { d.users_rated = parseInt(d.users_rated); } )

    var svg2 = d3.select('body')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    console.log(q3Data)
    xScalec.domain([0, parseInt(q3Data[0]['users_rated'])]);
    yScalec.domain(q3Data.map(function(d) { return d.name; }).reverse());


    svg2.selectAll('.bar')
        .data(q3Data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', function(d) { return xScalec(+d.users_rated); })
        .attr('y', function (d) { return yScalec(d.name); })
        .attr('height', yScalec.bandwidth());

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScalec)
            .ticks(10)
        }

    // add the x gridlines
    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat(''));

    // Add the x axis:
    svg2.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScalec));
    svg2.append('text')
        .attr('class', 'x label')
        .attr('x', 180)
        .attr('y', height + 40)
        .attr('font-weight', 'bold')
        .attr('font-size', '18px')
        .text('Number of Users');

    // add the y Axis
    svg2.append("g")
        .call(d3.axisLeft(yScalec));
    svg2.append('text')
        .attr('transform', 'rotate(270)')
        .attr('class', 'y label')
        .attr('x', -250)
        .attr('y', -150)
        .attr('font-weight', 'bold')
        .attr('font-size', '20px')
        .text('Games');

})

















