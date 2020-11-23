// Build metadata using the samaples.json file
function buildMetadata(sample) {
    d3.json("/data/samples.json").then((data) => {
        var metadata = data.metadata;

        // filter the data to get the object for the selected sample number
        var sampleResultArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var sampleResult = sampleResultArray[0];
        console.log(sampleResult);

        /* Use D3 to select the panel with the id of 'sample-metadata'
           Note index.html is storing the sample-metadata in Bootstrap 3.3 container called
           a Panel.
        */
        var Panel = d3.select("#sample-metadata");

        // Clear any existing contents of the panel using html("")
        Panel.html("");

        /*  Use Object.entries to get each key value pair and add to the Panel
            by appending new tags for each key value pair in the metadata
        */
        Object.entries(sampleResult).forEach(([key, value]) => {
            Panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
            console.log(key, value);
        });
    });
}

// Create function to build charts
function buildCharts(sample) {

    // Get data from samples.json
    d3.json("/data/samples.json").then((data) => {
        var samples = data.samples;
        var sampleResultsArray = samples.filter(sampleObject => sampleObject.id == sample);
        var sampleResults = sampleResultsArray[0];
        console.log(sampleResults);

        // Use sample_values as the values for the bar chart.
        var sample_values = sampleResults.sample_values;
        // Use otu_ids as the labels for the bar chart.    
        var otu_ids = sampleResults.otu_ids;
        // Use otu_labels as the hovertext for the chart.
        var otu_labels = sampleResults.otu_labels;

        // Build a horizontal bar chart

        // get the top ten otu_ids (in descending order) using reverse
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var barData = [{
            // get the top ten values sorted in desending order (reverse)
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),            
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 Bateria Cultures Found",
            margin: { t: 40, l: 140 }
        };
        // Plot bar chart
        Plotly.newPlot("bar", barData, barLayout);

        // Build bubble chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            title: "Bateria Cultures Per Sample",
            margin: { t: 10 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 25 }
        };
        // Plot bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Build gauge
        var data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: 450,
              title: { text: "Speed" },
              type: "indicator",
              mode: "gauge+number",
              delta: { reference: 400 },
              gauge: { axis: { range: [null, 500] } }
            }
          ];
          
          var layout = { width: 600, height: 400 };
          Plotly.newPlot('gauge', data, layout);       
    });
}

// Create an init funciton to inialize the page
function init() {
    // Get reference to dropdown selector element on index.html
    var selector = d3.select("#selDataset");

    // Populate the select option with list of sample names
    d3.json("/data/samples.json").then((data) => {
        var sampleNames = data.names;

        // Use forEach to append text for each sample
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // build the inial plot with the first sample from the list
        var firstSample = sampleNames[0];
        console.log(firstSample);
        buildMetadata(firstSample);
        buildCharts(firstSample);
    });
}

//  Initalize the page
init();
