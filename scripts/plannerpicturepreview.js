//Adds the picture of the teacher to the planner
function refrPic() {
    var url = window.location.href;
    if (url.includes("/planned-lessons/") || url.includes("/planned-assigments/")) {
        //convert the url to an array with / as seperator
        var urlArray = url.split("/");
        //get the last part of the url
        var lastPart = urlArray[urlArray.length - 1];
        console.log(lastPart);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const rep = this
                //wait until the form__value__element class (first element) isn't undefined, without making it laggy
                let interval = setInterval(() => {
                    //check if the element exists
                    if (document.getElementsByClassName("form__value__element")[0] != undefined) {
                        //break the loop
                        //get form__value__element class (first element)
                        var teacherparent = document.getElementsByClassName("form__value__element")[0];
                        //add before this element a photo from the host (organisers.user[0].pictureurl)
                        var picture = document.createElement("img");
                        console.log(JSON.parse(rep.responseText).organisers.users[0].pictureUrl)
                        const url = JSON.parse(rep.responseText).organisers.users[0].pictureUrl;
                        console.log(url)
                        picture.setAttribute("src", url);
                        picture.setAttribute("style", "width: 25px; height: 25px; border-radius: 50%; margin-right: 10px;");
                        //prepend the picture to the parent
                        teacherparent.insertBefore(picture, teacherparent.children[0]);
                        clearInterval(interval);
                    }
                }, 100);
            }
        };
        xmlhttp.open("GET", "https://sbhg.smartschool.be/planner/api/v1/planned-lessons/" + lastPart, true);
        xmlhttp.send();
    }
}

//Removes the teachers name from the planner
function removeName() {
    var url = window.location.href;
    if (url.includes("/planned-lessons/") || url.includes("/planned-assigments/")) {
        //convert the url to an array with / as seperator
        var urlArray = url.split("/");
        //get the last part of the url
        var lastPart = urlArray[urlArray.length - 1];
        console.log(lastPart);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const rep = this
                //wait until the form__value__element class (first element) isn't undefined, without making it laggy
                let interval = setInterval(() => {
                    //check if the element exists
                    if (document.getElementsByClassName("form__row")[1] != undefined) {
                        //break the loop
                        var f = document.getElementsByClassName("form__row")[1];
                        f.innerHTML = "";
                        f.style="display:none";
                        clearInterval(interval);
                    }
                }, 100);
                let interval2 = setInterval(() => {
                    //check if the element exists
                    if (document.getElementsByClassName("form__row")[2] != undefined) {
                        //break the loop
                        var f = document.getElementsByClassName("form__row")[2];
                        f.innerHTML = "";
                        f.style="display:none";
                        clearInterval(interval2);
                    }
                }, 100);
            }
        };
        xmlhttp.open("GET", "https://sbhg.smartschool.be/planner/api/v1/planned-lessons/" + lastPart, true);
        xmlhttp.send();
    }
}

//Runs if the page changes
let prevUrl = undefined;
setInterval(() => {
    const currUrl = window.location.href;
    if (currUrl != prevUrl) {
        prevUrl = currUrl;
        console.log(`URL changed to : ${currUrl}`);
        console.log("yes")
        storage.sync.get("anonymous", (data) => {
            console.log(data)
            if (data.anonymous) {
                removeName();
            } else {
                refrPic();
            }
        })
    }
})