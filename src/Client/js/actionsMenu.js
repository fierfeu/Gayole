gameManager.loadExternalRessources({'url':'/en/actionsMenu.html'}).then((data)=>{
    document.getElementById('strategicMap').innerHTML += data;
/*     const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet';
    cssLink.href = '/actionMenu.css';
    document.getElementsByTagName('head')[0].appendChild(cssLink); */
    gameManager.loadExternalRessources('/en/helper.json').then((data)=>{
        globalThis.i18n+=JSON.parse(data);
    }).catch(()=>{
        throw('ERROR while loading english translation file for action Menu');
    });
    document.getElementById('actionMenu').style.display="block";
}).catch((err)=>{
    throw err;
});

