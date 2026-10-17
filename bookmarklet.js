(function()
{
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
                <button class="notebed-nav-btn"><span class="material-symbols-outlined">visibility</span></button>
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

    // close
    notebedCloseBtn.addEventListener('click',()=>
    {
        notebedContainer.remove();
    })


    // note input
    updateNotebedNoteStatus();
    notebedNote.addEventListener('input',updateNotebedNoteStatus);
    function updateNotebedNoteStatus()
    {
        if(notebedNote.textContent.trim()==="")
        {
            notebedNote.classList.add('notebed-note-empty');
        }
        else
        {
            notebedNote.classList.remove('notebed-note-empty');
        }
    }
})();
