import {GameEvent} from "../../shared/events.model";

declare const window: any;

export class LoginScene {
    public formContainer: HTMLDivElement;
    public loginPage: HTMLDivElement;
    public form: HTMLDivElement;
    public loginForm: HTMLFormElement;
    public input: HTMLInputElement;
    public button: HTMLButtonElement;
    public playerUsername: string;

    public text: HTMLHeadingElement;
    public boldText: any;

    constructor(username){
        if(localStorage.getItem('leftAbr') === null){

        }
        else{
            if (localStorage.getItem('leftAbr') == 'true') {
                let progress = JSON.parse(localStorage.getItem(localStorage.getItem('idUser')));
                localStorage.setItem('leftAbr', 'false');
                $.ajax({
                    type: 'POST',
                    url: '/updateProgress',
                    data: {x: progress.x, y: progress.y, id: localStorage.getItem('idUser')},
                    success: function(){},
                    error: function(){}
                });
            }
        }
        this.playerUsername = username;
        this.createForm();
    }

    private createForm(){
        this.formContainer = document.createElement('div');
        this.formContainer.className = 'form-container';

        this.loginPage = document.createElement('div');
        this.loginPage.className = 'login-page';

        this.form = document.createElement('div');
        this.form.className = 'form';

        this.boldText = document.createElement('B');
        this.boldText.innerText = `${this.playerUsername}`;

        this.text = document.createElement('h1');
        this.text.innerText = `Welcome back `;
        // this.text.style.font = '30px Georgia';
        this.text.appendChild(this.boldText);


        this.loginForm = document.createElement('form');


        this.button = document.createElement('button');
        this.button.innerText = 'Join game';
        this.button.addEventListener('click', (e) => this.createPlayer(e));


        this.loginForm.appendChild(this.text);
        this.loginForm.appendChild(this.button);
        this.loginPage.appendChild(this.form);
        this.form.appendChild(this.loginForm);
        this.formContainer.appendChild(this.loginPage);

        document.body.appendChild(this.formContainer);
    }

    private createPlayer(e): void{
        e.preventDefault();
        this.toggleLogin();
        const name = this.playerUsername;
        window.socket.emit(GameEvent.authentication, {name, id: localStorage.getItem('idUser')}, {
            x: window.innerWidth,
            y: window.innerHeight
        });
    }

    private toggleLogin(): void{
        this.formContainer.classList.toggle('visible');
    }

}