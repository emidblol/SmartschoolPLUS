//on submit
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    //get the anonymous checkbox
    var anonymous = document.getElementsByName("anonymous")[0];
    //set anonymous in sync storage(firefox)
    browser.storage.sync.set({
        anonymous: anonymous.checked
    });
    //get the theme radio button
    var theme = document.querySelector('input[name="theme"]:checked').value;
    //set theme in sync storage(firefox)
    browser.storage.sync.set({
        theme: theme
    });
})

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