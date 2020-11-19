/**
 * 
 * @param {*} filename 
 * @param {*} colorRange 
 */

function display(filename, colorRange) {
    // map will display 
    var width = 700;
    height = 700;

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
        var dataRow = countryById.get(d.properties.name);
        //console.log({"countryid": countryById});
        if (dataRow) {
            //console.log(dataRow);
            dataRow.positives = +dataRow.positives;
            return dataRow.states + ": " + dataRow.positives.toFixed(2) + "%";
        } else {
            //console.log("no dataRow", d);
            return d.properties.name + ": No data.";
        }
    });


    var svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.call(tip);

    var projection = d3.geoAlbersUsa()
        .scale(900) // mess with this if you want
        .translate([width / 2, height / 2]);

    var path = d3.geoPath()
        .projection(projection);

    var colorScale = d3.scaleLinear().range(colorRange).interpolate(d3.interpolateLab);

    var countryById = d3.map();

    // we use queue because we have 2 data files to load.
    queue()
        .defer(d3.json, "USA.json")
        .defer(d3.csv, filename, typeAndSet) // process
        .await(loaded);

    function typeAndSet(d) {
        d.positives = +d.positives;
        countryById.set(d.states, d);
        return d;
    }

    function getColor(d) {
        var dataRow = countryById.get(d.properties.name);
        if (dataRow) {
            console.log(dataRow);
            return colorScale(dataRow.positives);
        } else {
            console.log("no dataRow", d);
            return "#ccc";
        }
    }


    function loaded(error, usa, positives) {

        console.log(usa);
        console.log(positives);

        colorScale.domain(d3.extent(positives, function(d) {return d.positives;}));

        var states = topojson.feature(usa, usa.objects.units).features;

        svg.selectAll('path.states')
            .data(states)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on('click', function (d, i) {
                updateChart(d.properties.name);
            })
            .attr('fill', function(d,i) {
                console.log(d.properties.name);
                return getColor(d);
            })
            .append("title");

        var linear = colorScale;

        svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");

        var legendLinear = d3.legendColor()
        .shapeWidth(30)
        .orient('horizontal')
        .scale(linear);

        svg.select(".legendLinear")
        .call(legendLinear);

    }

    
}