/**
 * Get the next planned element for today
 * @returns {Promise} The next planned element
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
            <span style="font-size: 18px; font-weight: bold; color: #FFFFFF;">${res.name || res.courses[0].name}</span>
        </div>
        `
                var moreInfoOnHover = document.createElement("div");
                moreInfoOnHover.style.display = "flex";
                moreInfoOnHover.style.flexDirection = "column";
                moreInfoOnHover.style.justifyContent = "left";
                moreInfoOnHover.style.alignItems = "left";
                moreInfoOnHover.style.borderRadius = "10px";
                moreInfoOnHover.style.border = "1px solid #CCCCCC";
                if (resee.theme == "dark") {
                    moreInfoOnHover.style.backgroundColor = "#000000";
                    moreInfoOnHover.style.color = "#FFFFFF";
                } else {
                    moreInfoOnHover.style.backgroundColor = "#FFFFFF";
                    moreInfoOnHover.style.color = "#000000";
                }
                moreInfoOnHover.style.position = "absolute";
                moreInfoOnHover.style.padding = "0.5rem";
                moreInfoOnHover.style.top = "0px";
                moreInfoOnHover.style.left = "4rem";
                moreInfoOnHover.style.zIndex = "100";
                moreInfoOnHover.style.display = "none";
                moreInfoOnHover.style.width = "25rem";
                moreInfoOnHover.style.height = "7.5rem";
                var col = "CCCCCC"
                var col2 = "000000"
                if (resee.theme == "dark") {
                    col = "DDDDDD"
                    col2 = "FFFFFF"
                }
                    
                if (!rese.anonymous) {
                    moreInfoOnHover.innerHTML = `
        <span style="font-size: 10px; color: #${col};">Next up</span>
        <span style="font-size: 18px; font-weight: bold; color: #${col2};">${res.name || res.courses[0].name}</span>
        <span style="font-size: 10px; color: #${col};">${res.period.dateTimeFrom.split("T")[1].split(":")[0]}:${res.period.dateTimeFrom.split("T")[1].split(":")[1]} - ${res.period.dateTimeTo.split("T")[1].split(":")[0]}:${res.period.dateTimeTo.split("T")[1].split(":")[1]}</span>
        <span style="font-size: 10px; color: #${col};">${res.locations[0].title}</span>
        <span style="font-size: 10px; color: #${col};">${res.organisers.users[0].name.startingWithFirstName}</span>
        <img src="${"https://" + subdomain + ".smartschool.be/smsc/svg/" + (res.icon || res.courses[0].icon) + "/" + (res.icon || res.courses[0].icon) + "_16x16.svg"}" style="height: 85%; aspect-ratio: 1; margin-right: 1rem;  position:absolute; right:0; border-radius:25px"/>
        `
                } else {
                    moreInfoOnHover.innerHTML = `
        <span style="font-size: 10px; color: #${col};">Next up</span>
        <span style="font-size: 18px; font-weight: bold; color: #${col2};">${res.name || res.courses[0].name}</span>
        <span style="font-size: 10px; color: #${col};">${res.period.dateTimeFrom.split("T")[1].split(":")[0]}:${res.period.dateTimeFrom.split("T")[1].split(":")[1]} - ${res.period.dateTimeTo.split("T")[1].split(":")[0]}:${res.period.dateTimeTo.split("T")[1].split(":")[1]}</span>
        <span style="font-size: 10px; color: #${col};">[REDACTED]</span>
        <span style="font-size: 10px; color: #${col};">[REDACTED]</span>
        <img src="${"https://" + subdomain + ".smartschool.be/smsc/svg/" + (res.icon || res.courses[0].icon) + "/" + (res.icon || res.courses[0].icon) + "_16x16.svg"}" style="height: 85%; aspect-ratio: 1; margin-right: 1rem;  position:absolute; right:0; border-radius:25px"/>
        `
                }
                //align the moreInfoOnHover so at the horizontal center of the div
                document.getElementById("topnavMenuOverlay").appendChild(moreInfoOnHover);
                div.addEventListener("mouseover", () => {
                    moreInfoOnHover.style.display = "flex";
                    document.getElementById("topnavMenuOverlay").hidden = false;
                })
                div.addEventListener("mouseout", () => {
                    //check if the mouse is still hovering over the moreInfoOnHover div
                    var isHovering = moreInfoOnHover.matches(':hover');
                    if (isHovering) return;
                    moreInfoOnHover.style.display = "none";
                    document.getElementById("topnavMenuOverlay").hidden = true;
                })
                moreInfoOnHover.addEventListener("mouseover", () => {
                    moreInfoOnHover.style.display = "flex";
                    document.getElementById("topnavMenuOverlay").hidden = false;
                })
                moreInfoOnHover.addEventListener("mouseout", () => {
                    //check if the mouse is still hovering over the moreInfoOnHover div
                    var isHovering = moreInfoOnHover.matches(':hover');
                    if (isHovering) return;
                    moreInfoOnHover.style.display = "none";
                    document.getElementById("topnavMenuOverlay").hidden = true;
                })
                var divider = document.createElement("div");
                divider.className = "topnav__divider"
                top.insertBefore(divider, top.children[1]);
                top.insertBefore(div, top.children[2]);
            })
        }, 500);
    })
})