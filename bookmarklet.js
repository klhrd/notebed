(function()
{
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
                <button class="notebed-nav-btn"><span class="material-symbols-outlined">open_with</span></button>
                <button class="notebed-nav-btn"><span class="material-symbols-outlined">visibility</span></button>
                <button class="notebed-nav-btn"><span class="material-symbols-outlined">close_fullscreen</span></button>
                <button class="notebed-nav-btn"><span class="material-symbols-outlined">close</span></button>
            </div>
            <div id="notebed-note" contenteditable="true">
            </div>
        
        `;


    document.body.appendChild(notebedContainer);



    const notebedNote=document.getElementById('notebed-note');
    updateNotebedNoteEmptyStatus();
    notebedNote.addEventListener('input',updateNotebedNoteEmptyStatus);
    function updateNotebedNoteEmptyStatus()
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
