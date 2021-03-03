
//////////////////////////////////////// Q3.a /////////////////////////////////////////////
// This code is using the template from this post: https://bl.ocks.org/d3noob/daecba427fed7c2d912d8abbe9f3e784
// set the dimensions and margins of the graph
var margin = {top: 50, right: 200, bottom: 50, left: 450},
    width = 1000 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;





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
    // generate color for each line:
    for (let i = 0; i < colorArray[0].length; i++) {
        var lineDict = {};
        lineDict.color = colorScheme(i);
        lineArray.push(lineDict);
    }



    // // Define a function to draw multiple lines in a single canvas:
    function multiLines(category) {
        return d3.line()
            .x(function (d) {
                return x(+d.rating);
            })
            .y(function (d) {
                return y(+d[category]);
            });
    }

    // define tooltip:
    // var tool_tip = d3.tip()
    //                  .attr("class", "d3-tip")
    //                  .offset([20, 120])
    //                  .html("<p>This is a SVG inside a tooltip:</p><div id='tipDiv'></div>");
    // svg1.call(tool_tip);

    // // Add valueline1 to 'path' where 'valueline1' represents 'Catan'. So on and so forth:
    let data2015 = [], data2016 = [], data2017 = [], data2018 = [], data2019 = [];
    for (let i = 0; i < q1Data.length; i++) {
        data2015.push({
            'year': '2015',
            'users rated': q1Data[i]['2015'],
            'rating': q1Data[i]['rating']
        });
        data2016.push({
            'year': '2016',
            'users rated': q1Data[i]['2016'],
            'rating': q1Data[i]['rating']
        });
        data2017.push({
            'year': '2017',
            'users rated': q1Data[i]['2017'],
            'rating': q1Data[i]['rating']
        });
        data2018.push({
            'year': '2018',
            'users rated': q1Data[i]['2018'],
            'rating': q1Data[i]['rating']
        });
        data2019.push({
            'year': '2019',
            'users rated': q1Data[i]['2019'],
            'rating': q1Data[i]['rating']
        });
    }
    svg1.append('path')
        .attr('id', 'line2015')
        .data([data2015])
        .attr("class", "line " + categories[0])
        .style('stroke', lineArray[0].color)
        .style('fill', 'none')                // Remove shaded area
        .attr("d", d3.line()
            .x(function(d) { return x(+d.rating); })
            .y(function(d) { return y(+d['users rated']); })
        );
    svg1.append('path')
        .attr('id', 'line2016')
        .data([data2016])
        .attr("class", "line " + categories[1])
        .style('stroke', lineArray[1].color)
        .style('fill', 'none')                // Remove shaded area
        .attr("d", d3.line()
            .x(function(d) { return x(+d.rating); })
            .y(function(d) { return y(+d['users rated']); })
        );
    svg1.append('path')
        .attr('id', 'line2017')
        .data([data2017])
        .attr("class", "line " + categories[2])
        .style('stroke', lineArray[2].color)
        .style('fill', 'none')                // Remove shaded area
        .attr("d", d3.line()
            .x(function(d) { return x(+d.rating); })
            .y(function(d) { return y(+d['users rated']); })
        );
    svg1.append('path')
        .attr('id', 'line2018')
        .data([data2018])
        .attr("class", "line " + categories[3])
        .style('stroke', lineArray[3].color)
        .style('fill', 'none')                // Remove shaded area
        .attr("d", d3.line()
            .x(function(d) { return x(+d.rating); })
            .y(function(d) { return y(+d['users rated']); })
        );
    svg1.append('path')
        .attr('id', 'line2019')
        .data([data2019])
        .attr("class", "line " + categories[4])
        .style('stroke', lineArray[4].color)
        .style('fill', 'none')                // Remove shaded area
        .attr("d", d3.line()
            .x(function(d) { return x(+d.rating); })
            .y(function(d) { return y(+d['users rated']); })
        );
    // Add circiles here:
    svg1.selectAll('myCircles')
        .attr('id', 'circle2015')
        .data(data2015)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr('fill', lineArray[0].color)
        .attr("cx", function(d) { return x(d.rating) })
        .attr("cy", function(d) { return y(+d['users rated']) })
        .attr("r", 7)
        .on('mouseover', mouseoverHandler)
        .on('mouseout', function(d) {
            d3.select('#barchart').remove();
        });
    svg1.selectAll('myCircles')
        .attr('id', 'circle2016')
        .data(data2016)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr('fill', lineArray[1].color)
        .attr("cx", function(d) { return x(d.rating) })
        .attr("cy", function(d) { return y(+d['users rated']) })
        .attr("r", 7)
        .on('mouseover', mouseoverHandler)
        .on('mouseout', function(d) {
            d3.select('#barchart').remove();
        });
    svg1.selectAll('myCircles')
        .attr('id', 'circle2017')
        .data(data2017)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr('fill', lineArray[2].color)
        .attr("cx", function(d) { return x(d.rating) })
        .attr("cy", function(d) { return y(+d['users rated']) })
        .attr("r", 7)
        .on('mouseover', mouseoverHandler)
        .on('mouseout', function(d) {
            d3.select('#barchart').remove();
        });
    svg1.selectAll('myCircles')
        .attr('id', 'circle2018')
        .data(data2018)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr('fill', lineArray[3].color)
        .attr("cx", function(d) { return x(d.rating) })
        .attr("cy", function(d) { return y(+d['users rated']) })
        .attr("r", 7)
        .on('mouseover', mouseoverHandler)
        .on('mouseout', function(d) {
            d3.select('#barchart').remove();
        });
    svg1.selectAll('myCircles')
        .attr('id', 'circle2019')
        .data(data2019)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr('fill', lineArray[4].color)
        .attr("cx", function(d) { return x(d.rating) })
        .attr("cy", function(d) { return y(+d['users rated']) })
        .attr("r", 7)
        .on('mouseover', mouseoverHandler)
        .on('mouseout', function(d) {
            d3.select('#barchart').remove();
        });

    function mouseoverHandler(d) {
            console.log(d, d.year, d.rating, d['users rated']);
            let selectedYear = d.year, usersRated = d['users rated'], usersRating = d.rating;
            let q3Data = [], maxRated = [], colorMap = {
                '2015': lineArray[0].color, '2016': lineArray[1].color, '2017': lineArray[2].color,
                '2018': lineArray[3].color, '2019': lineArray[4].color};
            let processBarData = function() {
                for (let i = 0; i < data.length; i++) {
                    if (Math.floor(parseInt(data[i]['average_rating'])) === usersRating && data[i]['year'] === selectedYear) {
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
                function sortData(alist) {                  // sort by descending order
                    for (let i = 0; i < alist.length; i++) {
                        let key = alist[i],
                            j = i - 1;
                        while (j >= 0 && parseInt(key['users_rated']) > parseInt(alist[j]['users_rated'])) {
                            alist[j+1] = alist[j];
                            j--;
                        }
                        alist[j+1] = key;
                    }
                }
                sortData(q3Data);
                q3Data.forEach(function(d) { d.users_rated = parseInt(d.users_rated); } )
            }
            processBarData();           // Prepare data for drawing barchart.
            console.log('After q3Data: ', q3Data);

            let bar_svg1 = d3.select('body')
                             .append('svg')
                             .attr('id', 'barchart')
                             .attr('width', width + margin.left + margin.right)
                             .attr('height', height + margin.top + margin.top + margin.bottom)
                             .append('g')
                             .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            let drawBarchart = function() {
                // drawing barchart:
                let xbarScalec = d3.scaleLinear().range([0, width]);
                let ybarScalec = d3.scaleBand().range([height, 0]).padding(0.1);
                xbarScalec.domain([0, parseInt(q3Data[0]['users_rated'])]);
                ybarScalec.domain(q3Data.map(function(d) {
                    if (d.name.length > 10) { return d.name.slice(0,10);}
                    else {return d.name;} }).reverse());
                console.log(lineArray)
                bar_svg1.selectAll('.bar')
                        .data(q3Data)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('width', function(d) { return xbarScalec(+d.users_rated); })
                        .attr('y', function (d) { return ybarScalec(d.name.slice(0,10)); })
                        .attr('height', ybarScalec.bandwidth())
                        .attr('fill', colorMap[selectedYear.toString()]);
                // gridlines in x axis function
                function make_x_gridlines() {
                    return d3.axisBottom(xbarScalec)
                        .ticks(5)
                    }
                // add the x gridlines
                bar_svg1.append("g")
                    .attr('class', 'grid')
                    .attr("transform", "translate(0," + height + ")")
                    .call(make_x_gridlines()
                        .tickSize(-height)
                        .tickFormat(''));
                // Add the x axis:
                bar_svg1.append('g')
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(xbarScalec))
                    .style('font-size', '7px');
                bar_svg1.append('text')
                    .attr('class', 'x label')
                    .attr('x', 120)
                    .attr('y', height + 40)
                    .attr('font-weight', 'bold')
                    .attr('font-size', '15px')
                    .text('Number of Users');
                // add the y Axis
                bar_svg1.append("g")
                    .call(d3.axisLeft(ybarScalec));
                bar_svg1.append('text')
                    .attr('transform', 'rotate(270)')
                    .attr('class', 'y label')
                    .attr('x', -120)
                    .attr('y', -100)
                    .attr('font-weight', 'bold')
                    .attr('font-size', '15px')
                    .text('Games');
            }
            drawBarchart();

        }












    svg1.append('text')
        .attr('x', width/2-100)
        .attr('y', 0)
        .text('Board games by Rating 2015-2019');
    // Add the X axis:
    svg1.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))    // https://stackoverflow.com/questions/40173533/customize-the-d3-month-or-year-tick-format/40175517
    svg1.append('text')
        .attr('class', 'x label')
        .attr('x', 225)
        .attr('y', height+40)
        .text('Rating');
    // Add the Y Axis
    svg1.append("g")
        .call(d3.axisLeft(y));
    svg1.append('text')
        .attr('transform', 'rotate(270)')
        .attr('class', 'y label')
        .attr('x', -200)
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
        .attr('x', width/2-150)
        .attr('stroke', 'steelblue')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text('GT Username: yyu441')
})








