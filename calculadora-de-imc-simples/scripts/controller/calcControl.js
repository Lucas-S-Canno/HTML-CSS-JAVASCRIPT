class CalcControl{

    constructor() {

        this._peso = document.querySelector('peso');
        this._altura = document.querySelector('altura');
        this._resultado = document.querySelector('#resultado');
        this._significado = document.querySelector('#significado');
    
        this.calc();

    }

    getPeso(){
        this._peso = document.getElementById('peso').value;
        // console.log(this._peso);
    }

    getAltura(){
        this._altura = document.getElementById('altura').value;
        // console.log(this._altura);
    }

    calc(){
        // document.addEventListener('keyup', e => {
            document.getElementById('calc').addEventListener('click', e => {
            // if(e.key === 'Enter'){
                this.meaning = '';
                this.getPeso();
                this.getAltura();
                let p = this._peso;
                let a = this._altura/100;
                let r = 0;
                // console.log(p);
                // console.log(a);
                r = p/(a * a);
                console.log(r);
                r = Math.round(r*100000)/100000;
                this.result = r
                console.log(this.result);

                if(this.result < 18.5){
                    return this.meaning = 'Abaixo do peso';
                    console.log(this.meaning);
                }else if(this.result >= 18.5 && this.result < 25 ){
                    return this.meaning = 'Peso normal';
                    console.log(this.meaning);
                }else if(this.result >= 25 && this.result < 30 ){
                    return this.meaning = 'Sobrepeso';
                    console.log(this.meaning);
                }else if(this.result >= 30 && this.result < 35 ){
                    return this.meaning = 'Obesidade grau 1';
                    console.log(this.meaning);
                }else if(this.result >= 35 && this.result < 40 ){
                    return this.meaning = 'Obesidade grau 2';
                    console.log(this.meaning);
                }else{
                    return this.meaning = 'Obesidade grau 3';
                    console.log(this.meaning);
                }

            // }
        });
    }

    get result() {
        return this._resultado.innerHTML;
    }

    set result(value){
        this._resultado.innerHTML = value;
    }

    get meaning() {
        return this._significado.innerHTML;
    }

    set meaning(value){
        this._significado.innerHTML = value;
    }


}





// IMC = peso / (altura em m)² 

// IMC			Resultado
// Menos do que 18,5	Abaixo do peso
// Entre 18,5 e 24,9	Peso normal
// Entre 25 e 29,9		Sobrepeso
// Entre 30 e 34,9		Obesidade grau 1
// Entre 35 e 39,9		Obesidade grau 2
// Mais do que 40		Obesidade grau 3