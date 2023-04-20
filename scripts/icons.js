const manifestUrl = browser.runtime.getManifest()
const storage = browser.storage
const runtime = browser.runtime

//Changes an icon.
//@param button: the button to change the icon of
//@param icon: the icon to change the button to
function changeIcon(button, icon) {
    const buttonicon = document.createElement("img")
    buttonicon.src = icon;
    buttonicon.style.width = "24px";
    //set the rotation of the icon to O degrees
    buttonicon.style.transform = "rotate(0deg)";
    buttonicon.style.transition = "all 0.25s";
    //when the button is clicked, rotate the icon 180 degrees using a mouseup event
    button.addEventListener("mouseup", () => {
        var isrotating = false;
        var bell_end = false;
        let icon = button.children[0];
        let rotation = icon.style.transform;
        if (rotation == "rotate(0deg)") {
            if (icon.src == runtime.getURL("icons/go-up.png")) {
                icon.style.transform = "rotate(180deg)";
            } else if (icon.src == runtime.getURL("icons/book.png")) {
                icon.style.transform = "rotate(20deg)";
            } else if (icon.src == runtime.getURL("icons/bell.png") || icon.src == runtime.getURL("icons/active.png")) {
                isrotating = true;
                if (!bell_end) {
                    //make the bell rotate a bit to the left and to the right
                    icon.style.transform = "rotate(-45deg)";
                    bell_end = true;
                    setTimeout(() => {
                        icon.style.transform = "rotate(0deg)";
                        setTimeout(() => {
                            icon.style.transform = "rotate(45deg)";
                            setTimeout(() => {
                                icon.style.transform = "rotate(0deg)";
                                isrotating = false;
                            }, 250)
                        }, 100)
                    }, 250)
                } else {
                    bell_end = false;
                }
            }
        } else if (!isrotating) {
            icon.style.transform = "rotate(0deg)";
        }
    })
    //add the class, don't set it
    button.innerHTML = "";
    button.appendChild(buttonicon);
}

function getID(number) {
    let ID = Object.keys(sessionStorage)[number]
    if (ID.includes("MessagesCounter")) {
        console.warn("Found message counter, skipping")
        return getID(number + 1)
    } else if (ID.includes("queueUuid")) {
        console.warn("Found queueUuid, skipping")
        return getID(number + 1)
    } else {
        console.log("Found ID: " + ID)
        return ID
    }
}
//Set the theme
storage.sync.get("theme").then((res) => {
    switch (res.theme) {
        case "bavo":
            //change topnav class background color to darkgreen
            var topNav = document.getElementsByClassName("topnav");
            topNav[0].style.backgroundColor = "darkgreen";
            break;
        case undefined:
            storage.sync.set({ theme: "bavo" });
            break;
        case "default":
            storage.sync.set({ theme: "bavo" });
            break
    }
})

// Add the settings button to the goto menu.
var gotomenu = document.getElementById("shortcutsMenu").children[0];
var newMenuItem = document.createElement("a");
newMenuItem.setAttribute("href", browser.runtime.getURL("html/settings.html"));
newMenuItem.style.backgroundImage = "url('" + manifestUrl.icons["48"] + "')";
newMenuItem.setAttribute("class", "topnav__menuitem topnav__menuitem--icon");
newMenuItem.setAttribute("role", "menuitem");
newMenuItem.setAttribute("title", "Smartschool Plus");
newMenuItem.setAttribute("column-index", "0");
newMenuItem.setAttribute("item-index", "0");
newMenuItem.innerHTML = "Smartschool Plus";
gotomenu.appendChild(newMenuItem);

//Change the buttons in the topnav
var topnavbtns = document.getElementsByClassName("topnav__btn")

//Change the buttons
console.log(runtime.getURL("icons/homebutton.svg"))
changeIcon(topnavbtns[1], runtime.getURL("icons/homebutton.svg"))
changeIcon(topnavbtns[2], runtime.getURL("icons/go-up.png"))
changeIcon(topnavbtns[3], runtime.getURL("icons/book.png"))
//So far the normal icons.
//Get the sessionstorage and the first item in it
var session = sessionStorage
var ID = getID(0)
var messagecounter = JSON.parse(sessionStorage.getItem(ID + "MessagesCounter"))
console.log(ID)
if (messagecounter.counter > 0) {
    changeIcon(topnavbtns[4], runtime.getURL("icons/notification.png"))
} else {
    changeIcon(topnavbtns[4], runtime.getURL("icons/mail.png"))
}
var notifications = JSON.parse(sessionStorage.getItem(ID))
if (notifications.length > 0) {
    changeIcon(topnavbtns[5], runtime.getURL("icons/active.png"))
} else {
    changeIcon(topnavbtns[5], runtime.getURL("icons/bell.png"))
}
//remove the topnav__btn--icon--search class from 6
topnavbtns[6].classList.remove("topnav__btn--icon--search")
topnavbtns[6].style["background-image"] = "url('" + runtime.getURL("icons/search.png") + "')"