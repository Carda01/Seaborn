import { Resource } from "../../consts/resources";

export class Resources {
    //TODO make load resources from the db
    //RESOURCES
    public wood: Resource;
    public stone: Resource;
    public iron: Resource;
    public fabrics: Resource;
    public tools: Resource;
    public money: number;

    constructor(wood = 0, stone = 0, iron = 0, fabrics = 0, tools = 0, money = 500){
        //TODO set data from DB
        this.wood = new Resource('Wood',wood,15,10);
        this.stone = new Resource('Stone',stone,25,20);
        this.iron = new Resource('Iron',iron,100,25);
        this.fabrics = new Resource('Fabrics',fabrics,250,5);
        this.tools = new Resource('Tools',tools,400,10);
        this.money = money;
    }

    merge(resources : Resources){
        this.wood.amount += resources.wood.amount;
        this.stone.amount += resources.stone.amount;
        this.iron.amount += resources.iron.amount;
        this.fabrics.amount += resources.fabrics.amount;
        this.tools.amount += resources.tools.amount;
        this.money += resources.money;
    }
}