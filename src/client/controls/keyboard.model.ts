export interface Controls{
    cursors: Phaser.CursorKeys;
    fireWeapon: Phaser.Key;
    pressH: Phaser.Key;
}

export class DisplayUI{
    public isPressed: boolean = false;

    constructor(){
        
    }
    public getIsPressed(): boolean {
        return this.isPressed;
    }
    public switch(): void {
        this.isPressed = !this.isPressed;
    }
}