
function demoInfo(sample)
{
    console.log(sample);
    
    // use d3.json inorder to get the data
     d3.json("samples.json").then((data) => {
        // grab all of the metadata
        let metaData = data.metadata;
         //console.log (metaData);

        // filter based on the value of the sample ( should return 1 result based on the dataset)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
       // console.log(result);

       // access index 0 from the array
        let resultData = result[0];
       // console.log(resultData);

        // clear the meta data out 
        d3.select( "#sample-metadata").html(""); // clears the HTML out


        // use object.entries  to get  the value key pairs 
        Object.entries(resultData).forEach(([key, value]) =>{
           // add to the sample data/ demographics section

            d3.select( "#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
              

        });

    });
}

// function that builds the bar chart 
function Barchart(sample)
{
   

    // use d3.json inorder to get the data
    d3.json("samples.json").then((data) => {
        // grab all of the samples
        let sampleData = data.samples;
        
        // filter based on the value of the sample ( should return 1 result based on the dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        
       // access index 0 from the array
        let resultData = result[0];
    

        //get the otu_ids, labels and sample values 

        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
       
        // make a bar chart 
        // get the y axis 
        let YT = otu_ids.slice (0,10).map(id => `OTU${id}`);
        let XV =sample_values.slice(0,10);
        let Labels = otu_labels.slice(0,10);

       let Bchart = {
           y: YT.reverse(),
           x: XV.reverse(),
           text: Labels.reverse(),
           type: "bar",
           orientation:"h"

       };
       let layout = {
           title: "Top 10 Belly Button Bacteria"
       };

       Plotly.newPlot("bar",[Bchart], layout);
      
    });
}

// Building bubble chart: 

function bubbleChart(sample) 
{
     
    // use d3.json inorder to get the data
    d3.json("samples.json").then((data) => {
        // grab all of the samples
        let sampleData = data.samples;
        
        // filter based on the value of the sample ( should return 1 result based on the dataset)
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        
       // access index 0 from the array
        let resultData = result[0];
    

        //get the otu_ids, labels and sample values 

        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
       
       // build bubblechart:

       let bubbleChart = {
           y: sample_values,
           x: otu_ids,
           text: otu_labels,
           mode: "markers",
           marker: {
               size: sample_values,
               color: otu_ids,
               colorscale: "RdBu"
           }

       };
       let layout = {
           title: "Bacteria Cultures Per Sample",
           hovermode: "closest",
           xaxis: {title: "OTU ID"}
       };

       Plotly.newPlot("bubble",[bubbleChart], layout);
      
    });
    

}
    // Build Gauge Chart: 

   function GaugeChart(sample){
        // use d3.json inorder to get the data
     d3.json("samples.json").then((data) => {
        // grab all of the metadata
        let metaData = data.metadata;
         //console.log (metaData);

        // filter based on the value of the sample ( should return 1 result based on the dataset)
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
       // console.log(result);

       // access index 0 from the array
        let resultData = result[0];
        console.log(resultData);

        // clear the meta data out 
        var data = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: resultData.wfreq,
              title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 2, tickcolor: "darkblue", },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: '#F0ECDB' },
                  { range: [1, 2], color: '#FAFAD1'},
                  { range: [2, 3], color: '#FAF3D1'},
                  { range: [3, 4], color: '#EBEBAD'},
                  { range: [4, 5], color: '#E0E085'},
                  { range: [5, 6], color: '#F0F075'},
                  { range: [6, 7], color: '#D9D926'},
                  { range: [7, 8], color: '#ADAD1F'},
                  { range: [8, 9], color: '#9CB814'},
                ],
                threshold: {
                  line: { color: "red", width: 4 },
                  thickness: 0.75,
                  value: 490
                }
              }
            }
          ];
          
          var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "lavender",
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot('gauge', data, layout);
          
        

    });
   }


    



// function that initialize the dashboard
function initialize()
{

   
    
    // access  the d"ropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // use d3.json inorder to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; //  made an array of just the names 

        // use a foreach in order to create options for each sample in the 
        //selector
        sampleNames.forEach((sample) => {

            select.append ("option")
            .text(sample)
            .property("value",sample);

            
        });

        // when initialized, pass in the information for the first sample 

        let sample1 = sampleNames[0];
    
        // call the function to build:metadata,barchart, bubble chart
        demoInfo(sample1);
        //Bar
        Barchart(sample1);
        //bubble
        bubbleChart(sample1);
        // gauge
        GaugeChart(sample1);




    });
    
}

// function that updates the dashboard
function optionChanged(item)
{
    //call the update to the metadata
    demoInfo(item);
    // call function to build the bar chart
    Barchart(item);
    // bubble 
    bubbleChart(item);
    //gauge
    GaugeChart(item);
}
// call the initialize function
    initialize();