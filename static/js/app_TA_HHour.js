// Function to build Metadata
function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;

        // filter data to get the object (test subject ID No:) 
        var sampleObject = metadata.filter(sampleObject => sampleObject.id == sample);
        var sampleResult = sampleObject[0];
        console.log(sampleObject);

        var Panel = d3.select("#sample-metadata");

        // Clear out the Panel
        Panel.html("");

        // Use Object entries to get each key value and add to pulldown menu
        Object.entries(sampleResult).forEach(([key, value]) => {
            Panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
            // console.log(key, value);
        });

    });
}

// Function to build Charts

// Function to build Bar Chart
//Plotly.newPlot("bar", barData, barLayout);


// Bubble Chart
//Plotly.newPlot("bubble", bubbleData, bubbleLayout);


// Bonus: Freq. gauge


// Event Listner - Create an event listner function
// This function is already referenced in the index.html file provided as optionChanged
function optionChanged(nextSample) {
    // get the data for the sample selected in the "selector"
    buildMetadata(nextSample);    
    // buildCharts(nextSample);
}


// Function for initalization

function init() {
    // Get a reference to dropdown selector in the "Test Subject ID No"
    var selector = d3.select("#selDataset");

    //  Create a dropdown menu with all the samples ids
    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        console.log(sampleNames);

        // Use forEach to append text for each sample
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Create a variable for the first sample
        // Use the first sample to build the inital plots and Metadata (demographic Info)
        var firstSample = sampleNames[0];
        console.log(firstSample);
        buildMetadata(firstSample);
        // buildCharts(firstSample);
    });
}


// Call init function
init();