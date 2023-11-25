/**
 * @file theme.js
 * @brief This file contains the code for the themes.
 * @details This file contains the code for the themes. It is used to change the theme of smartschool.
 */
storage.sync.get('theme', function (data) {
    switch (data.theme) {
        case "bavo":
            //change topnav class background color to darkgreen
            var topNav = document.getElementsByClassName("topnav");
            topNav[0].style.backgroundColor = "darkgreen";
            break;
        case undefined:
            storage.sync.set({ theme: "none" });
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
});