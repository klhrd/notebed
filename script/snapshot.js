(function()
{
    let notebedSnapshotStyle="icons";

    let theme='light';
    let COLORS=
    {
        bgGap: '#f0f0f0',
        bgDefault: '#fafafa',

        textDefault: '#000000',
        textMuted: '#808080',

        scrollbarThumb: '#e0e0e0',
        scrollbarThumbHover: '#d0d0d0'
    }
    let isOpaque=true;

    
    if(document.getElementById('notebed-snapshot'))
    {
        const notebedSnapshot=document.getElementById('notebed-snapshot');
        
        if(notebedSnapshot.dataset.style==notebedSnapshotStyle)
        {
            notebedSnapshot.remove();
            return;
        }
        else
        {
            notebedSnapshot.dataset.style=notebedSnapshotStyle;
        }
    }

    let htmlPolicy;
    if(window.trustedTypes&&window.trustedTypes.createPolicy)
    {
        try
        {
            htmlPolicy=window.trustedTypes.createPolicy('notebedPolicy',
            {
                createHTML:(string)=>string
            });
        }
        catch(e)
        {
            if(window.trustedTypes.defaultPolicy)
            {
                htmlPolicy=window.trustedTypes.defaultPolicy;
            }
        }
    }

    const STORAGE_KEY_XYWHT="NOTEBED_SNAPSHOT_XYWHT";

    const notebedSnapshot=document.createElement('notebed-snapshot');
    notebedSnapshot.id='notebed-snapshot';
    notebedSnapshot.dataset.style="icons";
    document.body.appendChild(notebedSnapshot);
    const shadowRoot=notebedSnapshot.attachShadow({mode:'open'});

    // link
    if(!document.querySelector('link[href*="Material+Symbols+Outlined"]'))
    {
        const globalLink=document.createElement('link');
        globalLink.rel='stylesheet';
        globalLink.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
        document.head.appendChild(globalLink);
    }

    if (typeof html2canvas==='undefined')
    {
        const script=document.createElement('script');
        script.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.async=true;
        script.onload=()=>
        {
            console.log('html2canvas ok');
            init();
        };
        document.head.appendChild(script);
        console.log("hi")
    }

    init();

    // init====================================================================================================================================================================
    function init()
    {

        renderNotebedSnapshot();
        addEventListeners();
        
        const notebedContainer=shadowRoot.getElementById('notebed-container');
        const notebedNote=shadowRoot.getElementById('notebed-shot');
        updateNotebedOpacity();
        
        // load XYWHT
        const XYWHT=JSON.parse(localStorage.getItem(STORAGE_KEY_XYWHT))||{x:"10px",y:"10px",w:"200px",h:"200px",t:"light"};
        notebedContainer.style.left=Math.max(parseInt(XYWHT.x,10),10)+"px";
        notebedContainer.style.top=Math.max(parseInt(XYWHT.y,10),10)+"px";
        notebedContainer.style.width=XYWHT.w;
        notebedContainer.style.height=XYWHT.h;
        theme=XYWHT.t;
        
        updateTheme();
        
        saveNotebedXYWHT();
    }

    function renderNotebedSnapshot()
    {

        shadowRoot.innerHTML=``;
        shadowRoot.innerHTML=`
<style>
    @font-face {
        font-family: 'Material Symbols Outlined';
        font-style: normal;
        font-weight: 400;
        src: url(https://gstatic.com) format('truetype');
    }

    .material-symbols-outlined
    {
        font-family: 'Material Symbols Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        display: inline-block;
        white-space: nowrap;
        -webkit-font-smoothing: antialiased;
    }

    #notebed-container
    {
        all: initial; 

        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
        width: 200px;
        height: 200px;
        
        position: fixed;
        left: 10px;
        top: 10px;
        
        border-radius: 10px;
        background-color: #00000000;
        transition: background-color ease 0.3s;
        box-shadow: 0px 0px 3px 1px #00000050;
        
        z-index: 99999;
        
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 5px;

        resize: both;
        overflow: hidden;

        box-sizing: content-box;
        min-width: 50px;
        min-height: 25px;

        font-family: Arial, Helvetica, sans-serif;
        text-align: left;
    }

    #notebed-nav
    {
        flex: 0 0 auto;

        background-color: var(--bg-default);
        transition: background-color ease 0.3s;
        border-radius: 5px;
        
        display: flex;
        justify-content: end;
        align-items: center;

        overflow: hidden;
        color: var(--text-default);
        transition: color ease 0.3s;
    }

    #notebed-nav-title
    {
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
    
    #notebed-nav-title:hover
    {
        cursor: grab;
    }

    .notebed-nav-btn
    {
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        
        background-color: #00000000;
        user-select: none;
        height: 1.6rem;
        width: 1.6rem;
        border-radius: 50%;
        
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .notebed-nav-btn>span
    {
        font-size: 20px;
        color: var(--text-default);
        transition: color ease 0.3s;
    }

    .notebed-nav-btn:hover
    {
        background-color: #88888830;
        cursor: pointer;
    }

    #notebed-nav-btn-drag
    {
        cursor: grab;
    }

    #notebed-shot
    {
        border-radius: 5px;
        background-color: #00000000;
        box-shadow: 0px 0px 3px 1px #00000050 inset;
        transition: background-color ease 0.3s;
        height: 100%;
        
        flex: 1 1 auto;

        overflow-y: auto;
        outline: none;

        padding: 0px;

        position: relative;

        color: var(--text-default);
        transition: color ease 0.3s;

        overflow: hidden;
    }

    #notebed-shot.notebed-shot-empty::before
    {
        content: "take notes here... ";
        cursor: text;

        color: var(--text-muted);
        transition: background-color ease 0.3s;
        position: absolute;

        pointer-events: none;
    }
</style>

<div id="notebed-container">
    <div id="notebed-nav">
        <span id="notebed-nav-title" style="margin-right: auto; padding: 3px; user-select: none;">ℕ𝕆𝕋𝔼𝔹𝔼𝔻</span>
        <button class="notebed-nav-btn" id="notebed-nav-btn-add"><span class="material-symbols-outlined">screenshot_region</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-theme"><span class="material-symbols-outlined">light_mode</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-opacity"><span class="material-symbols-outlined">visibility</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div id="notebed-shot"></div>
</div>
`;
    }

    function addEventListeners()
    {
        const notebedContainer=shadowRoot.getElementById('notebed-container');
        const notebedDragger=shadowRoot.getElementById('notebed-nav-title');
        const notebedOpacityBtn=shadowRoot.getElementById('notebed-nav-btn-opacity');
        const notebedAddBtn=shadowRoot.getElementById('notebed-nav-btn-add');
        const notebedThemeBtn=shadowRoot.getElementById('notebed-nav-btn-theme');
        const notebedCloseBtn=shadowRoot.getElementById('notebed-nav-btn-close');
        console.log(notebedAddBtn);

        //drag
        let isDragging=false;
        let offsetX=0;
        let offsetY=0;

        notebedDragger.addEventListener('mousedown',(e)=>
        {
            isDragging=true;
            offsetX=e.clientX-notebedContainer.offsetLeft;
            offsetY=e.clientY-notebedContainer.offsetTop;
            notebedDragger.style.cursor='grabbing';
        });

        window.addEventListener('mousemove',(e)=>
        {
            if(!isDragging)return;
            notebedContainer.style.left=e.clientX-offsetX+'px';
            notebedContainer.style.top=e.clientY-offsetY+'px';
        });

        window.addEventListener('mouseup',()=>
        {
            isDragging=false;
            notebedDragger.style.cursor='grab';
            saveNotebedXYWHT();
        });

        // theme
        notebedThemeBtn.addEventListener('click',(e)=>
        {
            e.stopPropagation();
            if(theme=='light')
            {
                theme='dark';
            }
            else
            {
                theme='light';
            }
            updateTheme();
            saveNotebedXYWHT();
        });

        // opacity
        notebedOpacityBtn.addEventListener('click',(e)=>
        {
            e.stopPropagation();
            isOpaque=!isOpaque;
            updateNotebedOpacity();
            saveNotebedXYWHT();
        });

        // shot
        let isShotted=false
        notebedAddBtn.addEventListener('click',(e)=>
        {
            e.stopPropagation();
            const notebedShot=shadowRoot.getElementById('notebed-shot');

            if(!isShotted)
            {
                captureArea();
                isShotted=true;
                notebedShot.style.boxShadow='none';
                notebedAddBtn.firstElementChild.textContent='delete';
            }
            else
            {
                notebedShot.firstElementChild.remove();
                isShotted=false;
                notebedShot.style.boxShadow='0px 0px 3px 1px #00000050 inset';
                notebedAddBtn.firstElementChild.textContent='screenshot_region';
            }
            saveNotebedXYWHT();
        });

        // close
        notebedCloseBtn.addEventListener('click',(e)=>
        {
            e.stopPropagation();
            saveNotebedXYWHT();
            notebedSnapshot.remove();
        });
    }

    function captureArea()
    {
        const notebedShot=shadowRoot.getElementById('notebed-shot');
        const rect=notebedShot.getBoundingClientRect();

        notebedShot.style.display='none';

        html2canvas(document.body,
            {
                useCORS: true,
                allowTaint: true,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                x: window.scrollX,
                y: window.scrollY,
                width: window.innerWidth,
                height: window.innerHeight,
                windowWidth: document.documentElement.clientWidth,
                windowHeight: document.documentElement.clientHeight
            }
        ).then(canvas=>
            {
                notebedShot.style.display='block';

                const cropCanvas=document.createElement('canvas');
                const ctx=cropCanvas.getContext('2d');

                const dpr=window.devicePixelRatio||1;
                cropCanvas.width=rect.width*dpr;
                cropCanvas.height=rect.height*dpr;
                ctx.imageSmoothingEnabled=true;

                ctx.drawImage(
                    canvas,
                    rect.left*dpr,rect.top*dpr,
                    rect.width*dpr,rect.height*dpr,
                    0,0,
                    rect.width*dpr,rect.height*dpr                    
                )

                const imgDiv=document.createElement('div');
                const newImg=document.createElement('img');
                newImg.src=cropCanvas.toDataURL('image/png');
                Object.assign(newImg.style,
                    {
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        pointerEvents: 'none'
                    }
                )
                imgDiv.appendChild(newImg);
                notebedShot.appendChild(imgDiv);
            }
        ).catch(err=>
            {
            console.error(err);
            }
        );
    }

    function updateNotebedOpacity()
    {
        const notebedContainer=shadowRoot.getElementById('notebed-container');
        const notebedOpacityBtn=shadowRoot.getElementById('notebed-nav-btn-opacity');

        if(isOpaque)
        {
            notebedContainer.style.opacity=1;
            notebedOpacityBtn.firstElementChild.textContent="visibility";
        }
        else
        {
            notebedContainer.style.opacity=0.5;
            notebedOpacityBtn.firstElementChild.textContent="visibility_off";
        }
    }

    function saveNotebedXYWHT()
    {
        const notebedContainer=shadowRoot.getElementById('notebed-container');
        const XYWHT=
        {
            x:notebedContainer.style.left,
            y:notebedContainer.style.top,
            w:notebedContainer.style.width,
            h:notebedContainer.style.height,
            t:theme
        };

        localStorage.setItem(STORAGE_KEY_XYWHT,JSON.stringify(XYWHT));
    }

    function updateTheme()
    {
        const notebedThemeBtn=shadowRoot.getElementById('notebed-nav-btn-theme');
        const notebedContainer=shadowRoot.getElementById('notebed-container');
        if(!notebedContainer)return;

        if(theme=='light')
        {
            notebedThemeBtn.firstElementChild.textContent="light_mode";
            COLORS=
            {
                bgGap: '#f0f0f0',
                bgDefault: '#fafafa50',

                textDefault: '#000000',
                textMuted: '#808080',

                scrollbarThumb: '#e0e0e0',
                scrollbarThumbHover: '#d0d0d0'
            }
        }
        else if(theme=='dark')
        {
            notebedThemeBtn.firstElementChild.textContent="dark_mode";
            COLORS=
            {
                bgGap: '#141414',
                bgDefault: '#20202050',

                textDefault: '#fafafa',
                textMuted: '#808080',

                scrollbarThumb: '#303030',
                scrollbarThumbHover: '#383838'
            }
        }
        else
        {
            console.error("theme error");
        }

        notebedContainer.style.setProperty('--bg-gap', COLORS.bgGap);
        notebedContainer.style.setProperty('--bg-default', COLORS.bgDefault);
        notebedContainer.style.setProperty('--text-default', COLORS.textDefault);
        notebedContainer.style.setProperty('--text-muted', COLORS.textMuted);
        notebedContainer.style.setProperty('--scrollbar-thumb', COLORS.scrollbarThumb);
        notebedContainer.style.setProperty('--scrollbar-thumb-hover', COLORS.scrollbarThumbHover);
    }
})();
