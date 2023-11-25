storage.sync.get('anonymous', (data) => {
    if (!data.anonymous) return;
    let bypass = false;
    let interval = setInterval(() => {
        if (document.getElementsByClassName('homepage').length == 0 || bypass || document.getElementById('anonyonhome') != null) return;
        document.getElementsByClassName('homepage')[0].style.filter = 'blur(1000px)';
        let d = document.createElement('div')
        d.style.width = '100%';
        d.style.height = '100%';
        d.style.position = 'absolute';
        d.style.top = '0';
        d.style.padding.top = '48px';
        d.style.left = '0';
        d.id = 'anonyonhome';
        d.innerHTML = `
            <h1 style="color: white; position: absolute; top: 47.5%; left: 50%; transform: translate(-50%, -50%);">Anonymous mode is on</h1>
            <h2 style="color: white; position: absolute; top: 52.5%; left: 50%; transform: translate(-50%, -50%);">You can turn it off in the extension settings</h2>
            `;
        document.getElementsByClassName('homepage')[0].parentElement.appendChild(d);
        document.getElementById('smscTopContainer').style.zIndex = '22';
        if (document.getElementById('topnavMenuOverlay') == null) return;
        document.getElementById('topnavMenuOverlay').style.zIndex = '22';
        let b = document.createElement('button');
        b.style.position = 'absolute';
        b.style.top = '60%';
        b.style.left = '50%';
        b.style.transform = 'translate(-50%, -50%)';
        b.style.padding = '10px 20px';
        b.style.borderRadius = '10px';
        b.style.border = 'none';
        b.style.backgroundColor = '#1e90ff';
        b.style.color = 'white';
        b.style.fontWeight = 'bold';
        b.style.fontSize = '20px';
        b.style.cursor = 'pointer';
        b.innerHTML = 'View anyway';
        b.style.borderRadius = '10px';
        b.onclick = () => {
            bypass = true;
            document.getElementById('anonyonhome').remove();
            document.getElementsByClassName('homepage')[0].style.filter = 'blur(0px)';
            clearInterval(interval);
        }
        d.appendChild(b);
    }, 100);
});