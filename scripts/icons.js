const manifestUrl = browser.runtime.getManifest()
const storage = browser.storage
const runtime = browser.runtime
var href = window.location.href;

//Frequently used id
const shortcutsMenu = document.getElementById("shortcutsMenu").children[0];

//Changes an icon.
//@param button: the button to change the icon of
//@param icon: the icon to change the button to
function changeIcon(button, icon) {
    button.style.width = "48px";
    //center content
    button.style.justifyContent = "center";
    const buttonicon = document.createElement("img")
    buttonicon.src = icon;
    buttonicon.style.width = "24px";
    //set the rotation of the icon to O degrees
    buttonicon.style.transform = "rotate(0deg)";
    buttonicon.style.transition = "all 0.25s";
    buttonicon.style.filter = "invert(100%)"
    //when the button is clicked, rotate the icon 180 degrees using a mouseup event
    button.addEventListener("mouseup", () => {
        var isrotating = false;
        var bell_end = false;
        let icon = button.children[0];
        let rotation = icon.style.transform;
        if (rotation == "rotate(0deg)") {
            if (icon.src == runtime.getURL("icons/bell.png") || icon.src == runtime.getURL("icons/active.png")) {
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
        } else {
            if (icon.src == runtime.getURL("icons/bell.png") || icon.src == runtime.getURL("icons/active.png")) {
                icon.style.transform = "rotate(0deg)";
            }
        }
    })
    //add the class, don't set it
    button.innerHTML = "";
    button.appendChild(buttonicon);
}

function getID(number) {
    let ID = Object.keys(sessionStorage)[number]
    //start promise
    return new Promise((resolve, reject) => {
        if (ID == undefined) {
            console.log("No ID found, repeating code in 1 second.")
            setTimeout(() => {
                resolve(getID(0))
            }, 1000)
        } else if (ID.includes("MessagesCounter")) {
            console.warn("Found message counter, skipping")
            resolve(getID(number + 1))
        } else if (ID.includes("queueUuid")) {
            console.warn("Found queueUuid, skipping")
            resolve(getID(number + 1))
        } else {
            console.log("Found ID: " + ID)
            resolve(ID)
        }
    })
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
        case "none":
            break;
        case "dark":
            //change topnav class background color to darkgreen
            var topNav = document.getElementsByClassName("topnav");
            topNav[0].style.backgroundColor = "black";
            shortcutsMenu.style.backgroundColor = "black";
            document.getElementById("coursesMenu").children[0].style.backgroundColor = "black";
            document.getElementById("coursesMenu").children[0].style.color = "white !important";
            document.getElementById("notifsMenu").children[0].style.backgroundColor = "black";
            //edit the  .topnav__menuitem class
            const style = document.createElement("style")
            style.innerHTML = ".topnav__menuitem {color: white !important;} .topnav__menuitem:hover {color: black !important;}"
            document.head.appendChild(style)
            break
        case "default":
            storage.sync.set({ theme: "bavo" });
            break
    }
    // Add the settings button to the goto menu.
    var newMenuItem = document.createElement("a");
    newMenuItem.setAttribute("href", browser.runtime.getURL("html/settings.html"));
    newMenuItem.style.backgroundImage = "url('" + manifestUrl.icons["48"] + "')";
    newMenuItem.setAttribute("class", "topnav__menuitem topnav__menuitem--icon");
    newMenuItem.setAttribute("role", "menuitem");
    newMenuItem.setAttribute("title", "Smartschool Plus");
    newMenuItem.setAttribute("column-index", "0");
    newMenuItem.setAttribute("item-index", "0");
    if (res.theme == "dark") {
        newMenuItem.style.color = "white !important";
    }
    newMenuItem.innerHTML = "Smartschool Plus";
    shortcutsMenu.appendChild(newMenuItem);

    //Change the buttons in the topnav
    var topnavbtns = document.getElementsByClassName("topnav__btn")

    //Change the buttons
    console.log(runtime.getURL("icons/homebutton.svg"))
    changeIcon(topnavbtns[1], runtime.getURL("icons/homebutton.svg"))
    changeIcon(topnavbtns[2], runtime.getURL("icons/go-up.png"))
    //when in the shortcutsMenu div gets the hidden attribute set to "", rotate the icon to 0deg. Use mutationobserver for this.
    var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes") {
                if (mutation.attributeName === "hidden") {
                    if (mutation.target.hidden != "") {
                        topnavbtns[2].children[0].style.transform = "rotate(0deg)"
                    } else {
                        topnavbtns[2].children[0].style.transform = "rotate(180deg)"
                    }
                }
            } else {
                console.log(mutation.type)
            }
        })
    })
    //keep observing the shortcutsMenu div forever
    observer.observe(document.getElementById("shortcutsMenu"), { attributes: true, childList: true, subtree: true })
    changeIcon(topnavbtns[3], runtime.getURL("icons/courses.png"))
    topnavbtns[3].id = "coursesicon"
    var observer2 = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let topnav__btn = document.getElementsByClassName("topnav__btn")
            if (mutation.type === "attributes") {
                if (mutation.attributeName === "hidden") {
                    console.log(mutation.target.hidden)
                    if (mutation.target.hidden) {
                        document.getElementById("coursesicon").children[0].style.transform = 'rotate(0deg)'
                        console.log(topnav__btn[3].children[0])
                    } else {
                        document.getElementById("coursesicon").children[0].style.transform = 'rotate(30deg)'
                        console.log(topnav__btn[3].children[0])
                    }
                }
            } else {
                console.log(mutation.type)
            }
        })
    })
    observer2.observe(document.getElementById("coursesMenu"), { attributes: true, childList: false, subtree: false })
    //So far the normal icons.
    //Get the sessionstorage and the first item in it
    var session = sessionStorage
    getID(0).then((ID) => {
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
    })
    //remove the topnav__btn--icon--search class from 6
    topnavbtns[6].classList.remove("topnav__btn--icon--search")
    changeIcon(topnavbtns[6], runtime.getURL("icons/search.png"))
})

storage.sync.get("anonymous").then((res) => {
    if (res.anonymous) {
        var topnavbtns = document.getElementsByClassName("topnav__btn--profile")
        topnavbtns[0].innerHTML = `<img alt="Profiel afbeelding" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.AUYTedvwNaCTFUs-dbnUygHaHZ%26pid%3DApi&amp;f=1&amp;ipt=24bd41b2a1c5c7aa29c63fddefc557f6f75a9e068e314b0175fc6fca5b73013d&amp;ipo=images">
        <div class="hlp-vert-box">
            <span>Anonymous</span>
            <span class="topnav__btn__light"></span>
        </div>
        <div class="topnav__menu-arrow" aria-hidden="true"></div>`
        setTimeout(() => {
            if (window.location.href.includes("planner")) {
                document.getElementsByClassName("header__avatar")[0].children[0].src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.AUYTedvwNaCTFUs-dbnUygHaHZ%26pid%3DApi&amp;f=1&amp;ipt=24bd41b2a1c5c7aa29c63fddefc557f6f75a9e068e314b0175fc6fca5b73013d&amp;ipo=images"
            }
            setInterval(() => {
                if (window.location.href != href) {
                    if (window.location.href.includes("planner")) {
                        document.getElementsByClassName("header__avatar")[0].children[0].src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.AUYTedvwNaCTFUs-dbnUygHaHZ%26pid%3DApi&amp;f=1&amp;ipt=24bd41b2a1c5c7aa29c63fddefc557f6f75a9e068e314b0175fc6fca5b73013d&amp;ipo=images"
                    }
                }
            }, 100);
        }, 1000);
    }
})
