////////////////////////////////// Q3.c.1 ///////////////////////////////////
// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");
var margin = {top: 50, right: 200, bottom: 50, left: 100},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg31 = d3.select("body")
             .append("svg")
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
        d['Catan=rank'] = +d['Catan=rank'];
        d["Dominion=count"] = +d["Dominion=count"];
        d["Dominion=rank"] = +d["Dominion=rank"];
        d["Codenames=count"] = +d["Codenames=count"];
        d["Codenames=rank"] = +d["Codenames=rank"];
        d["Terraforming Mars=count"] = +d["Terraforming Mars=count"];
        d["Terraforming Mars=rank"] = +d["Terraforming Mars=rank"];
        d["Gloomhaven=count"] = +d["Gloomhaven=count"];
        d["Gloomhaven=rank"] = +d["Gloomhaven=rank"];
        d["Magic: The Gathering=count"] = +d["Magic: The Gathering=count"];
        d["Magic: The Gathering=rank"] = +d["Magic: The Gathering=rank"];
        d["Dixit=count"] = +d["Dixit=count"];
        d["Dixit=rank"] = +d["Dixit=rank"];
        d["Monopoly=count"] = +d["Monopoly=count"];
        d["Monopoly=rank"] = +d["Monopoly=rank"];
    });

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleSqrt().range([height, 0])

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
    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d["Catan=count"], d["Dominion=count"],
            d["Codenames=count"], d["Terraforming Mars=count"],
            d["Gloomhaven=count"], d['Magic: The Gathering=count'],
            d['Dixit=count'], d['Monopoly=count']);
    })]);

    // generate color for each line:
    for (let i = 0; i < colorArray[0].length; i++) {
        var lineDict = {};
        lineDict.color = colorScheme(i);
        lineArray.push(lineDict);
    }

    //////////////////////////////////////// Start Setting Axis //////////////////////////////////////////
    svg31.append('text')
        .attr('x', 50)
        .attr('y', 0)
        .text('Number of Ratings 2016-2020 with Rankings (Square root Scale)');

    // Add the X axis:
    svg31.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%b %y")))    // https://stackoverflow.com/questions/40173533/customize-the-d3-month-or-year-tick-format/40175517
    svg31.append('text')
        .attr('class', 'x label')
        .attr('x', 275)
        .attr('y', height + 40)
        .text('Month');

    // Add the Y Axis
    svg31.append("g")
        .call(d3.axisLeft(y));
    svg31.append('text')
        .attr('transform', 'rotate(270)')
        .attr('class', 'y label')
        .attr('x', -250)
        .attr('y', -50)
        .text('Num of Ratings');
    //////////////////////////////////////// End Setting Axis //////////////////////////////////////////

    // Add valueline1 to 'path' where 'valueline1' represents 'Catan'. So on and so forth:
        for (let i = 0; i < categories.length; i++) {
            var subCategories = ['Catan', 'Codenames', 'Terraforming Mars', 'Gloomhaven'];
            var lineFunction = multiLines(categories[i]);
            svg31.append("path")
              .data([data])
              .attr("class", "line")
              .style('stroke', lineArray[i].color)
              .style('fill', 'none')                // Remove shaded area
              .attr("d", lineFunction);
            if (subCategories.includes(categories[i])) {      // Add dots/circles to each line
                svg31.selectAll('myCircles')        // Add data label to circles
                    .data(data)
                    .enter()
                    .append('circle')               // A better way to concatenate the following '.attr's can be found here: https://stackoverflow.com/questions/20822466/how-to-set-multiple-attributes-with-one-value-function
                    .attr('fill', function(d, j) {
                        if (j % 3 === 2) { return lineArray[i].color; }
                    })
                    .attr('stroke', function(d, j) {
                        if (j % 3 === 2) { return 'none'; }
                    })
                    .attr('cx', function (d, j) {
                        if (j % 3 === 2) { return x(d.date); }
                    })
                    .attr('cy', function (d, j) {
                        if (j % 3 === 2) { return y(d[categories[i]+'=count']); }
                    })
                    .attr('r', function(d, j) {
                        if (j % 3 === 2) { return 10; }
                    })

                svg31.selectAll('myCircles')
                    .data(data)
                    .enter()
                    .insert('text')
                    .text(function(d, j) {          // Don't use 'i' as index here because the outer for loop is using 'i' as index already
                        if (j % 3 === 2) { return d[categories[i]+'=rank']+j; }
                    })
                    .attr("x", function(d, j) {
                        if (j % 3 === 2) { return x(d.date)-5; }
                    })
                    .attr("y", function(d, j) {
                        if (j % 3 === 2) { return y(d[categories[i]+'=count'])+3; }
                    })
                    .attr('font-size', '8px')
                    .attr('stroke', 'white')
                    .attr('font', 'sans-serif')
            }
        };

        // Use a for loop to add labels for each category:
        for (let i = 0; i < categories.length; i++){
            svg31.append('text')
                .attr('transform', 'translate(' + (width + 3) + ',' + y(data[data.length-1][categories[i]+'=count']) + ')')
                .attr('font-size', '10px')
                .attr('text-anchor', 'start')
                .style('fill', lineArray[i].color)
                .text(categories[i]);
        }

        // Finally, we'll add a legend to represent numbers in circles:
        var legend_keys = ["BoardGameGeek Rank"];
        var circleLegend = svg31.selectAll('.circleLegend')
                               .data(legend_keys)
                               .enter()
                               .append('g')
                               .attr('class', 'circleLegend')
                               .attr('font-size', '12px')
                               .attr("transform", function (d,i) {
                                   return "translate(" + (width) + "," + height + ")";
                               });
        circleLegend.append("text")
                  .text(function (d) {return d;})
                  .attr("transform", "translate(15,9)"); //align texts with boxes
        svg31.selectAll('.circleLegendIcon')        // Add data label to circles
                    .data(legend_keys)
                    .enter()
                    .append('circle')               // A better way to concatenate the following '.attr's can be found here: https://stackoverflow.com/questions/20822466/how-to-set-multiple-attributes-with-one-value-function
                    .attr('fill', 'black')
                    .attr('stroke', 'none')
                    .attr('cx', width+margin.right-120)
                    .attr('cy', height-20)
                    .attr('r', 15)
        svg31.selectAll('.circleLegendIcon')
            .data(legend_keys)
            .enter()
            .insert('text')
            .text('rank')
            .attr('stroke', 'white')
            .attr("x", width+margin.right-130)
            .attr("y", height-18)
            .attr('font-size', '12px')
            .attr('font-weight', 'lighter')
})



