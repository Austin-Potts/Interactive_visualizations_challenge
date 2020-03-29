//function to read json and collect data to fill demographics panel
function gatherData(id) {
        // read the json file to get data
        d3.json("samples.json").then((data)=> {
            
            // get the metadata info for the demographic panel
            var metadata = data.metadata;

            // filter metadata by id
            var id_data = metadata.filter(meta => meta.id.toString() === id)[0];

            // selecting demographic panel which will be appended later
            var demoPanel = d3.select("#sample-metadata");
            
            // Clear the demographic panel after new id is selected
            demoPanel.html("");

            // grab demographic data for each id and append to the demographic panel when selected i[0] is the key, i[1] is the value.
            Object.entries(id_data).forEach((i) => {   
                    demoPanel.append("h4").text(i[0] + ": " + i[1] + "\n");
            });
    });}

    // Function to create bar, gauge, and bubble chart
function createPlots(id) {
    // getting data from the json file
    d3.json("samples.json").then((data)=> {

        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        // Slicing top 10 sample values from the sample data 
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
  
        // Slicing top 10 OTU ids for the horizontal bar plot 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Mapping OTU_top values to an array of the top 10 in the format 'OTU ####'
        var OTU_id = OTU_top.map(d => "OTU " + d)

        // get the top 10 labels for the plot
        var OTU_labels = samples.otu_labels.slice(0, 10);

        // create trace variable for the bar plot
        var trace_1 = {
            x: sampleValues,
            y: OTU_id,
            text: OTU_labels,
            marker: {
              color: 'lightblue'},
            type:"bar",
            orientation: "h"
        };
  
        // create layout variable to set plots layout
        var layout = {
            title: "OTU Frequency",
            margin: {
                left: 100,
                right: 100,
                top: 100,
                bottom: 30
            }};
  
        // create the bar plot
        var data = [trace_1];
        Plotly.newPlot("bar", data, layout);
        
        // The bubble chart
        var trace_2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: "Viridis"
            },
            text: samples.otu_labels
        };
  
        // set the layout for the bubble plot
        var bubbles_layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // create the bubble plot
        var data_1 = [trace_2];
        Plotly.newPlot("bubble", data_1, bubbles_layout); 
      });
    }  

// function for passing initial data into dropdown menu
function init() {
    // select dropdown menu using d3
    var dropdown = d3.select("#selDataset");

    // read in the json data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // passes id data into dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        createPlots(data.names[0]);
        gatherData(data.names[0]);
        });
    }
    // Function to update the page when new id is selected
function optionChanged(id) {
        createPlots(id);
        gatherData(id);
    }

init();