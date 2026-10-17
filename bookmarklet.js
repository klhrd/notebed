(function()
{
    STORAGE_KEY="NOTEBED_NOTE_CONTENT";

    // appeadChild ======================================================================================================================

    // link
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    document.head.appendChild(link);

    // style
    const style=document.createElement('style');
    style.textContent=
        `
        
        `;
    document.head.appendChild(style);

    // notebed
    const notebedContainer=document.createElement('div');
    notebedContainer.id="notebed-container";
    notebedContainer.innerHTML=
        `
            <div id="notebed-nav">
                <button class="notebed-nav-btn" id="notebed-nav-btn-drag"><span class="material-symbols-outlined">open_with</span></button>
                <button class="notebed-nav-btn" id="notebed-nav-btn-opacity"><span class="material-symbols-outlined">visibility</span></button>
                <button class="notebed-nav-btn"><span class="material-symbols-outlined">close_fullscreen</span></button>
                <button class="notebed-nav-btn" id="notebed-nav-btn-close"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div id="notebed-note" contenteditable="true">
            </div>
        
        `;
    document.body.appendChild(notebedContainer);


    // addEventListener =====================================================================================================================
    const notebedNote=document.getElementById('notebed-note');
    const notebedDragBtn=document.getElementById('notebed-nav-btn-drag');
    const notebedOpacityBtn=document.getElementById('notebed-nav-btn-opacity')
    const notebedCloseBtn=document.getElementById('notebed-nav-btn-close')

    //drag
    let isDragging=false;
    let offsetX=0;
    let offsetY=0;

    notebedDragBtn.addEventListener('mousedown',(e)=>
    {
        isDragging=true;
        offsetX=e.clientX-notebedContainer.offsetLeft;
        offsetY=e.clientY-notebedContainer.offsetTop;
        notebedDragBtn.style.cursor='grabbing';
    });

    document.addEventListener('mousemove',(e)=>
    {
        if(!isDragging)return;
        notebedContainer.style.left=e.clientX-offsetX+'px';
        notebedContainer.style.top=e.clientY-offsetY+'px';
    });

    document.addEventListener('mouseup',()=>
    {
        isDragging=false;
        notebedDragBtn.style.cursor='grab';
    });

    // opacity
    let isOpaque=true;
    notebedOpacityBtn.addEventListener('click',()=>
    {
        isOpaque=!isOpaque;
        updateNotebedOpacity();
    })

    // close
    notebedCloseBtn.addEventListener('click',()=>
    {
        notebedContainer.remove();
    })

    // note input
    notebedNote.addEventListener('input',updateNotebedNote);

    // init====================================================================================================================================================================
    function init()
    {
        notebedNote.textContent=localStorage.getItem(STORAGE_KEY);
        updateNotebedNote();
        updateNotebedOpacity();
    }

    function updateNotebedNote()
    {
        if(notebedNote.textContent.trim()==="")
        {
            notebedNote.classList.add('notebed-note-empty');
        }
        else
        {
            notebedNote.classList.remove('notebed-note-empty');
        }

        localStorage.setItem(STORAGE_KEY,notebedNote.textContent)
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

    init();
})();
