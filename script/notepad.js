(function()
{
    let notebedNotepadStyle="icons";

    let theme='light';
    let COLORS=
    {
        bgGap: '#ff0000',
        bgDefault: '#fafafa',

        textDefault: '#000000',
        textMuted: '#808080',

        scrollbarThumb: '#e0e0e0',
        scrollbarThumbHover: '#d0d0d0'
    }
    let isOpaque=true;

    
    if(document.getElementById('notebed-notepad'))
    {
        const notebedNotepad=document.getElementById('notebed-notepad');
        
        if(notebedNotepad.dataset.style==notebedNotepadStyle)
        {
            notebedNotepad.remove();
            return;
        }
        else
        {
            notebedNotepad.dataset.style=notebedNotepadStyle;
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

    STORAGE_KEY_CONTENT="NOTEBED_NOTE_CONTENT";
    STORAGE_KEY_XYWHT="NOTEBED_XYWHT";

    const notebedNotepad=document.createElement('notebed-notepad');
    notebedNotepad.id='notebed-notepad';
    notebedNotepad.dataset.style="icons";
    document.body.appendChild(notebedNotepad);
    const shadowRoot=notebedNotepad.attachShadow({mode:'open'});

    // link
    if(!document.querySelector('link[href*="Material+Symbols+Outlined"]'))
    {
        const globalLink=document.createElement('link');
        globalLink.rel='stylesheet';
        globalLink.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
        document.head.appendChild(globalLink);
    }

    init();

    // init====================================================================================================================================================================
    function init()
    {
        renderNotebedNotepad();
        addEventListeners();
        
        const notebedContainer=shadowRoot.getElementById('notebed-container');
        const notebedNote=shadowRoot.getElementById('notebed-note');
        updateNotebedOpacity();
        
        // load XYWHT
        const XYWHT=JSON.parse(localStorage.getItem(STORAGE_KEY_XYWHT))||{x:"10px",y:"10px",w:"200px",h:"200px",t:"light"};
        notebedContainer.style.left=Math.max(parseInt(XYWHT.x,10),10)+"px";
        notebedContainer.style.top=Math.max(parseInt(XYWHT.y,10),10)+"px";
        notebedContainer.style.width=XYWHT.w;
        notebedContainer.style.height=XYWHT.h;
        theme=XYWHT.t;
        
        updateTheme();
        
        // load text
        notebedNote.innerText=localStorage.getItem(STORAGE_KEY_CONTENT);
        saveNotebedNote();

        saveNotebedXYWHT();
    }

    function renderNotebedNotepad()
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
        background-color: var(--bg-gap);
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

    #notebed-note
    {
        border-radius: 5px;
        background-color: var(--bg-default);
        transition: background-color ease 0.3s;
        height: 100%;
        
        flex: 1 1 auto;

        overflow-y: auto;
        outline: none;

        padding: 2px;

        position: relative;

        color: var(--text-default);
        transition: color ease 0.3s;
    }

    #notebed-note::-webkit-scrollbar{width: 4px;}
    #notebed-note::-webkit-scrollbar-button{display: none;}
    #notebed-note::-webkit-scrollbar-corner{display: none;}
    #notebed-note::-webkit-scrollbar-track{visibility: hidden;}
    #notebed-note::-webkit-scrollbar-thumb
    {
        background-color: var(--scrollbar-thumb);
        transition: background-color ease 0.3s;
        border-radius: 6px;
        border: 0px solid #00000000;
        background-clip: padding-box;
        padding: 10px;
    }
    #notebed-note::-webkit-scrollbar-thumb:hover
    {
        background-color: var(--scrollbar-thumb-hover);
        transition: background-color ease 0.3s;
    }


    #notebed-note.notebed-note-empty::before
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
        <button class="notebed-nav-btn" id="notebed-nav-btn-delete"><span class="material-symbols-outlined">delete</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-theme"><span class="material-symbols-outlined">light_mode</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-opacity"><span class="material-symbols-outlined">visibility</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div id="notebed-note" contenteditable="true"></div>
</div>
`;
    }

    function addEventListeners()
    {
        const notebedContainer=shadowRoot.getElementById('notebed-container');
        const notebedDragger=shadowRoot.getElementById('notebed-nav-title');
        const notebedOpacityBtn=shadowRoot.getElementById('notebed-nav-btn-opacity');
        const notebedDeleteBtn=shadowRoot.getElementById('notebed-nav-btn-delete');
        const notebedThemeBtn=shadowRoot.getElementById('notebed-nav-btn-theme');
        const notebedCloseBtn=shadowRoot.getElementById('notebed-nav-btn-close');
        const notebedNote=shadowRoot.getElementById('notebed-note');

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

        // delete
        notebedDeleteBtn.addEventListener('click',(e)=>
        {
            e.stopPropagation();
            notebedNote.innerText="";
            saveNotebedNote();
            saveNotebedXYWHT();
        });

        // close
        notebedCloseBtn.addEventListener('click',(e)=>
        {
            e.stopPropagation();
            saveNotebedXYWHT();
            notebedNotepad.remove();
        });

        // note input
        notebedNote.addEventListener('input',()=>
        {
            saveNotebedNote();
            saveNotebedXYWHT();
        });
    }

    function saveNotebedNote()
    {
        const notebedNote=shadowRoot.getElementById('notebed-note');
        if(notebedNote.innerText.trim()==="")
        {
            notebedNote.classList.add('notebed-note-empty');
        }
        else
        {
            notebedNote.classList.remove('notebed-note-empty');
        }

        localStorage.setItem(STORAGE_KEY_CONTENT,notebedNote.innerText);
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
                bgDefault: '#fafafa',

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
                bgDefault: '#202020',

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
