function createDialog (json) {
    if (!json) {
        json = {};
    }
    var title = json['Title'] || 'Диалог';
    var content = json['Content'] || 'Введите текст';
    var okCallback = json['OkEvent'];
    var cancelCallback = json['CancelEvent'];
    var dialogWindow = document.createElement('div');
    dialogWindow.className = 'dialog';
    var html = <<HTML;
<div class='title'>$title</div>
<div class='content'>
    <span class='text-content'>$content</span>
    <input type='text'>
    <div class='button-panel'>
        <button class='ok' type='submit'>OK</button>
        <button class='cancel'>Cancel</button>
    </div>
</div>
HTML
    dialogWindow.innerHTML = html;
    var buttons = dialogWindow.querySelectorAll('button');
    if (okCallback) {
        buttons[0].onclick = okCallback;
    } else {
        buttons[0].onclick = function() { destroyDialog(dialogWindow) };
    }
    if (cancelCallback) {
        buttons[1].onclick = cancelCallback;
    } else {
        var cancelButton = dialogWindow.querySelector('.cancel');
        cancelButton.parentNode.removeChild(cancelButton);
    }

    document.body.appendChild(dialogWindow);
    dialogWindow.style.left = (window.innerWidth - dialogWindow.clientWidth) / 2 + 'px';
    dialogWindow.style.top = (window.innerHeight - dialogWindow.clientHeight) / 2 + 'px';

    //TODO координаты угла, координаты курсора. сменились у курсора — вычисляем у угла
    var clicked = false;
    var shiftX = 0;
    var shiftY = 0;
    document.querySelector('.title').onmousedown = function (event) {
        if (event.which != 1) {
            return;
        }
        var coordinates = getCoordinates(dialogWindow);
        shiftX = event.pageX - coordinates.left;
        shiftY = event.pageY - coordinates.top;

        clicked = true;
    };
    document.onmousemove = function (event) {
        if (clicked) {
            dialogWindow.style.left = event.pageX - shiftX + 'px';
            dialogWindow.style.top = event.pageY - shiftY + 'px';
        }
    };
    document.onmouseup = function () {
        if (clicked) {
            clicked = false;
        }
    };

    return dialogWindow;
}

function destroyDialog (dialog) {
    dialog.parentNode.removeChild(dialog);
}

// вспомогательные функции
function formatString (patternString) {
    var result = patternString;
    for (var i = 1; i < arguments.length; i++) {
        result = result.replace(/\?/, arguments[i]);
    }
    return result;
}

function getCoordinates(elem) {
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}