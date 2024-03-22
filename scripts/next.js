/**
 * Get the next planned element for today
 * @returns {Promise} The next planned element
 * @deprecated
 */
function e() {
    return new Promise(function (resolve, reject) {
        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();
        var url = window.location.href;
        var urlArray = url.split("/");
        var subdomain = urlArray[2].split(".")[0];

        // Define the current date in ISO format
        var currentDate = new Date().toISOString().split('T')[0];

        // Define the API URL with query parameters
        var apiUrl = 'https://' + subdomain + '.smartschool.be/planner/api/v1/planned-elements/user/2237_8772_0?from=' + currentDate + '&to=' + currentDate;

        // Set up the request
        xhr.open('GET', apiUrl, true);

        // Define a callback function to handle the response
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Parse the response as JSON
                var response = JSON.parse(xhr.responseText);

                // Filter planned elements for today
                var currentDate = new Date().toISOString().split('T')[0];
                var plannedElementsToday = response.filter(function (element) {
                    return element.period.dateTimeFrom.includes(currentDate);
                });

                // Sort the planned elements by date and time
                plannedElementsToday.sort(function (a, b) {
                    return new Date(a.period.dateTimeFrom) - new Date(b.period.dateTimeFrom);
                });

                // Find the next planned element
                var now = new Date();
                var nextElement = plannedElementsToday.find(function (element) {
                    return new Date(element.period.dateTimeFrom) > now;
                });
                if (nextElement) {
                    console.log('Next Planned Element:');
                    console.log('Name:', nextElement.name || nextElement.courses[0].name);
                    console.log('Start Time:', nextElement.period.dateTimeFrom);
                    console.log('End Time:', nextElement.period.dateTimeTo);
                    resolve(nextElement)
                } else {
                    console.log('No upcoming planned elements for today.');
                    reject("No upcoming planned elements for today.")
                }
            } else {
                console.error('Error fetching data. Status:', xhr.status);
                reject("Error fetching data. Status:", xhr.status)
            }
        };

        // Handle network errors
        xhr.onerror = function () {
            console.error('Network error occurred');
        };

        // Send the request
        xhr.send();
    });
}
storage.sync.get("anonymous", (rese) => {
    storage.sync.get("theme").then((resee) => {
        var lasturl = null;
        setInterval(() => {
            var url = window.location.href;
            var urlArray = url.split("/");
            var subdomain = urlArray[2].split(".")[0];
            if (lasturl == window.location.href || document.getElementById("nextup") != undefined) return;
            lasturl = window.location.href;
            var top = document.getElementById("smscTopContainer").children[0];
            e().then((res) => {
                if (document.getElementById("nextup") != undefined) return;
                console.log(res);
                var div = document.createElement("div");
                div.style.display = "flex";
                div.id = "nextup"
                div.innerHTML = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin:0 1rem;">
            <span style="font-size: 10px; color: #CCCCCC;">Next up</span>
            <span style="font-size: 18px; font-weight: bold; color: #FFFFFF;">${res.name || res.courses[0].name || "N/A"}</span>
        </div>
        `
                top.insertBefore(div, top.children[1]);
                var divider = document.createElement("div");
                divider.className = "topnav__divider"
                top.insertBefore(divider, top.children[1]);
            })
        }, 500);
    })
})