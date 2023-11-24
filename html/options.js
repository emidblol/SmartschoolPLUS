//on submit
document.querySelector('form').addEventListener('submit', (e) => {
    //get the anonymous checkbox
    var anonymous = document.getElementsByName("anonymous")[0];
    //set anonymous in sync storage(firefox)
    browser.storage.sync.set({
        anonymous: anonymous.checked
    });
})
//get the theme parameter from the url
var urlParams = new URLSearchParams(window.location.search);
var theme = urlParams.get('theme');
var anonymous = urlParams.get('anonymous');
//if theme is not null
if (theme != null) {
    //set theme in sync storage(firefox)
    browser.storage.sync.set({
        theme: theme
    });
} 
//if anonymous is not null
if (anonymous != null) {
    //set anonymous in sync storage(firefox)
    browser.storage.sync.set({
        anonymous: anonymous = "on"
    });
}
//get theme
browser.storage.sync.get("theme").then((res) => {
    //select the theme radio button
    document.getElementById(res.theme).checked = true;
})
//get anonymous
browser.storage.sync.get("anonymous").then((res) => {
    //select the anonymous checkbox
    if (res.anonymous) {
        document.getElementsByName("anonymous")[0].checked = true;
    }
})