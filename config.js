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
api.mapkey(';x', 'Remove element', function() {
    api.Hints.create("", function(element){
        element.remove();
    })
});
function mouseOver(element){
    let event = new MouseEvent('mouseover', {
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
function getJSON(url, callback, xVersionHeader = null) {
        fetch(url, {
          headers: {
            'x-version': xVersionHeader,
          }
        })
    .then(response => response.json())
    .then(data => callback(null,data))
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
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'document';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        return callback(null, xhr.response);
      } else {
        return callback(status, xhr.response);
      }
    };
    xhr.send();
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
function copyIwaraVideo(id, index){
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
            const uri = json[i].src.download;
            api.Clipboard.write('https:'+uri);
            api.Front.showBanner('Copied ', uri)
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
    getHTML('https://mmdfans.net/?query='+convertStringToQueryString(title), function(s, res){
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
        console.log(videos[index].href)
        window.open(videos[index].href);
        
    })
}
function convertStringToIwaraQuery(s){
    return s.replaceAll(' ', '+');
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
    let user = {};
    for(let o of results){
        if(author.indexOf(o.name) != -1){
            user = o;
            break;
        }
    }
    let pageTotal = 0;
    for(let i = 0; i<=pageTotal;i++){
        const userObject = await fetchData('https://api.iwara.tv/videos?page='+i+'&sort=date&user='+user.id);
        const videos = userObject.results;
        pageTotal = Math.floor(userObject.count/userObject.limit);
        for(let vid of videos){
            if(vid.title.indexOf(title) != -1){
                
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
api.mapkey('cs', 'Open by iwara', function(){
    getJSON(document.querySelector('[href*="https://ecchi.iwara"]').href.replace(/.+\//, ''), function(s, json){
    })
    window.open();
}, {domain: /erommdtube.com|oreno3d/ig})
api.mapkey('cv', 'Open by mmdfans', async function(){
    const url = document.querySelector('[href*="iwara.tv/video"]').href.replace('ecchi.iwara.tv/videos', 'iwara.tv/video');
    console.log(url)
    getHTML(url, function(s, res){
        if(res.innerText.toLowerCase().indexOf('private') != -1) {
            api.Front.showPopup('The video is private')
            return;
        }
        const title = res.querySelector(selectorTitle).innerText;
        console.log(title)
        GoToMmdFansVid(title);
    })
}, {domain: /erommdtube.com|oreno3d/ig})
api.mapkey('co', 'copy source video link from mmdfans', function(){
    const vid = document.querySelector('*[src*="cdn."][src*="video"]');
    api.Clipboard.write(vid.src);
}, {domain: /mmdfans/ig})
api.mapkey('co', 'copy source video link from iwara', function(){
    let vid = document.querySelectorAll('a[href*="iwara.tv/download"]');
    if(vid){
        vid = vid[vidIndex];
        api.Clipboard.write(vid.href);
        return;
    }
    copyIwaraVideo(document.location.href.match(/video\/.+\//)[0].replace(/video|\//g, ''), vidIndex);
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
        mouseOver(element);
    }, {multipleHits: true})
}, {domain: /iwara.tv/ig})
api.mapkey('<Ctrl-h>', 'Mouse Over', function(){
    api.Hints.create("", function(element){
        mouseOver(element);
    })
}, {domain: /^(?!.*iwara.tv)/ig})
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


