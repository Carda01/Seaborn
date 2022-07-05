import {GameEvent} from "../../shared/events.model";

declare const window: any;

export class GameOverScene {
    public formContainer: HTMLDivElement;
    public loginPage: HTMLDivElement;
    public form: HTMLDivElement;
    public loginForm: HTMLFormElement;
    public input: HTMLInputElement;
    public button: HTMLButtonElement;
    public gameOverText: HTMLHeadingElement;
    public username: string;

    constructor(username){
        this.username = username;
        this.createForm();
    }

    private createForm(){
        this.formContainer = document.createElement('div');
        this.formContainer.className = 'form-container';

        this.loginPage = document.createElement('div');
        this.loginPage.className = 'login-page';

        this.form = document.createElement('div');
        this.form.className = 'form';

        this.loginForm = document.createElement('form');

        this.gameOverText = document.createElement('h1');
        this.gameOverText.innerText = 'Game Over, you have been defeated';

        this.loginForm.appendChild(this.gameOverText);
        this.button = document.createElement('button');
        this.button.innerText = 'Play Again';
        this.button.addEventListener('click', (e) => this.createPlayer(e));


        this.loginForm.appendChild(this.gameOverText);
        this.loginForm.appendChild(this.button);
        this.loginPage.appendChild(this.form);
        this.form.appendChild(this.loginForm);
        this.formContainer.appendChild(this.loginPage);

        document.body.appendChild(this.formContainer);
    }

    private createPlayer(e): void{
        e.preventDefault();
        this.toggleLogin();
        const name = this.username;
        window.socket.emit(GameEvent.authentication, {name}, {
            x: window.innerWidth,
            y: window.innerHeight
        });
    }

    private toggleLogin(): void{
        this.formContainer.classList.toggle('visible');
    }

}