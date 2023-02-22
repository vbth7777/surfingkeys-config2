// an example to create a new mapping `ctrl-y`
api.mapkey('<ctrl-y>', 'Show me the money', function() {
    Front.showPopup('a well-known phrase uttered by characters in the 1996 film Jerry Maguire (Escape to close).');
});

// an example to replace `T` with `gt`, click `Default mappings` to see how `T` works.
api.map('gt', 'T');

// an example to remove mapkey `Ctrl-i`
api.unmap('<ctrl-i>');

// ------------------configure----------------
settings.smoothScroll = true;
api.unmap('x')
api.mapkey(';x', 'Remove element', function() {
    api.Hints.create("", function(element){
        element.remove();
    })
});
function getJSON(url, callback) {
    api.Front.showBanner("Loading...")
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};
function getHTML(url, callback) {
    api.Front.showBanner("Loading...")
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'document';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};
function copyIwaraVideo(id, index){
    getJSON(`https://ecchi.iwara.tv/api/video/${id}`, (status, res)=>{
        if(status){
            api.Front.showBanner('Error: ', status);
            return;
        }
        const json = res;
        let i = json.length <= 2 && index >= 2 ? 1 : index;
        const {uri} = json[index];
        api.Clipboard.write('https:'+uri);
        api.Front.showBanner('Copied ', uri)
    })
}
let vidIndex = 1;
api.mapkey('cs', 'copy source video link from iwara', function(){
    const id = window.location.href.match(/videos\/.+$/)[0].replace('videos/', '')
    copyiwaravideo(id, vidindex);
}, {domain: /erommdtube.com/ig})
api.mapkey('co', 'copy source video link from iwara', function(){
    const id = window.location.href.match(/videos\/.+$/)[0].replace('videos/', '')
    getJSON(`https://ecchi.iwara.tv/api/video/${id}`, (status, res)=>{
        if(status){
            api.Front.showBanner('Error: ', status);
            return;
        }
        const json = res;
        let i = json.length <= 2 && vidIndex >= 2 ? 1 : vidIndex;
        const {uri} = json[vidIndex];
        api.Clipboard.write('https:'+uri);
        api.Front.showBanner('Copied ', uri)
    })
}, {domain: /iwara.tv/ig})
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

