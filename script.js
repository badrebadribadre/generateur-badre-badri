document.addEventListener("DOMContentLoaded", function() {
    const imageUpload = document.getElementById('image-upload');
    const memeText = document.getElementById('meme-text');
    const memePreview = document.getElementById('meme-preview');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearGalleryBtn = document.getElementById('clear-gallery-btn');
    const memeGallery = document.getElementById('meme-gallery');
    const facebookBtn = document.getElementById('facebook-btn');
    const twitterBtn = document.getElementById('twitter-btn');
    const instagramBtn = document.getElementById('instagram-btn');

    generateBtn.addEventListener('click', function() {
        generateMeme();
    });

    function generateMeme() {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageElement = document.createElement('img');
            imageElement.src = event.target.result;
            imageElement.classList.add('meme-image');

            const textElement = document.createElement('div');
            textElement.textContent = memeText.value;
            textElement.classList.add('meme-text');
            textElement.style.fontSize = document.getElementById('text-size').value + 'px';
            textElement.style.color = document.getElementById('text-color').value;

            const selectedStyle = document.getElementById('text-style').value;
            if (selectedStyle === 'bold') {
                textElement.style.fontWeight = 'bold';
            } else if (selectedStyle === 'italic') {
                textElement.style.fontStyle = 'italic';
            } else if (selectedStyle === 'underline') {
                textElement.style.textDecoration = 'underline';
            } else {
                textElement.style.fontWeight = 'normal';
                textElement.style.fontStyle = 'normal';
                textElement.style.textDecoration = 'none';
            }

            const selectedPosition = document.getElementById('text-position').value;
            textElement.style.position = 'absolute';
            if (selectedPosition === 'top') {
                textElement.style.top = '10px';
                textElement.style.left = '50%';
                textElement.style.transform = 'translateX(-50%)';
            } else if (selectedPosition === 'middle') {
                textElement.style.top = '50%';
                textElement.style.left = '50%';
                textElement.style.transform = 'translate(-50%, -50%)';
            } else if (selectedPosition === 'bottom') {
                textElement.style.bottom = '10px';
                textElement.style.left = '50%';
                textElement.style.transform = 'translateX(-50%)';
            }

            const memeContainer = document.createElement('div');
            memeContainer.classList.add('meme-container');
            memeContainer.appendChild(imageElement);
            memeContainer.appendChild(textElement);

            memePreview.innerHTML = '';
            memePreview.appendChild(memeContainer);

            // Ajouter le mème généré à la galerie
            addMemeToGallery(event.target.result, memeText.value);
        };

        reader.readAsDataURL(imageUpload.files[0]);
    }

    downloadBtn.addEventListener('click', function() {
        downloadMeme();
    });

    function downloadMeme() {
        const memeContainer = memePreview.querySelector('.meme-container');
        const dataURL = getBase64Image(memeContainer);
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function getBase64Image(container) {
        const svg = container.innerHTML;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = "data:image/svg+xml;base64," + btoa(svg);

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        ctx.drawImage(image, 0, 0);

        const memeImage = container.querySelector('.meme-image');
        if (memeImage) {
            const imageX = memeImage.offsetLeft;
            const imageY = memeImage.offsetTop;
            const imageWidth = memeImage.offsetWidth;
            const imageHeight = memeImage.offsetHeight;
            ctx.drawImage(memeImage, imageX, imageY, imageWidth, imageHeight);
        }

        const textElement = container.querySelector('.meme-text');
        if (textElement) {
            ctx.font = textElement.style.fontWeight + ' ' + textElement.style.fontSize + ' Arial';
            ctx.fillStyle = textElement.style.color;
            ctx.textAlign = 'center';
            const x = canvas.width / 2;
            let y;
            if (textElement.style.top) {
                y = parseInt(textElement.style.top, 10) + parseInt(textElement.style.fontSize, 10);
            } else if (textElement.style.bottom) {
                y = canvas.height - parseInt(textElement.style.bottom, 10);
            } else {
                y = canvas.height / 2;
            }
            ctx.fillText(textElement.textContent, x, y);
        }

        return canvas.toDataURL("image/png");
    }

    clearGalleryBtn.addEventListener('click', function() {
        clearGallery();
    });

    function clearGallery() {
        memeGallery.innerHTML = '';
        localStorage.removeItem('memes');
    }

    memeGallery.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const memeItem = event.target.parentNode;
            memeGallery.removeChild(memeItem);

            // Supprimer le mème correspondant du stockage local
            const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
            const index = Array.from(memeGallery.children).indexOf(memeItem);
            storedMemes.splice(index, 1);
            localStorage.setItem('memes', JSON.stringify(storedMemes));
        }
        else if (event.target.classList.contains('download-btn')) {
            const memeItem = event.target.parentNode;
            const memeImage = memeItem.querySelector('.meme-image-preview');
            const memeText = memeItem.querySelector('.meme-text-preview').textContent;
            downloadMeme(memeImage.src, memeText);
        }
    });

    // Charger les mèmes stockés dans le stockage local au chargement de la page
    function loadStoredMemes() {
        const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        storedMemes.forEach(function(meme) {
            const memeItem = document.createElement('div');
            memeItem.classList.add('meme-item');

            const imagePreview = document.createElement('img');
            imagePreview.src = meme.image;
            imagePreview.classList.add('meme-image-preview');
            memeItem.appendChild(imagePreview);

            const textPreview = document.createElement('div');
            textPreview.textContent = meme.text;
            textPreview.classList.add('meme-text-preview');
            memeItem.appendChild(textPreview);

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Télécharger';
            downloadBtn.classList.add('download-btn');
            memeItem.appendChild(downloadBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Supprimer';
            deleteBtn.classList.add('delete-btn');
            memeItem.appendChild(deleteBtn);

            memeGallery.appendChild(memeItem);
        });
    }

    loadStoredMemes();

    facebookBtn.addEventListener('click', function() {
        shareOnFacebook();
    });

    twitterBtn.addEventListener('click', function() {
        shareOnTwitter();
    });

    instagramBtn.addEventListener('click', function() {
        shareOnInstagram();
    });

    function shareOnFacebook() {
        const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        const memeData = storedMemes[storedMemes.length - 1];
        const url = encodeURIComponent(window.location.href);
        const shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + encodeURIComponent('Check out my awesome meme! ' + memeData.text);
        window.open(shareUrl, '_blank');
    }

    function shareOnTwitter() {
        const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        const memeData = storedMemes[storedMemes.length - 1];
        const url = encodeURIComponent(window.location.href);
        const shareUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + encodeURIComponent('Check out my awesome meme! ' + memeData.text);
        window.open(shareUrl, '_blank');
    }

    function shareOnInstagram() {
        const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        const memeData = storedMemes[storedMemes.length - 1];
        const shareUrl = 'https://www.instagram.com/?caption=' + encodeURIComponent('Check out my awesome meme! ' + memeData.text);
        window.open(shareUrl, '_blank');
    }

    function addMemeToGallery(imageData, text) {
        // Ajouter le mème généré à la galerie
        const memeItem = document.createElement('div');
        memeItem.classList.add('meme-item');

        const imagePreview = document.createElement('img');
        imagePreview.src = imageData;
        imagePreview.classList.add('meme-image-preview');
        memeItem.appendChild(imagePreview);

        const textPreview = document.createElement('div');
        textPreview.textContent = text;
        textPreview.classList.add('meme-text-preview');
        memeItem.appendChild(textPreview);

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Télécharger';
        downloadBtn.classList.add('download-btn');
        memeItem.appendChild(downloadBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.classList.add('delete-btn');
        memeItem.appendChild(deleteBtn);

        memeGallery.appendChild(memeItem);
        storeMeme(imageData, text);
    }

    function storeMeme(imageData, text) {
        // Enregistrer le mème dans le stockage local
        const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        storedMemes.push({ image: imageData, text: text });
        localStorage.setItem('memes', JSON.stringify(storedMemes));
    }

    function deleteStoredMeme(imageData) {
        // Supprimer le mème correspondant du stockage local
        const storedMemes = JSON.parse(localStorage.getItem('memes')) || [];
        const index = storedMemes.findIndex(meme => meme.image === imageData);
        if (index !== -1) {
            storedMemes.splice(index, 1);
            localStorage.setItem('memes', JSON.stringify(storedMemes));
        }
    }
});