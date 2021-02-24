//////////////////////////////////////// Q3.a /////////////////////////////////////////////
    // This code is using the template from this post: https://bl.ocks.org/d3noob/daecba427fed7c2d912d8abbe9f3e784
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 200, bottom: 50, left: 100},
        width = 850 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // generate multiple lines for line graph: (each line represents a category)
    var categories = ['Catan', 'Dominion', 'Codenames', 'Terraforming Mars',
                    'Gloomhaven', 'Magic: The Gathering', 'Dixit', 'Monopoly'];

    function multiLines(category) {
        return d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                var fieldName = category + '=count';
                return y(d[fieldName]);
            });
    }

    // Define colors:
    var lineArray = [];
    var colorArray = [d3.schemeCategory10, d3.schemeAccent];
    var colorScheme = d3.scaleOrdinal(colorArray[0]);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg1 = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("boardgame_ratings.csv").then(function(data) {
        console.log(data);
        // format the data
        data.forEach(function (d) {
            d.date = parseTime(d.date);
            d["Catan=count"] = +d["Catan=count"];
            d["Dominion=count"] = +d["Dominion=count"];
            d["Codenames=count"] = +d["Codenames=count"];
            d["Terraforming Mars=count"] = +d["Terraforming Mars=count"];
            d["Gloomhaven=count"] = +d["Gloomhaven=count"];
            d["Magic: The Gathering=count"] = +d["Magic: The Gathering=count"];
            d["Dixit=count"] = +d["Dixit=count"];
            d["Monopoly=count"] = +d["Monopoly=count"];
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) {
            return Math.max(d["Catan=count"], d["Dominion=count"],
                          d["Codenames=count"], d["Terraforming Mars=count"],
                          d["Gloomhaven=count"], d['Magic: The Gathering=count'],
                          d['Dixit=count'], d['Monopoly=count']); })]);

        // generate color for each line:
        for (let i = 0; i < colorArray[0].length; i++) {
            var lineDict = {};
            lineDict.color = colorScheme(i);
            lineArray.push(lineDict);
        }

        // Add valueline1 to 'path' where 'valueline1' represents 'Catan'. So on and so forth:
        for (let i = 0; i < categories.length; i++) {
            var lineFunction = multiLines(categories[i]);
            svg1.append("path")
              .data([data])
              .attr("class", "line")
              .style('stroke', lineArray[i].color)
              .style('fill', 'none')                // Remove shaded area
              .attr("d", lineFunction);
        };

        svg1.append('text')
            .attr('x', 200)
            .attr('y', 0)
            .text('Number of Ratings 2016-2020');

        // Add the X axis:
        svg1.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x)
                    .tickFormat(d3.timeFormat("%b %y")))    // https://stackoverflow.com/questions/40173533/customize-the-d3-month-or-year-tick-format/40175517
        svg1.append('text')
            .attr('class', 'x label')
            .attr('x', 275)
            .attr('y', height+40)
            .text('Month');

        // Add the Y Axis
        svg1.append("g")
            .call(d3.axisLeft(y));
        svg1.append('text')
            .attr('transform', 'rotate(270)')
            .attr('class', 'y label')
            .attr('x', -250)
            .attr('y', -50)
            .text('Num of Ratings');

        // Use a for loop to add labels for each category:
        for (let i = 0; i < categories.length; i++){
            svg1.append('text')
                .attr('transform', 'translate(' + (width + 3) + ',' + y(data[data.length-1][categories[i]+'=count']) + ')')
                .attr('font-size', '10px')
                .attr('text-anchor', 'start')
                .style('fill', lineArray[i].color)
                .text(categories[i]);
        }
    });