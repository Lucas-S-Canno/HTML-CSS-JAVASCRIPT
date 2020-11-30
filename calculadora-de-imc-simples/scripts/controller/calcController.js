class CalcController { //classe é um conjunto de atributos ="variaveis" e métodos ="funções", funções com _ quer dizer que é "privada"
 
    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation=[];
        this._locale='pt-br';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data"); // pego do documento HTML
        this._timeEl = document.querySelector("#hora");   

        this._currentDate; //this._algumaCoisa quer dizer que é privado, this. cria um atributo

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

copyToClipboard(){
    let input = document.createElement('input');
    input.value = this.displayCalc;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    input.remove();
}

pasteFromClipboard(){
    document.addEventListener('paste', e=>{
        let text = e.clipboardData.getData('Text');
        this.displayCalc = parseFloat(text);
    });
}

    initialize(){ //DOM - Document object module (documento do site), BOM - browse object module (janela do browser)
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 500);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });
    }

    toggleAudio(){ //todas as opções fazem a mesma coisa
        this._audioOnOff = !this._audioOnOff;

        // this._audioOnOff = (this._audioOnOff) ? false : true;

        // if(this._audioOnOff){
        //     this._audioOnOff = false;
        // }else{
        //     this._audioOnOff = true;
        // }
    }

    playAudio(){
        if (this._audioOnOff){
            this._audio.currentTime = 0; //inicia o audio antes mesmo de terminar do tocar oque ja estava tocando
            this._audio.play();

        }
    }

    initKeyboard(){
        document.addEventListener('keyup', e=> {
            this.playAudio();

                switch(e.key){
                    case 'Escape':
                        this.clearAll();
                        break;
                    case 'Backspace':
                        this.clearEntry();
                        break;
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                    case '%':
                        this.addOperation(e.key);
                        break;
                    case 'Enter':
                    case '=':
                        this.calc();
                        break;
                    case ',':
                    case '.':
                            this.addDot('.');
                        break;    
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        this.addOperation(parseInt(e.key));
                        break;
                    case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
                }
            });
        }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day :"2-digit",
            month :"short",
            year:"numeric"
        });
        this.displayTime= this.currentDate.toLocaleTimeString(this._locale);
    }

     
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    }
    
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }
 
    clearEntry(){
        this._operation.pop(); //elimina o ultimo valor do array
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        return this._operation[this._operation.length-1] = value;
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);
        if (this._operation.length > 3){
            this.calc();
            // console.log(this._operation);
        }
    }

    getResult(){
        try{
        return eval(this._operation.join(''));
        }catch(e){
            setTimeout(() => this.setError(), 1); 
        }
    }

    calc(){
        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3){
            last = this._operation.pop();
            this._lastNumber = this.getResult();//nada ou true para pegar um operador
        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastItem(false);//false para pegar um numero
        }

        // console.log('_lastOperator', this._lastOperator);
        // console.log('_lastNumber', this._lastNumber);

        let result = this.getResult();
        if (last === '%'){
            result /= 100;
            this._operation = [result];

        }else{

        // console.log(this._operation)
        this._operation = [result];
        if(last) this._operation.push(last);
        }
        // console.log(result);
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--){

            if (this.isOperator(this._operation[i]) === isOperator){
                lastItem = this._operation[i];
                break;
            }

        }

        if (!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
        // console.log(lastNumber);
    }

    addOperation(value){
        // console.log("a", this.getLastOperation());
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                this.setLastOperation(value);
                // console.log(value);
            } //else if(isNaN(value)) {  
            //     console.log(value); //outra coisa alem de valores e operadores
            // } 
            else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
                // console.log(value);
            }
        } else {
            if (this.isOperator(value)){
                this.pushOperation(value);
            }else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                //atualizar display
                this.setLastNumberToDisplay();

            }

        }
        // console.log(this._operation);
    }
 
    setError(){
        this.displayCalc = 'ERROR!';
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.setLastOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

        // console.log(lastOperation);
    }

    execBtn(value){
        
        this.playAudio();

        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                    this.addDot('.');
                break;    
                        
                
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
           
                default:
                    this.setError();
                    break;
                        
        }
        
    }
 
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g , #parts > g");
        buttons.forEach((btn,index)=>{
            this.addEventListenerAll(btn,'click drag ', e => {
            let textBtn = btn.className.baseVal.replace("btn-","");
            this.execBtn(textBtn);
        });
        this.addEventListenerAll(btn,'mouseover mouseup mousedown', e => {
            btn.style.cursor = "pointer";
            });
        });
    }
 
    
    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
         this._dateEl.innerHTML=value;
    }
 
    get displayTime (){
        return this._timeEl.innerHTML;
    }
    set displayTime (value){
         this._timeEl.innerHTML = value;
    }
 
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
 
    set displayCalc(value){
        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML=value;
    }
 
    get currentDate(){
        return new Date();
    }
 
    set currentDate(value){
        this._dataAtual=value;
    }
}