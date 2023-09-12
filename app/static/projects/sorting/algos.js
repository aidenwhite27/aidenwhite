const sleep = ms => new Promise(r => setTimeout(r, ms));

async function selectionSort(svg, data){
    x = svg.x
    var currSpeed = 1000 - document.getElementById('speed').value

    document.getElementById("speed").addEventListener("change", function(){
        currSpeed = 1000 - this.value;
    })

    for(let i=0; i < data.length; i++){
        let min = i
        for(let j=i+1; j < data.length; j++){
            if(data[j] < data[min]){
                min = j
            }
        }

        svg.select(`.index${min}`)
        .attr("fill", "lightgreen")
            .transition()
            .duration(currSpeed)
            .attr("x", x(i))

        if(i!==min){
            let temp = data[i]
            data[i] = data[min]
            data[min] = temp

            svg.select(`.index${i}`)
            .attr("fill", "red")
                .transition()
                .duration(currSpeed)
                .attr("x", x(min))

            await sleep(currSpeed)

            svg.select(`.index${i}`)
                .attr("fill", "blue")

            svg.select(`.index${min}`)
                .attr("class", `index-1`)

            svg.select(`.index${i}`)
                .attr("class", `index${min}`)

            svg.select(`.index-1`)
                .attr("class", `index${i}`)

        }
    }
}

async function bubbleSort(svg, data){
    x = svg.x
    y = svg.y
    var margin = {top: 10, right: 30, bottom: 90, left: 40},
    height = 450 - margin.top - margin.bottom;
    
    let currSpeed = 1000 - document.getElementById('speed').value

    document.getElementById("speed").addEventListener("change", function(){
        currSpeed = 1000 - this.value;
    })

    var i, j
    var len = data.length
    var swapped = false;
    for(i=0; i < len; i++){
        
        swapped = false;
        for(j=0;j<len;j++){
            if(data[j]>data[j+1]){
                var temp = data[j]
                data[j] = data[j+1]
                data[j+1] = temp
                swapped=true;

                svg.select(`.index${j}`)
                    .transition()
                    .duration(currSpeed)
                    .attr("x", x(j+1))
                    .attr("fill", "lightgreen")

                svg.select(`.index${j+1}`)
                    .transition()
                    .duration(currSpeed)
                    .attr("x", x(j))
                    .attr("fill", "lightgreen")
            }
        }

        await sleep(currSpeed)

        svg.selectAll("rect")
            .remove()

        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
                .attr("x", function(d, i) { return x(i); })
                .attr("class", function(d, i) { return `index${i}`; })
                .attr("width", x.bandwidth())
                .attr("fill", "blue")

        svg.selectAll("rect")
            .attr("y", function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); })

        if (!swapped){
            break
        }
    }
}

async function insertionSort(svg, data){ 
    x = svg.x;  
    let currSpeed = 1000 - document.getElementById('speed').value

    document.getElementById("speed").addEventListener("change", function(){
        currSpeed = 1000 - this.value;
    })

    var key = 0
    var j = 0
    for(let i=1;i<data.length;i++){
        key = data[i]
        j = i - 1

        svg.select(`.index${i}`)
            .attr("class", 'index-1')

        while((j >= 0) && (key < data[j])){
            svg.select(`.index${j}`)
                .attr("class", `index${j+1}`)
                .transition()
                .duration(currSpeed)
                .attr("x", x(j+1))

            data[j + 1] = data[j]
            j = j - 1
        }
        data[j + 1] = key

        svg.select('.index-1')
            .attr("class", `index${j+1}`)
            .attr("fill", "lightgreen")
                .transition()
                .duration(currSpeed)
                .attr("x", x(j+1))

        await sleep(currSpeed);

        svg.select(`.index${j+1}`)
            .attr("fill", "blue")
    }
}

async function merge(svg, data, l, m, r){
    x = svg.x
    let currSpeed = 1000 - document.getElementById('speed').value

    document.getElementById("speed").addEventListener("change", function(){
        currSpeed = 1000 - this.value;
    })

    var n1 = m - l + 1;
    var n2 = r - m;

    var L = new Array(n1);
    var R = new Array(n2);

    for(let i=0; i < n1; i++){
        L[i] = data[l + i];
    }
    for(let j=0; j < n2; j++){
        R[j] = data[m + 1 + j];
    }

    var i = 0;
    var j = 0;
    var k = l;

    while (i < n1 && j < n2){
        if (L[i] < R[j]){
            data[k] = L[i];

            svg.select(`.index${l+i}`)
                .attr("fill", "lightgreen")

            i++;
        } else {
            data[k] = R[j];

            svg.select(`.index${m+j}`)
                .attr("fill", "lightgreen")

            j++;
        }
        k++;
    }

    while(i < n1){
        data[k] = L[i];

        svg.select(`.index${l+i}`)
            .attr("fill", "lightgreen")

        i++;
        k++;
    }

    while(j < n2){
        data[k] = R[j];

        svg.select(`.index${m+j}`)
            .attr("fill", "lightgreen")

        j++;
        k++;
    }
    await sleep(currSpeed)
}

async function mergeSort(svg, data, l, r){
    x = svg.x
    y = svg.y
    let currSpeed = 1000 - document.getElementById('speed').value

    document.getElementById("speed").addEventListener("change", function(){
        currSpeed = 1000 - this.value;
    })

    var margin = {top: 10, right: 30, bottom: 90, left: 40},
    height = 450 - margin.top - margin.bottom;

    if(l>=r){
        return;
    }

    var m = l + Math.floor((r-l) /2);
    await mergeSort(svg, data, l, m);
    await mergeSort(svg, data, m+1, r);
    await merge(svg, data, l, m, r);

    svg.selectAll("rect")
        .remove()

    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", function(d, i) { return x(i); })
        .attr("class", function(d, i) { return `index${i}`; })
        .attr("width", x.bandwidth())
        .attr("fill", "blue")

    svg.selectAll("rect")
    .attr("y", function(d) { return y(d); })
    .attr("height", function(d) { return height - y(d); })
}