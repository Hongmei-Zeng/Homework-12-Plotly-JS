function buildMetadata(sample) {


    d3.json(`/metadata/${sample}`).then( data =>{

        let metadataSelector = d3.select('#sample-metadata');

        metadataSelector.html("");

        console.log(Object.entries(data));

        Object.entries(data).forEach(([key,value]) =>{
            metadataSelector
              .append('p').text(`${key} : ${value}`)
              .append('hr')
      });

    })
}

function buildCharts(sample) {

    d3.json(`/samples/${sample}`).then( data => {

      trace1 = [
          {
            values: data.sample_values.slice(0,10),
            labels: data.otu_ids.slice(0,10),
            hovertext: data.otu_labels.slice(0,10),
            type: "pie"
          }
      ]

      let layout1 ={
          title: "Pie Chart: Top 10 Samples",
          };
    
      pieDiv = document.getElementById('pie');
      Plotly.newPlot(pieDiv, trace1, layout1)

      trace2 = [
          {
            x : data.otu_ids,
            y:  data.sample_values,
            text: data.otu_labels,
            type: 'scatter',        
            mode:'markers',
            marker:{
              size: data.sample_values,
              symbol: 'circle',
              color:data.otu_ids
            }
          }
      ]

    let layout2 ={
      title: "Bubble Chart: Samples of Otu_ids",
      };

    bubbleDiv = document.getElementById('bubble');
    Plotly.newPlot(bubbleDiv, trace2, layout2)
})
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();