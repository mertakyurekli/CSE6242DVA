
//////////////////////////////////////// Q3.a /////////////////////////////////////////////
// This code is using the template from this post: https://bl.ocks.org/d3noob/daecba427fed7c2d912d8abbe9f3e784
// set the dimensions and margins of the graph
var margin = {top: 50, right: 200, bottom: 50, left: 100},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;





d3.csv('average-rating.csv').then(function(data) {
    data.forEach(function (d) {
        d.average_rating = Math.floor(d.average_rating);
        d.users_rated = +d.users_rated;
    })
    var groupByRatings = function(d) {
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
            for (let i = 0; i < d.length; i++) {
                let currRating = d[i]['average_rating'],
                    currYear = d[i]['year'];
                if (parseInt(currYear) >= 2015 && parseInt(currYear) <= 2019) {
                    q1Data[currRating][currYear]++;
                    maxCount = Math.max(maxCount, q1Data[currRating][currYear]);
                }
        }
        return [q1Data, categories, maxCount];
    }
    var [q1Data, categories, maxCount] = groupByRatings(data);

    // Scale the range of the data and set the ranges:
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    x.domain(d3.extent(q1Data, function(d) { return d.rating; }));
    y.domain([0, maxCount+50]);

    console.log('q1Data: ', q1Data);

    // Define colors:
    var lineArray = [],
        colorArray = [d3.schemeCategory10, d3.schemeAccent],
        colorScheme = d3.scaleOrdinal(colorArray[0]);
    var svg1 = d3.select('body')
                 .append('svg')
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                 .attr('viewBox', [0,0,width,height]);
    // Define a function to draw multiple lines in a single canvas:
    function multiLines(category) {
        return d3.line()
            .x(function (d) {
                return x(+d.rating);
            })
            .y(function (d) {
                return y(+d[category]);
            });
    }
    // generate color for each line:
    for (let i = 0; i < colorArray[0].length; i++) {
        var lineDict = {};
        lineDict.color = colorScheme(i);
        lineArray.push(lineDict);
    }

    var prepareBarChartData = function(data) {
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
        return [q3Data, maxRated];
    }
    var [q3Data, maxRated] = prepareBarChartData(data);

    var makeBarFunction = function(years, ratings) {
        var svg2 = d3.select('body')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        // set the ranges
        var xScalec = d3.scaleLinear().range([0, width]);
        var yScalec = d3.scaleBand().range([height, 0]).padding(0.1);
        xScalec.domain([0, parseInt(q3Data[0]['user_rated'])]);
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
        console.log('q3Data: ',  q3Data);
        console.log('what is your node?: ', svg2.node());
        return svg2.node();
    }
    var afunction = function(d, i, n) {
        console.log('d: ', d, 'i: ', i, 'n: ', n, 'd[i]: ', d[i]);
    }
    // Add valueline1 to 'path' where 'valueline1' represents 'Catan'. So on and so forth:
    for (let i = 0; i < categories.length; i++) {
        var lineFunction = multiLines(categories[i]);
        svg1.append("path")
          .data([q1Data])
          .attr("class", "line " + categories[i])
          .style('stroke', lineArray[i].color)
          .style('fill', 'none')                // Remove shaded area
          .attr("d", lineFunction);

        var tooltip = d3.select("body")
                        .append("div")
                        .style("height", "100px")
                        .style("width", "200px")
                        .style("position", "absolute")
                        .style('visibility', 'hidden')
                        .attr('class', 'tooltip')
                        .style("background-color", "grey")
                        .html('<div id="tipDiv"><p>something there: </p></div>');

        svg1.selectAll("myCircles")
            .data(q1Data)
            .enter()
            .append("circle") // Uses the enter().append() method
            .attr('fill', lineArray[i].color)
            .attr("cx", function(d) { return x(d.rating) })
            .attr("cy", function(d) { return y(+d[categories[i]]) })
            .attr("r", 7)
            .on('mouseover', function(data, i) {
                console.log('data in mouseover: ', data, d3.event.pageX);
               tooltip.style('visibility', 'visible');
                var tipSVG = d3.select('#tipDiv')
                                .append('svg');
               tipSVG.append('rect')
                   .data(data)
                     .attr('fill', 'steelblue')
                     .attr("y", 10)
                     .attr("height", 30)
                     .transition()
                     .duration(1000)
                     .attr("width", data['2015'] * 6);
            })
            .on('mouseout', function(d, i, n) {
                console.log(i)
                afunction(d,i,n);
                return tooltip.style('visibility', 'visible');
            })
            .on('mousemove', function( ){
                return tooltip.style("top", (d3.event.pageY-20)+"px")
                    .style("left",(d3.event.pageX-50)+"px");
            })

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


    // Add legend:
    var lineLegend = svg1.selectAll('.lineLegend')
                         .data(categories)
                         .enter()
                         .append('g')
                         .attr('class', 'lineLegend')
                         .attr('transform', function(d, i) {
                             return 'translate(' + width + ',' + (i * 20) + ')';
                         });
    lineLegend.append('text')
              .text(function(d) { return d;})
              .attr("transform", "translate(15,9)"); //align texts with boxes
    lineLegend.append("circle")
              .attr("fill", function (d, i) {return lineArray[i].color; })
              .attr('r', 5)

    // Add my GT Username:
    var myUsername = svg1.append('text')
        .attr('y', 20)
        .attr('x', width/2-50)
        .attr('stroke', 'steelblue')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text('GT Username: yyu441')
})








