var loadJsonFromFile = function (filename) {
    let fr = new FileReader();
    let fileObj = new File()
    var jsonData = {};
    fr.onload = function (e) {
        let lines = e.target.result;
        jsonData = JSON.parse(lines);
    }
    fr.readAsText(filename);
    return jsonData;
}

var saveJsonToFile = function (filename, jsonData) {
    // let fr = new FileWriter();

    // var jsonData = {};
    // fr.onload = function (e) {
    //     let lines = e.target.result;
    //     jsonData = JSON.parse(lines);
    // }
    // fr.readAsText(filename);
    // return jsonData;
    return 0;
}