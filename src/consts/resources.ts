export class Resource{
    public price: number;
    public mass: number;
    public name: string;
    public amount: number;

    constructor(name: string, amount: number, price: number, mass: number){
        this.name = name;
        this.amount = amount;
        this.price = price;
        this.mass = mass;
    }
}