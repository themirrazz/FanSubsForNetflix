// Created with help from inspection of https://github.com/gmertes/NflxMultiSubs/blob/master/src/nflxmultisubs.js

var subtitles = [];

var SubCache = {};

var CheckSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-icon-nflayerCheck ltr-nwhylu e1svuwfo1" data-name="Checkmark" aria-labelledby=":r41:" aria-hidden="true" data-uia="audio-selected"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.2928 4.29285L22.7071 5.70706L8.70706 19.7071C8.51952 19.8946 8.26517 20 7.99995 20C7.73474 20 7.48038 19.8946 7.29285 19.7071L0.292847 12.7071L1.70706 11.2928L7.99995 17.5857L21.2928 4.29285Z" fill="currentColor"></path></svg>`;

setInterval(function () {
    var base = document.querySelector('div[data-uia=selector-audio-subtitle]');
    if(!base) {
        return;
    }
    var OldDiv = base.querySelector('.TMR_FANSUBS');
    if(!OldDiv) {
        RenderFanSubsMenu();
    }
    base.parentNode.parentNode.style.left = 'auto';
    base.parentNode.parentNode.style.right = '10px';
},100);

function RenderFanSubsMenu () {
    var base = document.querySelector('div[data-uia=selector-audio-subtitle]');
    var OldDiv = base.querySelector('.TMR_FANSUBS');
    var div = document.createElement('div');
    base.appendChild(div);
    if(OldDiv) {
        OldDiv.parentElement.removeChild(OldDiv);
    }
    div.className = 'ltr-zb0y0j TMR_FANSUBS';
    div.classList.add('structural', 'track-list-subtitles');
    var h3 = document.createElement('h3');
    h3.className = 'ltr-r2srcr';
    h3.innerText = 'Fansubs';
    div.appendChild(h3);
    var ul2 = document.createElement('ul');
    var li2 = document.createElement('li');
    li2.className = 'ltr-1lif7jb';
    ul2.className = 'ltr-19w99fl';
    ul2.appendChild(li2);
    li2.innerHTML = '<div class="ltr-9eiaos">Add Repo...</div>';
    li2.onclick = function () {
        var dE = prompt('Repository URL:');
        if(!dE) { return; };
        OnFanSubsAdded(dE);
    }
    div.appendChild(ul2);
    var ul3 = document.createElement('ul');
    var li3 = document.createElement('li');
    li3.className = 'ltr-1lif7jb';
    ul3.className = 'ltr-19w99fl';
    ul3.appendChild(li3);
    try {
        if(JSON.parse(GetActiveObject()).type==='none') {
            li3.innerHTML = CheckSVG+'<div class="ltr-gl4ltf">No Fansubs</div>';
        } else {
            li3.innerHTML = '<div class="ltr-9eiaos">No Fansubs</div>';
        }
    } catch (ERO420954) {
        li3.innerHTML = CheckSVG+'<div class="ltr-gl4ltf">No Fansubs</div>';
    }
    li3.onclick = function () {
        SetActiveObject(JSON.stringify({
            type: 'none'
        }));
        RenderFanSubsMenu();
    }
    div.appendChild(ul2);
    div.appendChild(ul3);
    var r = GetRepos();
    r.forEach(repo => {
        var p = document.createElement('h3');
        p.style.fontSize = '2vh';
        p.innerText = repo.repo.name;
        div.appendChild(p);
        var db = document.createElement('button');
        db.style.backgroundColor = 'black';
        db.style.border = '1px solid white';
        db.style.padding = '1.2vh';
        db.style.fontSize = '1.5vh';
        db.innerText = 'Delete';
        db.addEventListener('click',function () {
            var kwg = confirm(
                "Are you sure you want to remove the repository:\n\n"+
                "Name: "+repo.repo.name+"\n"+
                "URL: "+repo.url+"\n\n"+
                "Will remove "+repo.repo.languages.length+" language(s)"
            );
            var dwx = JSON.parse(GetActiveObject());
            if(dwx.type == 'subtitle' && dwx.url == repo.url) {
                SetActiveObject(JSON.stringify({
                    type: 'none'
                }));
                subtitles = [];
            }
            if(kwg) {
                RmRepo(repo.url);
                setTimeout(function () {
                    RenderFanSubsMenu();
                });
            }
        });
        p.appendChild(db);
        var ul = document.createElement('ul');
        ul.className = 'ltr-19w99fl';
        div.appendChild(ul);
        repo.repo.languages.forEach(lang => {
            var f = document.createElement('li');
            f.className = 'ltr-1lif7jb';
            f.dataset.gkx = JSON.stringify({
                type: 'subtitle',
                url: repo.url,
                id: lang.id
            });
            f.addEventListener('click', function () {
                SetActiveObject(this.dataset.gkx);
                RenderFanSubsMenu();
            });
            f.tabIndex = "0";
            var Contain = document.createElement('div');
            f.appendChild(Contain);
            var Text = document.createElement('div');
            if(f.dataset.gkx === GetActiveObject()) {
                var IconBox = document.createElement('div');
                IconBox.innerHTML = CheckSVG;
                var Icon = IconBox.querySelector('svg');
                Contain.appendChild(Icon);
                Text.className = 'ltr-gl4ltf';
            } else {
                Text.className = 'ltr-9eiaos';
            }
            Text.innerText = lang.name;
            Contain.appendChild(Text);
            ul.appendChild(f);
        });
    });
    UpdateCurTitles();
}

function UpdateCurTitles() {
    var pp = JSON.parse(GetActiveObject());
    if(pp.type=='none'||VidId===null) {
        subtitles = []
    } else if(pp.type=='subtitle') {
        ChangeSubtitles(
            pp.url+'/'+VidId+'/'+pp.id+'.json'
        );
    }
}


function RemoveRepository (repo) {
    var kwg = confirm(
        "Are you sure you want to remove the repository:\n\n"+
        "Name: "+repo.repo.name+"\n"+
        "URL: "+repo.url+"\n\n"+
        "Will remove "+repo.repo.languages.length+" language(s)"
    );
    var dwx = JSON.parse(GetActiveObject());
    if(dwx.type == 'subtitle' && dwx.url == repo.url) {
        SetActiveObject(JSON.stringify({
            type: 'none'
        }));
        subtitles = [];
    }
    if(kwg) {
        RmRepo(repo.url);
        setTimeout(function () {
            RenderFanSubOptions();
        });
    }
};

function OnFanSubsAdded (kkd) {
    ValidateFansubRepoRoot(
        kkd, function () { alert('Could not validate repository.') },
        function (da) {
            AddRepo(
                (
                    kkd.endsWith("/")?kkd.slice(0,kkd.length-1):kkd
                ),
                da
            );
            alert('Repository Added');
            RenderFanSubOptions();
        }
    )
}




function ChangeSubtitles (url) {
    if(SubCache[url]) {
        subtitles = SubCache[url];
    } else {
        subtitles = [];
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(this.readyState == 4&&this.status==200) {
                try {
                    var kkk = JSON.parse(this.responseText);
                    subtitles = kkk;
                    SubCache[url] = kkk;
                } catch (error) {
                    return null;
                }
            }
        };
        xhr.open('GET', url);
        xhr.send();
    }
}


var GetRepos = function () {
    try {
        if(localStorage.getItem('fansub-repositories') === null) {
            throw null;
        }
        return JSON.parse(localStorage.getItem('fansub-repositories'));
    } catch (error) {
        localStorage.setItem('fansub-repositories', '[]');
        return []
    }
};


// Removed due to easier implementation
var GetRepos_DoubleOld = function () {
    return REPO_LIST;
}

function SetActiveObject (d) {
    localStorage.setItem('fansub-active',d);
}

function GetActiveObject() {
    if(localStorage.getItem('fansub-active') !== null) {
        return localStorage.getItem('fansub-active')
    } else {
        localStorage.setItem('fansub-active',JSON.stringify({
            type: 'none'
        }));
        return JSON.stringify({
            type: 'none'
        });
    }
}

function AddRepo (url, repo) {
    if(HasRepo(url)) { return false; }
    var d = { url: url, repo: repo };
    var k = GetRepos();
    k.push(d);
    localStorage.setItem('fansub-repositories', JSON.stringify(k));
}

function HasRepo(url) {
    var k = GetRepos();
    for(var i = 0; i < k.length; i++) {
        if(k.url === url) {
            return true;
        }
    }
}

function RmRepo(url) {
    var k = GetRepos();
    var g = [];
    for(var i = 0; i < k.length; i++) {
        if(k[i].url !== url) {
            g.push(k[i]);
        }
    }
    localStorage.setItem('fansub-repositories', JSON.stringify(g));
}


function ValidateFansubRepoRoot (url, uhoh, ok) {
    if(url.endsWith("/")) {
        url = url.slice(0, url.length - 1);
    }
    try {
        new URL(url+'/index.json');
        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function () {
            if(this.readyState == 4) {
                try {
                    var k = JSON.parse(this.responseText);
                    ok(k);
                } catch (error) {
                    uhoh(error);
                }
            }
        };
        xml.open(
            'GET',url
        );
        xml.send();
    } catch (error) {
        uhoh(error);
    }
}

var FanSubContainer = document.createElement('div');
FanSubContainer.setAttribute('style',"pointer-events: none; left: 0px; height: fit-content; width: 100%; position: fixed; bottom: 8%; inset: 54px 0px; direction: ltr;");
FanSubContainer.className = 'player-timedtext player-fansubs'
document.body.appendChild (FanSubContainer);

var FanSubSetup = document.createElement('div');
FanSubSetup.style.backgroundColor = 'white';
FanSubSetup.style.position = 'fixed';
FanSubSetup.style.left = '0px';
FanSubSetup.style.top = '0px';
FanSubSetup.style.width = '50%';
FanSubSetup.style.height = '100%';
FanSubSetup.style.overflow = 'auto';
document.body.appendChild(FanSubSetup);
FanSubSetup.style.color = 'black';
FanSubSetup.appendChild((function () {
    var h1 = document.createElement('h1');
    h1.innerText = 'Fansubs';
    h1.style.fontSize = '48px';
    h1.style.margin = '4px';
    return h1;
})());
var FanSubSetupX = document.createElement('div');
FanSubSetupX.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="18" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';
FanSubSetupX.style.top = '4px';
FanSubSetupX.style.right = '4px';
FanSubSetupX.style.position = 'absolute';
FanSubSetupX.style.cursor = 'pointer';
FanSubSetupX.onclick = function () {
    FanSubSetup.style.display = 'none';
};
FanSubSetup.appendChild(FanSubSetupX);
var FanSubAdd = document.createElement('button');
FanSubAdd.innerText = 'Add Repository';
FanSubAdd.addEventListener('click', function () {
    var kkd = prompt('Fansub Repository URL');
    if(!kkd) { return; }
    ValidateFansubRepoRoot(
        kkd, function () { alert('Could not validate repository.') },
        function (da) {
            AddRepo(
                (
                    kkd.endsWith("/")?kkd.slice(0,kkd.length-1):kkd
                ),
                da
            );
            alert('Great! Repository added!');
            RenderFanSubOptions();
        }
    )
});
FanSubSetup.appendChild(FanSubAdd);
FanSubSetup.style.zIndex = '10';
FanSubSetup.style.display = 'none';
var FanSubOptions = document.createElement('div');
FanSubSetup.appendChild(FanSubOptions);

function RenderFanSubOptions() {
    FanSubOptions.innerHTML = '';
    var NoCaptionsButton = document.createElement('div');
    NoCaptionsButton.style.color = 'black';
    NoCaptionsButton.style.fontSize = '24px';
    NoCaptionsButton.dataset.gkx = JSON.stringify({
        type: 'none'
    });
    NoCaptionsButton.className = 'fansub-settings-button';
    NoCaptionsButton.innerText = "No Captions";
    NoCaptionsButton.addEventListener('click', function () {
        SetActiveObject(JSON.stringify({
            type: 'none'
        }));
        RenderFanSubOptions();
    });
    FanSubOptions.appendChild(NoCaptionsButton);
    var r = GetRepos();
    r.forEach(repo => {
        var p = document.createElement('p');
        p.style.fontSize = '15px';
        p.innerText = repo.repo.name;
        FanSubOptions.appendChild(p);
        var db = document.createElement('button');
        db.innerText = 'Delete';
        db.addEventListener('click',function () {
            var kwg = confirm(
                "Are you sure you want to remove the repository:\n\n"+
                "Name: "+repo.repo.name+"\n"+
                "URL: "+repo.url+"\n\n"+
                "Will remove "+repo.repo.languages.length+" language(s)"
            );
            var dwx = JSON.parse(GetActiveObject());
            if(dwx.type == 'subtitle' && dwx.url == repo.url) {
                SetActiveObject(JSON.stringify({
                    type: 'none'
                }));
                subtitles = [];
            }
            if(kwg) {
                RmRepo(repo.url);
                setTimeout(function () {
                    RenderFanSubOptions();
                });
            }
        });
        p.appendChild(db);
        repo.repo.languages.forEach(lang => {
            var f = document.createElement('div');
            f.className = 'fansub-settings-button';
            f.dataset.gkx = JSON.stringify({
                type: 'subtitle',
                url: repo.url,
                id: lang.id
            });
            f.addEventListener('click', function () {
                SetActiveObject(this.dataset.gkx);
                RenderFanSubOptions();
            });
            f.innerText = lang.name;
            f.style.fontSize = '24px';
            f.style.color = 'black';
            f.style.cursor = 'pointer';
            FanSubOptions.appendChild(f);
        });
    });
    FanSubOptions.querySelectorAll('.fansub-settings-button').forEach(b => {
        if(b.dataset.gkx === GetActiveObject()) {
            b.style.color = 'blue';
        }
    });
    var pp = JSON.parse(GetActiveObject());
    if(pp.type=='none'||VidId===null) {
        subtitles = []
    } else if(pp.type=='subtitle') {
        console.log(pp.url+'/'+VidId+'/'+pp.id+'.json')
        ChangeSubtitles(
            pp.url+'/'+VidId+'/'+pp.id+'.json'
        );
    }
}

RenderFanSubOptions();

var FSButton = document.createElement('div');
FSButton.style.fontSize = '32px';
FSButton.innerText = 'FS';
FSButton.title = 'Fansubs';
FSButton.style.position = 'fixed';
FSButton.style.left = '64px';
FSButton.style.top = '24px';
FSButton.style.cursor = 'pointer';
FSButton.style.zIndex = '1';
FSButton.onclick = function () {
    FanSubSetup.style.display = '';
}
//document.body.appendChild(FSButton);

setInterval(function () {
    if(document.querySelector('.active.ltr-fntwn3')) {
        FSButton.style.display = '';
    } else {
        FSButton.style.display = 'none';
    }
});

function GetVideoArea() {
    return document.querySelector('.watch-video');
};
function GetVideoContainer() {
    return GetVideo().parentNode;
}
function GetVideo() {
    return GetVideoArea().querySelector('video');
}
function GetVideoID() {
    return GetVideoContainer().id;
}
function LoadSubtitles(url) {
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function () {
        if(this.readyState == 4) {
            try {
                subtitles = JSON.parse(this.responseText)
            } catch (error) {
                subtitles = [];
            }
        }
    };
    xml.open('GET', url);
    xml.send();
};

function GenerateSubtitleElement (sub) {
    var div = document.createElement('div');
    div.className = 'player-timedtext-text-container';
    div.setAttribute('style',"display:block;white-space:nowrap;text-align:center;position:fixed;left:0%;width:100%;bottom:10%; overflow: auto;");
    /*var span0 = document.createElement('span');
    div.appendChild(span0);
    span0.setAttribute('style','display:inline-block;text-align:start');*/
    sub.lines.forEach(function (line) {
        var g = document.createElement('p');
        g.setAttribute('style',"margin:0px;margin-top:3px;margin-bottom:3px;font-size:26px;line-height:normal;font-weight:normal;color:#ffffff;text-shadow:#000000 0px 0px 7px;font-family:Netflix Sans,Helvetica Nueue,Helvetica,Arial,sans-serif;font-weight:bolder");
        g.setAttribute('lang',sub.lang||'en');
        g.innerText = line;
        div.appendChild(g);
    });
    return div
}

function UpdateSubtitles () {
    var d = (function () {
        for(var i = 0; i < subtitles.length; i++) {
            if(
                GetVideo().currentTime >= subtitles[i].start
                &&
                GetVideo().currentTime < subtitles[i].end
            ) {
                return subtitles[i];
            }
        }
    })();
    if(!d) {
        FanSubContainer.innerHTML = "";
        return;
    }
    var el = GenerateSubtitleElement(d);
    FanSubContainer.innerHTML = "";
    FanSubContainer.appendChild(el);
}


var VidId = null;

setInterval(function () {
    if(!GetVideoArea()) {
        VidId = null;
        FanSubContainer.style.display = 'none';
        return;
    }
    if(!GetVideo()) {
        VidId = null;
        FanSubContainer.style.display = 'none';
        return;
    }
    if(GetVideoID() !== VidId) {
        VidId = GetVideoID();
        var pp = JSON.parse(GetActiveObject());
        if(pp.type=='none') {
            subtitles = []
        } else if(pp.type=='subtitle') {
            console.log(pp.url+'/'+VidId+'/'+pp.id+'.json')
            ChangeSubtitles(
                pp.url+'/'+VidId+'/'+pp.id+'.json'
            );
        }
    }
    try {
        FanSubContainer.style.display = '';
        UpdateSubtitles();
    } catch (error) {
        console.error(error);
    }
});