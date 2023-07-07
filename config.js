// an example to create a new mapping `ctrl-y`
api.mapkey('<ctrl-y>', 'Show me the money', function() {
    Front.showPopup('a well-known phrase uttered by characters in the 1996 film Jerry Maguire (Escape to close).');
});

// an example to replace `T` with `gt`, click `Default mappings` to see how `T` works.
api.map('gt', 'T');

// an example to remove mapkey `Ctrl-i`
api.unmap('<ctrl-i>');

// ------------------configure----------------
let vidIndex = 0;
settings.smoothScroll = true;
api.unmap('x')
api.unmap('om')
api.unmap('sr')
api.mapkey('om', 'search with mmdfans', function() {
    const query = window.prompt();
    window.open(encodeuri("https://mmdfans.net/?query="+query))
});
api.mapkey('co', 'copy video url', function() {
    document.querySelector("#pwm-info-button").click()
    document.querySelector("#pwm-info-button").click()
    const value = document.querySelector("#pwm-info-table > tbody > tr:nth-child(3) > td:nth-child(2) > input");
    if(value.value){
        api.Clipboard.write(value.value);
        return;
    }
    api.Front.showPopup("Can't get video url")
}, {domain: /bilibili.com/ig});
api.mapkey(';x', 'Remove element', function() {
    api.Hints.create("", function(element){
        element.remove();
    })
});
api.mapkey(';r', 'Get full text by element', function() {
    api.Hints.create("", function(element){
        api.Front.showPopup(element.innerText);
    })
});
api.mapkey('sr', 'Read comic', function() {
    document.querySelector('.gallerythumb').click()
}, {domain: /nhentai/ig});
api.mapkey('sv', 'click favorite button', async function() {
    let btn = document.querySelector('#favorite');
    api.Front.showBanner(btn.innerText.trim().toLowerCase().replace('favorite', "favorited"));
    btn.click();

}, {domain: /nhentai/ig});
async function getAccessTokenFromIwara(){
    return await fetch('https://api.iwara.tv/user/token', {
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + localStorage.token
        }
    }).then(res => res.json()).then(data => data.accessToken)
}
function createCheckBoxes(checkboxes, isIwara){
    // Create container element
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100vh';
    container.style.background = 'rgba(0, 0, 0, 0.5)';
    container.style.backdropFilter = 'blur(5px)';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.zIndex = '9999';
    const handleEsc = (e) => {
        if(e.key == "Escape"){
            container.remove();
            document.removeEventListener('keyup', handleEsc)
        }
    }
    document.addEventListener('keyup', handleEsc)
    
    // Create black box
    const blackBox = document.createElement('div');
    blackBox.style.backgroundColor = 'black';
    blackBox.style.color = 'white';
    blackBox.style.padding = '20px';
    blackBox.style.borderRadius = '10px'; // Adjust the border radius here
    blackBox.style.width = '300px';
    blackBox.style.position = 'relative';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '24px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.outline = 'none';
    closeButton.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';
    closeButton.style.transition = 'background-color 0.3s';
    
    // Event listener for close button
    closeButton.addEventListener('click', () => {
      container.remove();
    });
    
    // Mouse hover effect for close button
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    });
    
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
    });
    
    // Append close button to the black box
    blackBox.appendChild(closeButton);
    
    // Create checkboxes
    
    checkboxes.forEach(async (obj) => {
        let checkboxText = '';
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center';
        if(isIwara){
            checkboxText = obj.title;
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxText;
        checkbox.checked = false;
        if(isIwara && obj.isAdded){
            checkbox.checked = true;
        }
        if(isIwara){
            checkboxContainer.addEventListener('mousedown', async () => {
                let method = checkbox.checked ? 'delete' : 'post'
                const authorization =  'Bearer ' +  localStorage.accessToken
                console.log('TESTING: ', method, ' ', authorization)
                fetch(`https://api.iwara.tv/video/${obj.idVideo}/like`, {
                    method: method,
                    headers:{
                       'Authorization': authorization
                    }
                }).then(() => {
                    fetch(`https://api.iwara.tv/playlist/${obj.idPlaylist}/${obj.idVideo}`, {
                        method: method,
                        headers:{
                           'Authorization': authorization
                        }
                    })
                })
            })
        }
        const label = document.createElement('label');
        label.setAttribute('for', checkboxText);
        label.textContent = checkboxText;
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        
        blackBox.appendChild(checkboxContainer);
    });
    
    // Append black box to the container
    container.appendChild(blackBox);
    
    // Add the container to the body
    document.body.appendChild(container);
}
function mouseOver(element){
    let event = new MouseEvent('mouseover', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    
    element.dispatchEvent(event);
}
function mouseOut(element){
    let event = new MouseEvent('mouseout', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    
    element.dispatchEvent(event);
}
function clickLikeButtonYoutube(){
    document.querySelector("#segmented-like-button > ytd-toggle-button-renderer > yt-button-shape > button > yt-touch-feedback-shape > div").click();
}
function checkSaveButtonTextOnYoutube(text){
    return text.indexOf('lưu') != -1 || text.indexOf('save') != -1 || text.indexOf('playlist') != -1 || text.indexOf('danh sách phát') != -1
}
function clickPlaylistButtonYoutube(){
    let outBtns = Array.from(document.querySelectorAll("#flexible-item-buttons > ytd-button-renderer button"));
    let isOut = false;
    for(let btn of outBtns){
        const text = btn.ariaLabel.trim().toLowerCase()
        if(checkSaveButtonTextOnYoutube(text)){
            btn.click();
            isOut = true;
            break;
        }
    }
    if(isOut) return;
    document.querySelector("#button-shape > button").click()
    let btns = document.querySelectorAll('.ytd-popup-container ytd-menu-service-item-renderer');
    for(let btn of btns){
        const text = btn.innerText.trim().toLowerCase()
        if(checkSaveButtonTextOnYoutube(text)){
            btn.click();
            break;
        }
    }
}
function preventKey(key) {
  document.addEventListener('keydown', function(event) {
    if (event.key === key) {
      event.preventDefault();
    }
  });
}
function getIdIwara(url){
    return url.match(/video\/.+(\/)?/)[0].replace(/video\/|\/.+/g, '')
}
api.mapkey('sk', 'Click like button', function(){
    clickLikeButtonYoutube()
}, {domain: /youtube.com/ig})
api.mapkey('sp', 'Click save playlist button', function(){
    clickPlaylistButtonYoutube();
}, {domain: /youtube.com/ig})
api.mapkey('sv', 'Click like and save playlist button', function(){
    clickLikeButtonYoutube()
    clickPlaylistButtonYoutube();
}, {domain: /youtube.com/ig})
api.mapkey('sk', 'Like and show playlist', async function(){
    api.Hints.create("*[href*='video/']", async function(element){
        let checkBoxes = [];
        localStorage.accessToken = await getAccessTokenFromIwara()
        const idVideo = getIdIwara(element.href);
        await fetch('https://api.iwara.tv/light/playlists?id='+idVideo, {
            method:'get',
            headers: {
                'Authorization': 'Bearer ' + localStorage.accessToken
            }
        }).then(res => res.json()).then(data => {
            for(let obj of data){
                checkBoxes = [...checkBoxes, {
                    idPlaylist: obj.id,
                    idVideo,
                    isAdded: obj.added,
                    title: obj.title,
                }]
            }
        })
        createCheckBoxes(checkBoxes, true)
    })
}, {domain: /iwara/ig})
api.mapkey('sv', 'Click like and save playlist button', async  function(){
    let btns = document.querySelectorAll('button');
    for(let btn of btns){
        const text = btn.innerText.toLowerCase();
        if(text == "add to" || text == 'like'){
            btn.click()
            btn.scrollIntoViewIfNeeded()
        }
    }
}, {domain: /iwara.tv\/video/ig})
function fetchData(url){
    return fetch(encodeURI(url)).then(res => res.json()).then(data => data).catch(error => {api.Front.showPopup('Error: '+error)});
}
api.mapkey('sd', 'Open random video', async function(){
    const idPlaylist = document.location.href.match(/playlist\/.+/)[0].replace(/playlist|\//ig, '');
    let pageTotal = 0;
    const vids = []
    let json = 0;
    let maxVids = 0;
    for(let i = 0; i <= json; i++){
        json = await fetchData(`https://api.iwara.tv/playlist/${idPlaylist}?page=${i}`)
        vids.push(...json.results);
        maxVids = json.count;
        json = json.count/json.limit
    }
    console.log(vids);
    const ranNumber = Math.floor(Math.random()*maxVids);
    console.log(ranNumber)
    window.open("https://iwara.tv/video/"+vids[ranNumber].id);
}, {domain: /iwara.tv/ig})
function getJSON(url, callback, xVersionHeader = '', headers ={}) {
    if(xVersionHeader){
        headers = {
            ...headers,
            'x-version': xVersionHeader,
        }
    }
    fetch(url, {
      headers: {
         "Authorization": "Bearer " + localStorage.token,
        ...headers
      }
    })
    .then(response => response.json())
    .then(data => callback(null,data))
    return;
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', url, true);
    // xhr.responseType = 'json';
    // xhr.setRequestHeader('x-version', xVersionHeader);

    // xhr.onload = function() {
    //   var status = xhr.status;
    //   if (status === 200) {
    //     callback(null, xhr.response);
    //   } else {
    //     callback(status, xhr.response);
    //   }
    // };
    // xhr.send();
};
function getHTML(url, callback) {
    fetch(url)
  .then(res => res.text())
  .then(data => {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, 'text/html');
    callback(null, htmlDocument);
  })
  .catch(error => {
    callback(error, null);
  });
};
async function sha1(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
const vidResolution = [
    'Source',
    '540p',
    '360p'
]
async function getIwaraVideoTitle(id, index){
    return await fetch(`https://api.iwara.tv/video/${id}`)
    .then((response) => response.json())
    .then(data => data.title);
}
function getIwaraVideoId(url){
    return url.match(/(video\/.+\/)|(video\/.+)/)[0].replace(/video|\//g, '');
}
function copyIwaraVideo(id, index, isPlayWithMpv){
    function getFileId(url){
        return url.match(/file\/.+\?/g)[0].replace(/file\/|\?/g, '')
    }
    function getExpire(url){
        return url.match("expires=.+&")[0].replace(/expires=|&/g, '');
    }
    getJSON(`https://api.iwara.tv/video/${id}`, async (status, res)=>{
        if(status){
            api.Front.showBanner('Error: ', status);
            return;
        }
        if(res.message && (res?.message?.trim()?.toLowerCase()?.includes('notfound') || res?.message?.trim()?.toLowerCase()?.includes('private'))){
            api.Front.showPopup(res.message+' for '+ id)
            api.Clipboard.write('https://www.iwara.tv/'+id)
            return;
        }
        else if(res.message){
            copyIwaraVideo(id, index, isPlayWithMpv);
            return;
        }
        if(res.embedUrl && !res.fileUrl){
            api.Clipboard.write(res.embedUrl);
            return;
        }
        const fileUrl = res.fileUrl;
        const fileId = getFileId(fileUrl)
        if(!fileId||!fileUrl) {
            api.Front.showPopup('Not found requrement');
            return;
        }
      console.log((fileId+'_'+getExpire(fileUrl)+'_5nFp9kmbNnHdAFhaqMvt'))
        getJSON(fileUrl, (status2, res2) => {
            const json = res2;
            console.log(json)
            let i = json.length-1;
            for(let j = 0; j < json.length; j++){
                if(vidResolution[vidIndex].toLowerCase().indexOf(json[j].name.toLowerCase()) != -1){
                    i = j;
                    break;
                }
            }
            const uri = 'https:'+json[i].src.download;
            api.Clipboard.write(uri)
            if(isPlayWithMpv){
                api.Front.showBanner('Opening mpv...');
                runWithMpv(uri, 'https://www.iwara.tv/video/'+id);
            }
        }, await sha1(fileId+'_'+getExpire(fileUrl)+'_5nFp9kmbNnHdAFhaqMvt'))
    })
}

function convertStringToQueryString(s){
    console.log(s)
    return s.replaceAll(' ', '%20')
}
let originalTitle
function GoToMmdFansVid(title, isSearching = true){
    if(isSearching) {
        api.Front.showBanner('Searching...')
        originalTitle = title;
    } ;
    getHTML(encodeURI('https://mmdfans.net/?query='+title), function(s, res){
        if(s){
            api.Front.showPopup('Error:'+s)
            return;
        }
        const doc = res;
        const videos = doc.querySelectorAll('.mdui-col > a')
        console.log(doc)
        console.log(videos)
        if(!videos || videos.length < 1){
            const titleBackup = title;
            title = title.replace(/ [^ ]*$/, "")
            if(!title || titleBackup == title) {
                api.Front.showPopup("Not found video")
                return;
            }
            api.Front.showBanner('Not found, searching ' + title)
            GoToMmdFansVid(title, false)
            return;
        }
        let index = 0;
        if(videos.length > 1){
            api.Front.showBanner('Result have above 1 video');
            const vids = Array.from(doc.querySelectorAll('.mdui-grid-tile'))
            for(let i in vids){
                if(vids[i].innerText.indexOf(originalTitle) != -1){
                    index = i;
                }
            }
        }
        
        let openUrl = "https://mmdfans.net/" + videos[index].href.match(/mmd\/.+/ig)[0];
        console.log(openUrl)
        window.open(openUrl);
        
    })
}
async function runWithMpv(url, pageUrl = null){
    fetch('http://localhost:9789', {
        method:'post',
        body: new URLSearchParams({url, pageUrl})
    }).catch(err => console.error(err))
}
function convertStringToIwaraQuery(s){
    return s.replaceAll(' ', '+');
}
function copyOreno3dAndMmdTube(url){
    getHTML(url, (stat, res) => {
        const aTag = res.querySelector('[href*="iwara.tv/video"]')
        copyIwaraVideo(aTag.href.match(/video\/.+(\/)?/)[0].replace(/video\/|\/.+/g, ''), vidIndex, true);
    })
}
let selectorTitle = '.page-video__details > .text'
api.mapkey('cv', 'Go to mmdfans with this video', async function(){
    const el = document.querySelector(selectorTitle);
    if(el){
        GoToMmdFansVid(el.innerText);
        return;
    }
    const title= await getIwaraVideoTitle(getIwaraVideoId(document.location.href))
    console.log(title)
    GoToMmdFansVid(title);
}, {domain: /iwara.tv/ig})
api.mapkey('cv', 'Open by iwara', async function(){
    let fetchData= function fetchData(url){
        return fetch(encodeURI(url)).then(res => res.json()).then(data => data).catch(error => {api.Front.showPopup('Error: '+error)});
    }
    api.Front.showBanner("Searching...")
    const title = document.querySelector('.title').innerText
    const author = document.querySelector('[href*="query=author"]').innerText
    const results = (await fetchData('https://api.iwara.tv/search?type=user&query=' + author)).results;
    let pageTotal = 0;
    for(let i = 0; i <= pageTotal; i++){
        const req = 'https://api.iwara.tv/search?type=video&query=' + title + "&page="+i;
        const vidObject = (await fetchData(req));
        let vids = vidObject.results;
        pageTotal = Math.floor(vidObject.count/vidObject.limit);
        for(let vid of vids){
            if(vid.title.toLowerCase().trim().indexOf(title.toLowerCase().trim()) != -1){
                window.open('https://www.iwara.tv/video/'+vid.id);
                return;
            }
        }
    }
    let user = {};
    for(let o of results){
        if(author.indexOf(o.name) != -1){
            user = o;
            break;
        }
    }
    pageTotal = 0;
    for(let i = 0; i<=pageTotal;i++){
        const userObject = await fetchData('https://api.iwara.tv/videos?page='+i+'&sort=date&user='+user.id);
        const videos = userObject.results;
        pageTotal = Math.floor(userObject.count/userObject.limit);
        for(let vid of videos){
            if(vid.title.toLowerCase().trim().indexOf(title.toLowerCase().trim()) != -1){
                
                window.open("https://iwara.tv/video/"+vid.id);
                return;
            }
        }
    }
    api.Front.showPopup("Not found")
    // getHTML('https://ecchi.iwara.tv/search?query='+convertStringToIwaraQuery(document.querySelector(selectorTitle).innerText), function(s, res){
    //     window.open(res.querySelector('.view-content .title a').href)
    // })
}, {domain: /mmdfans/ig})
api.mapkey('cs', 'Open by iwara', async function(){
    try{
        const id = document.querySelector('[href*="https://ecchi.iwara"]').href.match(/(video|videos)\/.+/i)[0].replace(/(.+\/)/, '');
        if(id){
            window.open('https://iwara.tv/video/'+id);
            return;
        }
    }
    catch{
        window.open(document.querySelector('[href*="iwara.tv/video"]').href);
    }
}, {domain: /erommdtube.com|oreno3d/ig})
api.mapkey('cv', 'Open by mmdfans', async function(){
    const title = document.querySelector('h1.video-h1').innerText;
    console.log(title)
    GoToMmdFansVid(title);
}, {domain: /mmdtube|oreno3d/ig})
api.mapkey('co', 'copy source video link from mmdfans', function(){
    const vid = document.querySelector('*[src*="cdn."][src*="video"]');
    api.Clipboard.write(vid.src);
    runWithMpv(vid.src, document.location.href)
}, {domain: /mmdfans/ig})
api.mapkey('sm', 'Open urls in clipboard to mpv', async function(){
    api.Clipboard.read(function(res){
        const urls = res.data.split('\n');
        for(const url of urls){
            if(url.includes('iwara')){
                copyIwaraVideo(url.match(/video\/.+(\/)?/)[0].replace(/video\/|\/.+/g, ''), vidIndex, true);
            }
            else if (url.includes('oreno3d') || url.includes('mmdtube')){
                copyOreno3dAndMmdTube(url)
            }
            else{
                runWithMpv(url);
            }
        }
    })
})
api.mapkey('sr', 'copy source video link from youtube', async function(){
    api.Hints.create("*[href]", function(element){
        api.Clipboard.write(element.href);
        runWithMpv(element.href);
    })
}, {domain: /youtube/ig})
api.mapkey('sr', 'copy source video link from iwara', async function(){
    api.Hints.create("*[href*='video/']", function(element){
        copyIwaraVideo(getIdIwara(element.href), vidIndex, true);
    })
}, {domain: /iwara/ig})
api.mapkey('sr', 'copy source video link from oreno3d and erommdtube', async function(){
    api.Hints.create("*[href*='movie']", function(element){
        copyOreno3dAndMmdTube(element.href);
    })
}, {domain: /oreno3d|mmdtube/ig})
api.mapkey('co', 'copy source video link from oreno3d and erommdtube', async function(){
    copyIwaraVideo(document.querySelector('[href*="iwara.tv/video"]').href.match(/video\/.+(\/)?/)[0].replace(/video\/|\/.+/g, ''), vidIndex, true);
}, {domain: /oreno3d|mmdtube/ig})
api.mapkey('co', 'copy source video link from iwara', async function(){
    let vid = document.querySelectorAll('a[href*="iwara.tv/download"]');
    if(vid.length > 0){
        vid = vid[vidIndex];
        api.Clipboard.write(vid.href);
        runWithMpv(vid.href, document.location.href);
        return;
    }
    copyIwaraVideo(document.location.href.match(/video\/.+(\/)?/)[0].replace(/video\/|\/.+/g, ''), vidIndex);
    // const id = window.location.href.match(/videos\/.+$/)[0].replace('videos/', '')
    // getJSON(`https://ecchi.iwara.tv/api/video/${id}`, (status, res)=>{
    //     if(status){
    //         api.Front.showBanner('Error: ', status);
    //         return;
    //     }
    //     const json = res;
    //     let i = json.length <= 2 && vidIndex >= 2 ? 1 : vidIndex;
    //     const {uri} = json[vidIndex];
    //     api.Clipboard.write('https:'+uri);
    //     api.Front.showBanner('Copied ', uri)
    // })
}, {domain: /iwara.tv/ig})
api.mapkey('<Ctrl-h>', 'Mouse Over', function(){
    api.Hints.create("", function(element){
        Array.from(document.querySelectorAll('.name')).forEach(a => {
            mouseOut(a);
        })
        mouseOver(element);
    }, {multipleHits: true})
}, {domain: /nhentai/ig})
api.mapkey('<Ctrl-h>', 'Mouse Over', function(){
    api.Hints.create("", function(element){
        mouseOver(element);
    }, {multipleHits: true})
}, {domain: /iwara.tv/ig})
api.mapkey('<Ctrl-h>', 'Mouse Over', function(){
    api.Hints.create("", function(element){
        mouseOver(element);
    })
}, {domain: /^(?!.*(iwara.tv||nhentai))/ig})
api.mapkey('<Ctrl-j>', 'Mouse Out', function(){
    Array.from(document.querySelectorAll('.name')).forEach(a => {
        mouseOut(a);
    })
}, {domain: /nhentai/ig})
api.mapkey('<Ctrl-j>', 'Mouse Out', function(){
    api.Hints.create("", function(element){
        mouseOut(element);
    })
}, {domain: /^(?!.*nhentai)/ig})
api.mapkey('cc', 'Change video index in iwara', function(){
    vidIndex = vidIndex == 2 ? 0 : vidIndex + 1;
    api.Front.showBanner('Change index to ' + vidIndex);
}, {domain: /iwara.tv/ig})
api.unmap('d', /pixiv\..+/)
api.unmap('e', /pixiv\..+/)
api.unmap('z', /pixiv\..+/)
api.unmap('x', /pixiv\..+/)
api.unmap('s', /pixiv\..+/)
api.Hints.style('font-family:Arial;')


// set theme
//settings.theme = `
//.sk_theme {
//    font-family: Input Sans Condensed, Charcoal, sans-serif;
//    font-size: 10pt;
//    background: #24272e;
//    color: #abb2bf;
//}
//.sk_theme tbody {
//    color: #fff;
//}
//.sk_theme input {
//    color: #d0d0d0;
//}
//.sk_theme .url {
//    color: #61afef;
//}
//.sk_theme .annotation {
//    color: #56b6c2;
//}
//.sk_theme .omnibar_highlight {
//    color: #528bff;
//}
//.sk_theme .omnibar_timestamp {
//    color: #e5c07b;
//}
//.sk_theme .omnibar_visitcount {
//    color: #98c379;
//}
//.sk_theme #sk_omnibarSearchResult ul li:nth-child(odd) {
//    background: #303030;
//}
//.sk_theme #sk_omnibarSearchResult ul li.focused {
//    background: #3e4452;
//}
//#sk_status, #sk_find {
//    font-size: 20pt;
//}`;
// click `Save` button to make above settings to take effect.</ctrl-i></ctrl-y>

// configure theme

settings.theme = `
/* Edit these variables for easy theme making */
:root {
  /* Font */
  --font: 'Source Code Pro', Ubuntu, sans;
  --font-size: 12pt;
  --font-weight: bold;
  /* -------------- */
  /* --- THEMES --- */
  /* -------------- */
  /* -------------------- */
  /* -- Tomorrow Night -- */
  /* -------------------- */
  /* -- DELETE LINE TO ENABLE THEME
  --fg: #C5C8C6;
  --bg: #282A2E;
  --bg-dark: #1D1F21;
  --border: #373b41;
  --main-fg: #81A2BE;
  --accent-fg: #52C196;
  --info-fg: #AC7BBA;
  --select: #585858;
  -- DELETE LINE TO ENABLE THEME */
  /* Unused Alternate Colors */
  /* --cyan: #4CB3BC; */
  /* --orange: #DE935F; */
  /* --red: #CC6666; */
  /* --yellow: #CBCA77; */
  /* -------------------- */
  /* --      NORD      -- */
  /* -------------------- */
  /* -- DELETE LINE TO ENABLE THEME
  --fg: #E5E9F0;
  --bg: #3B4252;
  --bg-dark: #2E3440;
  --border: #4C566A;
  --main-fg: #88C0D0;
  --accent-fg: #A3BE8C;
  --info-fg: #5E81AC;
  --select: #4C566A;
  -- DELETE LINE TO ENABLE THEME */
  /* Unused Alternate Colors */
  /* --orange: #D08770; */
  /* --red: #BF616A; */
  /* --yellow: #EBCB8B; */
  /* -------------------- */
  /* --    DOOM ONE    -- */
  /* -------------------- */
  --fg: #51AFEF;
  --bg: #2E3440;
  --bg-dark: #21242B;
  --border: #2257A0;
  --main-fg: #51AFEF;
  --accent-fg: #98be65;
  --info-fg: #C678DD;
  --select: #4C566A;
  /* Unused Alternate Colors */
  /* --border-alt: #282C34; */
  /* --cyan: #46D9FF; */
  /* --orange: #DA8548; */
  /* --red: #FF6C6B; */
  /* --yellow: #ECBE7B; */
  /* -------------------- */
  /* --    MONOKAI    -- */
  /* -------------------- */
  /* -- DELETE LINE TO ENABLE THEME
  --fg: #F8F8F2;
  --bg: #272822;
  --bg-dark: #1D1E19;
  --border: #2D2E2E;
  --main-fg: #F92660;
  --accent-fg: #E6DB74;
  --info-fg: #A6E22E;
  --select: #556172;
  -- DELETE LINE TO ENABLE THEME */
  /* Unused Alternate Colors */
  /* --red: #E74C3C; */
  /* --orange: #FD971F; */
  /* --blue: #268BD2; */
  /* --violet: #9C91E4; */
  /* --cyan: #66D9EF; */
}
/* ---------- Generic ---------- */
.sk_theme {
background: var(--bg);
color: var(--fg);
  background-color: var(--bg);
  border-color: var(--border);
  font-family: var(--font);
  font-size: var(--font-size);
  font-weight: var(--font-weight);
}
input {
  font-family: var(--font);
  font-weight: var(--font-weight);
}
.sk_theme tbody {
  color: var(--fg);
}
.sk_theme input {
  color: var(--fg);
}
/* Hints */
#sk_hints .begin {
  color: var(--accent-fg) !important;
}
#sk_tabs .sk_tab {
  background: var(--bg-dark);
  border: 1px solid var(--border);
}
#sk_tabs .sk_tab_title {
  color: var(--fg);
}
#sk_tabs .sk_tab_url {
  color: var(--main-fg);
}
#sk_tabs .sk_tab_hint {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--accent-fg);
}
.sk_theme #sk_frame {
  background: var(--bg);
  opacity: 0.2;
  color: var(--accent-fg);
}
/* ---------- Omnibar ---------- */
/* Uncomment this and use settings.omnibarPosition = 'bottom' for Pentadactyl/Tridactyl style bottom bar */
/* .sk_theme#sk_omnibar {
  width: 100%;
  left: 0;
} */
.sk_theme .title {
  color: var(--accent-fg);
}
.sk_theme .url {
  color: var(--main-fg);
}
.sk_theme .annotation {
  color: var(--accent-fg);
}
.sk_theme .omnibar_highlight {
  color: var(--accent-fg);
}
.sk_theme .omnibar_timestamp {
  color: var(--info-fg);
}
.sk_theme .omnibar_visitcount {
  color: var(--accent-fg);
}
.sk_theme #sk_omnibarSearchResult ul li:nth-child(odd) {
  background: var(--bg-dark);
}
.sk_theme #sk_omnibarSearchResult ul li.focused {
  background: var(--border);
}
.sk_theme #sk_omnibarSearchArea {
  border-top-color: var(--border);
  border-bottom-color: var(--border);
}
.sk_theme #sk_omnibarSearchArea input,
.sk_theme #sk_omnibarSearchArea span {
  font-size: var(--font-size);
}
.sk_theme .separator {
  color: var(--accent-fg);
}
/* ---------- Popup Notification Banner ---------- */
#sk_banner {
  font-family: var(--font);
  font-size: var(--font-size);
  font-weight: var(--font-weight);
  background: var(--bg);
  border-color: var(--border);
  color: var(--fg);
  opacity: 0.9;
}
/* ---------- Popup Keys ---------- */
#sk_keystroke {
  background-color: var(--bg);
}
.sk_theme kbd .candidates {
  color: var(--info-fg);
}
.sk_theme span.annotation {
  color: var(--accent-fg);
}
/* ---------- Popup Translation Bubble ---------- */
#sk_bubble {
  background-color: var(--bg) !important;
  color: var(--fg) !important;
  border-color: var(--border) !important;
}
#sk_bubble * {
  color: var(--fg) !important;
}
#sk_bubble div.sk_arrow div:nth-of-type(1) {
  border-top-color: var(--border) !important;
  border-bottom-color: var(--border) !important;
}
#sk_bubble div.sk_arrow div:nth-of-type(2) {
  border-top-color: var(--bg) !important;
  border-bottom-color: var(--bg) !important;
}
/* ---------- Search ---------- */
#sk_status,
#sk_find {
  font-size: var(--font-size);
  border-color: var(--border);
}
.sk_theme kbd {
  background: var(--bg-dark);
  border-color: var(--border);
  box-shadow: none;
  color: var(--fg);
}
.sk_theme .feature_name span {
  color: var(--main-fg);
}
/* ---------- ACE Editor ---------- */
#sk_editor {
  background: var(--bg-dark) !important;
  height: 50% !important;
  /* Remove this to restore the default editor size */
}
.ace_dialog-bottom {
  border-top: 1px solid var(--bg) !important;
}
.ace-chrome .ace_print-margin,
.ace_gutter,
.ace_gutter-cell,
.ace_dialog {
  background: var(--bg) !important;
}
.ace-chrome {
  color: var(--fg) !important;
}
.ace_gutter,
.ace_dialog {
  color: var(--fg) !important;
}
.ace_cursor {
  color: var(--fg) !important;
}
.normal-mode .ace_cursor {
  background-color: var(--fg) !important;
  border: var(--fg) !important;
  opacity: 0.7 !important;
}
.ace_marker-layer .ace_selection {
  background: var(--select) !important;
}
//.ace_editor,
//.ace_dialog span,
//.ace_dialog input {
//  font-family: var(--font);
//  font-size: var(--font-size);
//  font-weight: var(--font-weight);
//}
`;



