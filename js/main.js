// initialize the map, and remove the zoom control
var mymap = L.map('map', {
    zoomControl: false
}).setView([38.9698612, -77.0876517], 12);

// display the coordinate system code on the console
console.log("map crs: " + mymap.options.crs.code);

// add tile layer with OSM tiles: https://switch2osm.org/using-tiles/getting-started-with-leaflet/
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 19
}).addTo(mymap);

// style geojson features
function style(feature) {
    if (corridorFeature) {
        return {
            fillColor: '#800080',
            weight: 4,
            opacity: 1,
            color: '#800080',
            fillOpacity: 0.07
        };
    }
    if (purpleLine) {
        return {
            color: '#800080',
        };
    }
}
// style geojson marker features
var geojsonMarkerOptions = {
    radius: 6,
    fillColor: '#800080',
    color: '#800080',
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

// add purple line stations to map
L.geoJson(purpleLineStations, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);


// add purple line and corridor boundary to map
L.geoJSON(purpleLine, { style: style }).addTo(mymap);
L.geoJSON(corridorFeature, { style: style }).addTo(mymap);


// function to toggle between the query and insert forms
// could this be done more concisely with a for loop?
function toggleFunction() {

    // assign variables for each form div
    introDiv = document.getElementById("introDiv");
    queryDiv = document.getElementById("queryDiv");
    analysisDiv = document.getElementById("analysisDiv");


    // assign variables for each button
    displayIntro = document.getElementById("displayIntro");
    displayQuery = document.getElementById("displayQuery");
    displayAnalysis = document.getElementById("displayAnalysis");

    // conditional checks which button button is checked
    if (displayIntro.checked) {
        // set the form div display property
        introDiv.style.display = "block";
        analysisDiv.style.display = "none";
        queryDiv.style.display = "none";
        // set the active button
        displayIntro.setAttribute("active", "active");
        displayAnalysis.removeAttribute("active");
        displayQuery.removeAttribute("active");
    };


    if (displayQuery.checked) {
        // set the form div display property
        queryDiv.style.display = "block";
        analysisDiv.style.display = "none";
        introDiv.style.display = "none";
        // set the active button
        displayQuery.setAttribute("active", "active");
        displayAnalysis.removeAttribute("active");
        displayIntro.removeAttribute("active");
    };

    if (displayAnalysis.checked) {
        // set the form div display property
        analysisDiv.style.display = "block";
        queryDiv.style.display = "none";
        introDiv.style.display = "none";
        // set the active button
        displayAnalysis.setAttribute("active", "active");
        displayQuery.removeAttribute("active");
        displayIntro.removeAttribute("active");

    };

}


// when a user changes the table name in the select list, this function sends a request
// to the database to get the column names for the selected table and display them as
// checkboxes in the queryDiv
function db_request() {

    // clear the columns from the previous table selection
    columnsElement = document.getElementById("columns");
    columnsElement.innerHTML = ''

    // create the XMLHttpRequest object
    var xhttp = new XMLHttpRequest();

    // bind the FormData object to the table selection
    var formData = new FormData(document.getElementById("form"));

    // if the request is successful, process the results of the query into an array, 
    // and add the elements of the array as checkboxes to the queryDiv
    xhttp.addEventListener("load", function(event) {

        console.log("Response text: " + event.target.responseText);
        var columnsList = JSON.parse(event.target.responseText);

        console.log(columnsList);

        // initialize the variable for iterating through the column name array
        var column;

        // create a for-of loop to loop through the column names
        for (column of columnsList) {
            // create a wrapper div for the checkbox
            var formCheck = document.createElement("div");
            formCheck.className = "form-check";
            // add the wrapper into the correct div as a child element
            columnsElement.appendChild(formCheck);
            // create an input element and set the correct attributes based on the column name
            var input = document.createElement("input");
            input.className = "form-check-input";
            input.id = column[3]
            input.setAttribute("type", "radio");
            input.setAttribute("value", column[3]);
            // create a label element and set the correct attributes based on the column name
            var label = document.createElement("label");
            label.className = "form-check-label";
            label.setAttribute("for", column[3]);
            label.innerHTML = column[3];
            // add the input and label elements as children of the wrapper
            formCheck.appendChild(input);
            formCheck.appendChild(label);
        }
    })

    // if the request is unsuccessful, print error text to console, and an error message
    // to the queryDiv
    xhttp.addEventListener("error", function(event) {
        console.log("Error text: " + event.target.responseText);
        columnsElement.innerHTML = "<p>Oops! Looks like something went wrong.</p>";
    })

    // send the request to postgres
    xhttp.open("POST", "./php/columns.php");
    xhttp.send(formData);
}

// add UI elements to add another portion to the query
// function addQuery() {
//     var queryBuiler = document.getElementById("query-builder");

//     var newQuerySection = document.createElement("div");
//     var newTable = document.createElement("div");
//     newTable.className = "form-group";
//     var newLabel = document.createElement("label");
//     newLabel.setAttribute("for", "table");
//     var newSelect = document.createElement("select");
//     newSelect.className = "form-control";
//     // this is going to cause issues with post - two elements with name "table"
//     newSelect.setAttribute("name", "table");
//     newSelect.setAttribute("onchange", "db_request()");


//     newTable.appendChild(newLabel);
//     newTable.appendChild(newSelect);
//     newQuerySection.appendChild(newTable);

//     var options = ["option1", "option2"];
//     var option = ""
//     for (option of options) {
//         newSelect.innerHTML = "<option value='" + option + "'>" + option + "</option>";
//     }

// }