// Function to initialize page w data
function initializePage(samplesData) {
    // Get reference to the select element
    var select = d3.select("#selDataset");

    // Loop through names array & add options
    samplesData.names.forEach(function (name) {
        select.append("option")
            .attr("value", name)
            .text(name);
    });

    // Call a function to update plots based on selected ID
    optionChanged(samplesData.names[0]);
}

// Function to update all the plots
function optionChanged(selectedID) {
    // Use the selectedID to get the data for the selected subject
    var selectedSubjectData = samplesData.samples.find(sample => sample.id === selectedID);

    // Extract the necessary data for the bar chart
    var sampleValues = selectedSubjectData.sample_values.slice(0, 10); // Get top 10 values
    var otuIds = selectedSubjectData.otu_ids.slice(0, 10); // Get top 10 IDs
    var otuLabels = selectedSubjectData.otu_labels.slice(0, 10); // Get top 10 labels

    // Create horiz. bar chart --> use Plotly
    var trace = {
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    var data = [trace];

    var layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", data, layout);

    // Update bubble chart
    var otuIdsBubble = selectedSubjectData.otu_ids;
    var sampleValuesBubble = selectedSubjectData.sample_values;
    var otuLabelsBubble = selectedSubjectData.otu_labels;
    var traceBubble = {
        x: otuIdsBubble,
        y: sampleValuesBubble,
        text: otuLabelsBubble,
        mode: 'markers',
        marker: {
            size: sampleValuesBubble,
            color: otuIdsBubble,
            colorscale: 'Viridis'
        }
    };

    var dataBubble = [traceBubble];

    var layoutBubble = {
        title: "Sample OTUs",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", dataBubble, layoutBubble);

    // Update sample metadata
    var selectedMetadata = samplesData.metadata.find(meta => meta.id === parseInt(selectedID));
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); // Clear previous content
    Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Initial data loading and setup
var samplesData;

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
    // Store the data in a variable
    samplesData = data;
    // Call a function to initialize the page with data
    initializePage(samplesData);
});
