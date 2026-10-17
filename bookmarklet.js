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
                <span style="margin-right: auto; padding: 3px; pointer-events: none; user-select: none;">ℕ𝕆𝕋𝔼𝔹𝔼𝔻</span>
                <button class="notebed-nav-btn" id="notebed-nav-btn-delete"><span class="material-symbols-outlined">delete</span></button>
                <button class="notebed-nav-btn" id="notebed-nav-btn-opacity"><span class="material-symbols-outlined">visibility</span></button>
                <button class="notebed-nav-btn" id="notebed-nav-btn-close"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div id="notebed-note" contenteditable="true">
            </div>
        
        `;
    document.body.appendChild(notebedContainer);


    // addEventListener =====================================================================================================================
    const notebedNote=document.getElementById('notebed-note');
    const notebedDragger=document.getElementById('notebed-nav');
    const notebedOpacityBtn=document.getElementById('notebed-nav-btn-opacity')
    const notebedDeleteBtn=document.getElementById('notebed-nav-btn-delete')
    const notebedCloseBtn=document.getElementById('notebed-nav-btn-close')

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

    document.addEventListener('mousemove',(e)=>
    {
        if(!isDragging)return;
        notebedContainer.style.left=e.clientX-offsetX+'px';
        notebedContainer.style.top=e.clientY-offsetY+'px';
    });

    document.addEventListener('mouseup',()=>
    {
        isDragging=false;
        notebedDragger.style.cursor='grab';
    });

    // opacity
    let isOpaque=true;
    notebedOpacityBtn.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        isOpaque=!isOpaque;
        updateNotebedOpacity();
    });

    // delete
    notebedDeleteBtn.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        notebedNote.innerText="";
        updateNotebedNote();
    });

    // close
    notebedCloseBtn.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        notebedContainer.remove();
    });

    // note input
    notebedNote.addEventListener('input',updateNotebedNote);

    // init====================================================================================================================================================================
    function init()
    {
        notebedNote.innerText=localStorage.getItem(STORAGE_KEY);
        updateNotebedNote();
        updateNotebedOpacity();
    }

    function updateNotebedNote()
    {
        if(notebedNote.innerText.trim()==="")
        {
            notebedNote.classList.add('notebed-note-empty');
        }
        else
        {
            notebedNote.classList.remove('notebed-note-empty');
        }

        localStorage.setItem(STORAGE_KEY,notebedNote.innerText)
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
