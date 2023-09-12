function init(){
    document.getElementById("reset-button").addEventListener("click", function(){
        draw(document.getElementById('algos').value)
    })

    document.getElementById("algos").addEventListener("change", function(){
        draw(document.getElementById('algos').value)
    })
    draw("selection");
}

function draw(algo){

    d3.selectAll("svg").remove();

    // Create randomized array
    var data = Array.from({length: 100}, () => Math.floor(Math.random() * 99) + 1);

    document.getElementById("values").addEventListener("change", function(){
        data = Array.from({length: this.value}, () => Math.floor(Math.random() * 99) + 1);
        d3.selectAll("svg").remove();
        createGraph(data);
    })

    function createGraph(data){
        var speed = 1000 - document.getElementById('speed').value
        var values = document.getElementById("values").value;

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 90, left: 40},
            width = 460 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;
        
        // append the svg object to the body of the page
        var svg = d3.select("#barchart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(function(d, i) { return i; }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
        
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 110])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
        svg.x = x;
        svg.y = y;

        // Bars
        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d, i) { return x(i); })
                .attr("class", function(d, i) { return `index${i}`; })
                .attr("width", x.bandwidth())
                .attr("fill", "blue")
        
        // Animation
        svg.selectAll("rect")
            .attr("y", function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); })

        svg.selectAll(".tick")
            .remove()

        if (algo=="selection"){
            selectionSort(svg, data);
        } else if(algo=="bubble"){
            bubbleSort(svg, data);
        } else if(algo=="insertion"){
            insertionSort(svg, data);
        } else if(algo=="merge"){
            mergeSort(svg, data, 0, data.length - 1)
        }
    }
    createGraph(data);
}