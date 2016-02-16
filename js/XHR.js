function getData(url, func) {
    var http = new XMLHttpRequest();
    http.open('GET', url);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var jsonResp = {};
            try {
                jsonResp = JSON.parse(this.responseText);
            } catch (e) {
            }
            func(jsonResp);
        }
    };
    http.send(null);
}