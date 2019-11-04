$(document).ready(function () {


    let Config = {
        apiKey: "AIzaSyAjZuz_pY4bX7oLy3ARNJBcKRLyrmkZQF8",
        authDomain: "train-scheduler-6db8e.firebaseapp.com",
        databaseURL: "https://train-scheduler-6db8e.firebaseio.com",
        projectId: "train-scheduler-6db8e",
        storageBucket: "train-scheduler-6db8e.appspot.com",
        messagingSenderId: "309456598009"
    };
    firebase.initializeApp(Config);
    let database = firebase.database();
    let trainFrequency = 0;
    let clickCounter = 1;


    $("#add-train").on("click", function (event) {
        event.preventDefault();

        if ($("#train-input").val(), $("#destination-input").val(), $("#time-input").val(), $("#frequency-input").val() === "") {
            alert("You must fill out all forms!.");
        } else if ($("#time-input").val() > 24) {
            alert("Military time PLEASE!");
        } else {
            let trainName = $("#train-input").val().trim();
            let trainDestination = $("#destination-input").val().trim();
            let trainTime = $("#time-input").val().trim();
            let trainFrequency = $("#frequency-input").val().trim();
            console.log(trainName);
            console.log(trainDestination);
            console.log(trainTime);
            console.log(trainFrequency)


            let trainDetail = {
                name: trainName,
                destination: trainDestination,
                frequency: trainFrequency,
                time: trainTime
            };
            toggle_modal(trainDetail)
        }
    });

    function toggle_modal(train_object) {
        $("#modal").modal();
        $(".modal-body p").text(`Train Name: ${train_object.name}A NEW TRAIN WILL BE SAVED! click close after SAVE`)
    }

    $("#save_button").on("click", function (event) {
        let m = {
            name: $("#train-input").val().trim(),
            destination: $("#destination-input").val().trim(),
            frequency: $("#frequency-input").val().trim(),
            time: $("#frequency-input").val().trim()
        }
        console.log("Input Values");

        database.ref().push(m);
        $("#modal").modal();

        console.log("Temporary object train values");
        //Alerts
        //alert("A new train details has been added..");
        $("#train-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    });


    $("#cancel").on("click", () => {
        $("#train-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");

    })



    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());


        let trainNumber = clickCounter++;
        let trainName = childSnapshot.val().name;
        let trainDestination = childSnapshot.val().destination;
        let trainTime = childSnapshot.val().time;
        let trainFrequency = childSnapshot.val().frequency;

        console.log("database train value");
        console.log(trainName);
        console.log(trainDestination);
        console.log(trainTime);
        console.log(trainFrequency);

        let trainTimeConvert = moment(trainTime, "HH:mm").subtract(1, "years");
        console.log("trainTimeConvert", +trainTimeConvert);

        let diffTime = moment().diff(trainTimeConvert, "minutes");
        console.log(diffTime);

        let remainder = diffTime % trainFrequency;
        console.log("Remainder: " + remainder);


        let timeRemain = trainFrequency - remainder;
        console.log("Time Remain: " + timeRemain);

        let newTrainTime = moment().add(timeRemain, "minutes");
        let newTrainTimeFormat = moment(newTrainTime).format("HH:mm");


        let row = $(("<tr class = 'tableRow'><td>" + trainNumber + "</td><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainTime + "</td><td>" + trainFrequency + "</td><td>" + newTrainTimeFormat + "</td><td>" + timeRemain + "</td></tr>"));


        $(".tableBody").append(row);
    });
});