let view = 0; // dynamic
let state = document.getElementById("state");
let symptom = document.getElementById("symptom");
document.getElementById("select-state").addEventListener('click', function() {
    if (view == 0)
        return;
    view = 1-view;
    symptom.style.display = "none";
    state.style.display = "block";
});

document.getElementById("select-symptom").addEventListener('click', function() {
    if (view == 1)
        return;
    view = 1-view;
    state.style.display = "none";
    symptom.style.display = "block";
});

const gender = {
    "overall": document.querySelector("#overall"),
    "female": document.querySelector("#female"),
    "male": document.querySelector("#male")
};

const age = {
    "18": document.querySelector("#a18"),
    "35": document.querySelector("#a35"),
    "55": document.querySelector("#a55")
};

const alterGender = {
    'overall': 'all people',
    'female': 'women',
    'male': 'men'
}

const ageGroups = {
    '18': '18-34',
    '35': '35-54',
    '55': '55+'
}

function getGender() {
    if (gender["overall"].checked) {
        return "overall";
    } else if (gender["female"].checked) {
        return "female";
    } else if (gender["male"].checked) {
        return "male";
    }

}

function getAge() {
    if (age["18"].checked) {
        return "18";
    } else if (age["35"].checked) {
        return "35";
    } else if (age["55"].checked) {
        return "55";
    }
}

document.querySelector("#vizBtn").addEventListener("click", function() {

    console.log("calling viz btn");
    document.getElementById("map").innerHTML = "";
    let filename;
    filename = 'data/' + getGender() + '-' + getAge() + '.csv';
    console.log({"filename is": filename});

    updateChart();
    display(filename, ["#D4EEFF", "#0099FF"]);
});

let ctx = document.getElementById("line").getContext('2d');
window.lineChart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: '% of ' + alterGender[getGender()] + ' aged ' + ageGroups[getAge()] + ' with CLI',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 0, 0, 0, 0, 0, 0]
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
});

function updateChart(state) {
    state = (state === undefined)?'California':state;
    let statecode = state2code[state].toLowerCase();
    let genderAge = getGender() + 'x' + ageGroups[getAge()]; // not using ageOverall
    console.log({
        "state": state2code[state].toLowerCase(),
        "gender": getGender(),
        "age": getAge()
    });
    document.getElementById('line-heading').innerHTML = "CLI vs Time "+state;
    window.lineChart.data.labels = lineData[statecode][genderAge]["x"]
    window.lineChart.data.datasets[0].data = lineData[statecode][genderAge]["y"];
    window.lineChart.data.datasets[0].label = '% of ' + alterGender[getGender()] + ' aged ' + ageGroups[getAge()] + ' with CLI';
    window.lineChart.update();
}


// piechart

/*pct_cmnty_cli_weighted,27.204078332267446
pct_self_anosmia_ageusia_weighted,17.298176850049597
pct_hh_cli_weighted,11.0190991041172
pct_hh_fever_weighted,9.997975407079766
pct_self_fever_weighted,7.992612440262463*/

window.pieChrart = new Chart(document.getElementById("piechart").getContext("2d"), {
    data: {
        datasets: [{
            data: [
                27.20,
                17.29,
                11.019,
                9.99,
                7.99
            ],
            backgroundColor: [
                "#FF63847F",
                "#4BC0C07F",
                "#FFCE567F",
                "#E7E9ED7F",
                "#36A2EB7F"
            ],
            label: 'f-statistic %' // for legend
        }],
        labels: [
            "Difficulty Breathing ",
            "Anosmia & Ageusia",
            "COVID like Illness",
            "Nausea",
            "Fever",
        ]
    },
    type: 'polarArea',
    options: {}
});

const correlationGraphProps = {
    selector: '.graph-container',
    data,
    options: {
      fixedNodeSize: true
    }
  }
  window.correlationGraph(correlationGraphProps);
  //
  // draw pictogram table
  //
