(function()
{
    if(document.getElementById('notebed-notepad'))return;

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
    STORAGE_KEY_XYWH="NOTEBED_XYWH";

    const notebedNotepad=document.createElement('notebed-notepad');
    notebedNotepad.id='notebed-notepad';
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
    
    // style
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
        
        border: 0px solid #888888;
        border-radius: 10px;
        background-color: #f0f0f0;
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

        background-color: #fafafa;
        border-radius: 5px;
        
        display: flex;
        justify-content: end;
        align-items: center;

        overflow: hidden;
        color: #000000;
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
        color: #000000;
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
        /* background-color: #fafafa00; */
        background-color: #fafafa;
        height: 100%;
        
        flex: 1 1 auto;

        overflow-y: auto;
        outline: none;

        padding: 2px;

        position: relative;

    }

    #notebed-note::-webkit-scrollbar{width: 4px;}
    #notebed-note::-webkit-scrollbar-button{display: none;}
    #notebed-note::-webkit-scrollbar-corner{display: none;}
    #notebed-note::-webkit-scrollbar-track{visibility: hidden;}
    #notebed-note::-webkit-scrollbar-thumb
    {
        background-color: #e0e0e0;
        border-radius: 6px;
        border: 0px solid #00000000;
        background-clip: padding-box;
        padding: 10px;
    }
    #notebed-note::-webkit-scrollbar-thumb:hover
    {
        background-color: #d0d0d0;
    }


    #notebed-note.notebed-note-empty::before
    {
        content: "take notes here... ";
        cursor: text;

        color: #00000080;
        position: absolute;

        pointer-events: none;
    }
</style>

<div id="notebed-container">
    <div id="notebed-nav">
        <span id="notebed-nav-title" style="margin-right: auto; padding: 3px; user-select: none;">ℕ𝕆𝕋𝔼𝔹𝔼𝔻</span>
        <button class="notebed-nav-btn" id="notebed-nav-btn-delete"><span class="material-symbols-outlined">delete</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-opacity"><span class="material-symbols-outlined">visibility</span></button>
        <button class="notebed-nav-btn" id="notebed-nav-btn-close"><span class="material-symbols-outlined">close</span></button>
    </div>
    <div id="notebed-note" contenteditable="true"></div>
</div>
`;

    // addEventListener =====================================================================================================================
    const notebedContainer=shadowRoot.getElementById('notebed-container');
    const notebedDragger=shadowRoot.getElementById('notebed-nav-title');
    const notebedOpacityBtn=shadowRoot.getElementById('notebed-nav-btn-opacity');
    const notebedDeleteBtn=shadowRoot.getElementById('notebed-nav-btn-delete');
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
        saveNotebedXYWH();
    });

    // opacity
    let isOpaque=true;
    notebedOpacityBtn.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        isOpaque=!isOpaque;
        updateNotebedOpacity();
        saveNotebedXYWH();
    });

    // delete
    notebedDeleteBtn.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        notebedNote.innerText="";
        saveNotebedNote();
        saveNotebedXYWH();
    });

    // close
    notebedCloseBtn.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        notebedNotepad.remove();
        saveNotebedXYWH();
    });

    // note input
    notebedNote.addEventListener('input',()=>
    {
        saveNotebedNote();
        saveNotebedXYWH();
    });

    // init====================================================================================================================================================================
    function init()
    {
        notebedNote.innerText=localStorage.getItem(STORAGE_KEY_CONTENT);
        saveNotebedNote();
        updateNotebedOpacity();
        
        // load XYWH
        const XYWH=JSON.parse(localStorage.getItem(STORAGE_KEY_XYWH))||{x:"10px",y:"10px",w:"200px",h:"200px"};
        notebedContainer.style.left=Math.max(parseInt(XYWH.x,10),10)+"px";
        notebedContainer.style.top=Math.max(parseInt(XYWH.y,10),10)+"px";
        notebedContainer.style.width=XYWH.w;
        notebedContainer.style.height=XYWH.h;

        saveNotebedXYWH();
    }

    function saveNotebedNote()
    {
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

    function saveNotebedXYWH()
    {
        const XYWH=
        {
            x:notebedContainer.style.left,
            y:notebedContainer.style.top,
            w:notebedContainer.style.width,
            h:notebedContainer.style.height,
        };

        localStorage.setItem(STORAGE_KEY_XYWH,JSON.stringify(XYWH));
    }

    init();
})();
