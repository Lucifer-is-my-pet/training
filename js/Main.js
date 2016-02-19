function main () { // reactOnHashChange
    var hash = location.hash.substr(1);
    addDataToDiv(getUrl());

    var links = document.querySelectorAll('.link');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        link.style.fontWeight = '';
        link.onclick = null;

        if (link.getAttribute('href').substr(1) == hash) {
            link.style.fontWeight = 'bold';
            link.onclick = main;
        }
    }
}

function addDataToDiv (url) {
    getData(url, function(json) {
        var jsonData = json['Data'] || '';
        getById('addData').innerHTML = jsonData;
        if (jsonData != '') {
            getById('addData').innerHTML +=
                '<br><a id="change" href="/">Изменить</a>';
            getById('change').onclick = reactOnDataChange;
        }
    });
}

function reactOnDataChange (event) {
    event.preventDefault();
    var newDialog = createDialog({Title: 'Изменить', OkEvent: getInput});
}

function getInput(event) {
    var dialog = event.target.closest('.dialog');
    var newData = dialog.querySelector('input').value;
    if (newData) {
        var url = getUrl() + '&value=' + encodeURIComponent(newData);
        getData(url, function (json) {
            if (json['Result'] == 'OK') {
                main();
            }
        });
    }
    destroyDialog(dialog);
}

//вспомогательные функции
function getUrl () {
    return 'http://78.47.75.106/e/test&par=' + location.hash.substr(1);
}

onhashchange = main;