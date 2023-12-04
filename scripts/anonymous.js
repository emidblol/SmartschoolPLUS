
storage.sync.get("anonymous").then((res) => {
    console.log(res)
    if (res.anonymous) {
        var topnavbtns = document.getElementsByClassName("topnav__btn--profile")
        topnavbtns[0].innerHTML = `<img alt="Profiel afbeelding" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.AUYTedvwNaCTFUs-dbnUygHaHZ%26pid%3DApi&amp;f=1&amp;ipt=24bd41b2a1c5c7aa29c63fddefc557f6f75a9e068e314b0175fc6fca5b73013d&amp;ipo=images">
        <div class="hlp-vert-box">
            <span>Anonymous</span>
            <span class="topnav__btn__light"></span>
        </div>
        <div class="topnav__menu-arrow" aria-hidden="true"></div>`
        let int = setInterval(() => {
            if (document.getElementsByClassName("header__avatar").length > 0) {
                document.getElementsByClassName("header__avatar")[0].children[0].src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.AUYTedvwNaCTFUs-dbnUygHaHZ%26pid%3DApi&amp;f=1&amp;ipt=24bd41b2a1c5c7aa29c63fddefc557f6f75a9e068e314b0175fc6fca5b73013d&amp;ipo=images"
            }
            if (document.getElementsByClassName("splitdetail__header__avatar").length > 0) {
                document.getElementsByClassName("splitdetail__header__avatar")[0].children[0].style.width = "48px"
                document.getElementsByClassName("splitdetail__header__avatar")[0].children[0].src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.AUYTedvwNaCTFUs-dbnUygHaHZ%26pid%3DApi&amp;f=1&amp;ipt=24bd41b2a1c5c7aa29c63fddefc557f6f75a9e068e314b0175fc6fca5b73013d&amp;ipo=images"
            }
        });
    }
})
