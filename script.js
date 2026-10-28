const BOOKMARKLET_LIST=["notepad","snapshot"];

window.addEventListener("load",()=>
{
    const script=document.createElement('script');
    script.src='http://127.0.0.1:5500/script/eyedropper.js';
    //document.body.appendChild(script);
});

window.addEventListener('load',()=>
{
    BOOKMARKLET_LIST.forEach((bml)=>
    {
        const card=document.getElementById(bml+'-card');
        const link=card.querySelector(':scope a');
        
        if(!link)
        {
            console.log("no link");
            return;
        }
        else
        {
            const txtPath='script/'+bml+'.txt';

            fetch(txtPath)
                .then(reponse=>
                {
                    if(!reponse.ok)throw new Error('failed to fetch');
                    return reponse.text();
                })
                .then(urlFromTXT=>
                {
                    link.href=urlFromTXT.trim();
                    console.log('succeeded to update url');
                })
                .catch(err=>
                {
                    console.error(err);
                });
        }

    });
})