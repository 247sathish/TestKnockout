(function () {
    var currentParams = {}, updateTimer, $ = window.jQuery;
    function ensureString(value) { 
        return ((value === null) || (value === undefined)) ? value : value.toString();
    }
    
    ko.linkObservableToUrl = function (observable, hashPropertyName, defaultValue) {
   
        observable.subscribe(function (value) {
            var valueToWrite = value === defaultValue ? null : ensureString(value);
            if (currentParams[hashPropertyName] !== valueToWrite) {
                currentParams[hashPropertyName] = valueToWrite;
                queueAction(function () {
                    for (var key in currentParams)
                        $.address.parameter(key, currentParams[key]);
                    $.address.update();
                });
            }
        });
        
        $.address.change(function (evt) {
            currentParams[hashPropertyName] = hashPropertyName in evt.parameters ? evt.parameters[hashPropertyName] : null;
            observable(hashPropertyName in evt.parameters ? evt.parameters[hashPropertyName] : defaultValue);
        });
    }

    function queueAction(action) {
        if (updateTimer)
            clearTimeout(updateTimer);
        updateTimer = setTimeout(action, 0);
    }

    $.address.autoUpdate(false);
})();