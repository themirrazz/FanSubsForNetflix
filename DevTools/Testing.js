// Run this on Netflix to show the current time and duration at the top of the screen. Exact timestamps. Useful for creating fansubs.

(function () {
    var p = document.createElement('p');
    p.style.position = 'fixed';
    p.style.fontSize = '20px';
    p.style.top = '8px';
    p.style.pointerEvents = 'none';
    p.style.left = '0px';
    p.style.margin = '0px';
    p.style.width = '100%';
    p.style.color = 'white';
    p.style.textAlign = 'center';
    document.body.appendChild(p);
    setInterval(function () {
        var vi = document.querySelector('video');
        if(!vi) {
            p.innerText = "";
        } else {
            p.innerText = vi.currentTime + " / " + vi.duration;
        }
    });
})()
