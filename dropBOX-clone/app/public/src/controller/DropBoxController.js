class DropBoxController {
    constructor() {
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackBarEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackBarEl.querySelector('.mc-progress-bar-fg');
        this.fileNameEl = this.snackBarEl.querySelector('.filename');
        this.timeLeftEl = this.snackBarEl.querySelector('.timeleft');
        
        this.initEvents();
    }

    initEvents() {
        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        });
        this.inputFilesEl.addEventListener('change', event => {
            this.uploadTask(event.target.files);
            this.modalShow();
            this.inputFilesEl.value = '';
        });
    }

    modalShow(show = true) {
        this.snackBarEl.style.display = (show) ? 'block' : 'none';
    }

    uploadTask(files) {
        let promises = [];
        [...files].forEach(file => {
            promises.push(new Promise((resolve, reject) => {
                let ajax = new XMLHttpRequest();
                ajax.open('POST', '/upload');
                ajax.onload = event => {
                    this.modalShow(false);
                    try {
                        resolve(JSON.parse(ajax.responseText));
                    } catch (e) {
                        reject(e);
                    }
                };
                ajax.onerror = event => {
                    this.modalShow(false);
                    reject(event);
                };
                ajax.upload.onprogress = event => {
                    this.uploadProgress(event, file);
                };
                let formData = new FormData();
                formData.append('input-file', file);
                this.startUploadTime = Date.now();
                ajax.send(formData);
            }));
        });
        return Promise.all(promises);
    }

    uploadProgress(event, file){
        let timeSpent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let percent = parseInt((100 * loaded) / total);
        let timeLeft = ((100 - percent)*timeSpent) / percent; //resultado em ms, tratado na função formatTimeLeft

        this.progressBarEl.style.width = `${percent}%`;
        this.fileNameEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTimeLeft(timeLeft);
    }

    formatTimeLeft(duration){
        let seconds = parseInt(duration/1000) % 60; //resto da divisão por 60 para não passar de 60 segundos 
        let minutes = parseInt((duration/(1000*60)) % 60); 
        let hours = parseInt((duration/(1000*60*60)) % 24);

        if(hours > 0){
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }else if(minutes > 0){
            return `${minutes} minutos e ${seconds} segundos`;
        }else if(seconds > 0){
            return `${seconds} segundos`;
        }else{
            return '0 segundos';
        }
    }

}