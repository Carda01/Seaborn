import {Resource} from "../consts/resources";

require('dotenv').config({path: __dirname + '/../../.env'});
import {GameEvent, PlayerEvent, ServerEvent} from '../shared/events.model';
import {DomainSocket, Player, Ship, Coordinates, JSONObject} from '../shared/models';
import {SpawnArea} from "./spawnloc";
import {loot} from '../consts/enums'

let models = require('../../db/db');

const cookieParser = require('cookie-parser');
const passport = require('passport');
const bodyParser = require('body-parser');
const routes = require('../../routes/main');
const secureRoutes = require('../../routes/secure');
const passwordRoutes = require('../../routes/password');
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
require('../../auth/auth');

app.use(express.static("public"));
app.use(express.static("pages"));

app.use('/', routes);
app.use('/', passwordRoutes);
app.use('/', passport.authenticate('jwt', { session : false }), secureRoutes);

app.use((req, res, next) => {
    res.status(404);
    res.json({message: '404 - Not Found'});
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({error: err});
});

app.get("/", (req, res) => {
    res.sendFile(`pages/index.html`, {root: '.'});
});

class GameServer {
    private gameHasStarted: boolean = false;
    private spawnArea: SpawnArea;
    private loots: JSONObject;

    constructor() {
        this.spawnArea = new SpawnArea();
        this.loots = {};
        this.socketEvents();
    }


    public connect(port : number) {
        http.listen(port, () => {
            console.info(`listening on port ${port}`)
        })
    }

    private socketEvents() : void{
        io.on(ServerEvent.connected, (socket : DomainSocket) => {
            this.attachListeners(socket);
        });
    }

    private attachListeners(socket : DomainSocket) : void{
        this.addSignOnListener(socket);
        this.addMovementListener(socket);
        this.addSignOutListener(socket);
        this.addHitListener(socket);
        this.addKilledListener(socket);
        this.addPickupListener(socket);
    }

    private addHitListener(socket): void {
        socket.on(PlayerEvent.hit, (playerId : string) => {
            socket.broadcast.emit(PlayerEvent.hit, playerId);
        });
    }

    private addKilledListener(socket): void {
        socket.on(PlayerEvent.killed, (playerId : string) => {
            socket.broadcast.emit(PlayerEvent.killed, playerId);
        });
    }

    private gameInitialized(socket): void {
        if (!this.gameHasStarted) {
            this.gameHasStarted = true;
            this.initializeLoot(socket);
        }
        this.initialLootEmitter(socket);
    }

    private initialLootEmitter(socket){
        Object.entries(this.loots).forEach(([id, coors]) => {
            socket.emit(GameEvent.drop, {idLoot: id, coors: coors});
        });
    }

    private initializeLoot(socket){
        for(let i = 0; i < loot.INITIAL_LOOTS; i++){
            this.spawnLoot(i.toString());
        }
    }

    private generateLoot(){
        const coordinates = this.randomCoordinates();
        const name = `loot${this.randomInt(1, 5)}`;
        let wood;
        let stone;
        let iron;
        let fabrics;
        let tools;
        let money;

        wood = this.randomResourceLoot(0.1, 0.8, 0.95);
        stone = this.randomResourceLoot(0.7, 0.95, 0.98);
        iron = this.randomResourceLoot(0.75, 0.95, 0.98);
        fabrics = this.randomResourceLoot(0.95, 0.985, 0.99);
        tools = this.randomResourceLoot(0.97, 0.99, 0.995);

        if (Math.random() <= 0.5) {
            money = Math.floor(Math.random()*5);
        } else if (Math.random() <= 0.7){
            money = Math.floor(Math.random()*10);
        } else if (Math.random() <= 0.9) {
            money = Math.floor(Math.random()*15);
        } else {
            money = Math.floor(Math.random() * 100);
        }

        let lootFeature = {
            x : coordinates.x,
            y : coordinates.y,
            name: name,
            wood: wood,
            stone: stone,
            iron: iron,
            fabrics: fabrics,
            tools: tools,
            money: money,
        }
        return lootFeature;
    }

    private randomResourceLoot(firstCriteria, secondCriteria, thirdCriteria){
        let resource;
        if (Math.random() <= firstCriteria) {
            resource = 0;
        } else if (Math.random() <= secondCriteria){
            resource = 1;
        } else if (Math.random() <= thirdCriteria) {
            resource = 2;
        } else {
            resource = 3;
        }
        return resource;
    }


    private spawnLoot(id){
        const features = this.generateLoot();
        this.loots[id] = features;
    }

    //need id loot
    private addPickupListener(socket): void {
        socket.on(PlayerEvent.pickup, (data) => {
            socket.emit(PlayerEvent.pickup, {idLoot: data.idLoot, idPlayer: data.idPlayer})
            socket.broadcast.emit(PlayerEvent.pickup, {idLoot: data.idLoot, idPlayer: data.idPlayer} );
            this.spawnLoot(data.idLoot);
            socket.emit(GameEvent.drop, {idLoot: data.idLoot, coors: this.loots[data.idLoot]});
            socket.broadcast.emit(GameEvent.drop, {idLoot: data.idLoot, coors: this.loots[data.idLoot]});
        });
    }

    private addMovementListener(socket): void {
        socket.on(PlayerEvent.coordinates, (coors) => {
            socket.broadcast.emit(PlayerEvent.coordinates, {coors: coors, player: socket.player});
        });
    }

    private addSignOutListener(socket): void {
        socket.on(ServerEvent.disconnected, () => {
            if (socket.player) {
                socket.broadcast.emit(PlayerEvent.quit,
                    socket.player.id);
            }
        });
    }

    private addSignOnListener(socket): void {
        socket.on(GameEvent.authentication, async (player, gameSize) => {
            socket.emit(PlayerEvent.players, this.getAllPlayers());
            await this.createPlayer(socket, player, gameSize);
            socket.emit(PlayerEvent.protagonist, socket.player);
            socket.broadcast.emit(PlayerEvent.joined, socket.player);
            this.gameInitialized(socket);
        });
    }

    private async createPlayer(socket, player: Ship, windowSize: { x, y }) {
        let features = await getShip(player.id);
        if(features == null){
            features = await this.createShip(player.id);
            await models.ship.create(features);
        }
        socket.player = {
            name: player.name,
            id: player.id,
            x: features.x,
            y: features.y,
            ship_id: features.Ship_id
        };
    }

    private getAllPlayers(): Array<Ship> {
        const players = [];
        const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
        sockets.map((socketID) => {
            const player = io.sockets.sockets.get(socketID).player;
            if (player) {
                players.push(player);
            }
        });
        return players;
    }

    private randomInt(low : number, high : number) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    private randomCoordinates(){
        let x: number = 0, y:number = 0;
        var found : boolean = false;
        while(!found){
            x = this.randomInt(32, 12768);
            y = this.randomInt(32, 12768);
            found = this.spawnArea.inside(x, y);
        }

        return {x: x, y: y};
    }

    private async createShip(idUser){
        let coordinates = this.randomCoordinates();
        let id = await this.createShipID();
        let features = {
            Ship_id: id,
            Ship_type_id: 1,
            User_id: idUser,
            x: coordinates.x,
            y: coordinates.y,
        }
        return features;
    }

    private async createShipID(){
        while(true){
            let id = Math.floor(Math.random() * 10000);
            if(! await models.ship.findByPk(id)){
                return id;
            }
        }
    }


}

const gameSession = new GameServer();

gameSession.connect(3000);


async function getShip(idUser){
    let found = await models.ship.findOne({
        attributes: ['Ship_id', 'HP_upgrades', "Crew_upgrades", "Cargo_upgrades", "Speed_upgrades", "Cannon_upgrades",
            "Equiped_cannons", "Current_HP", "Ship_type_id", "User_id", "Cannon_id", "Inventory_item_id", "x", "y"],
        include: [{
            model: models.user,
            as: 'User',
            required: true
        }],
        where: {
            User_id: idUser,
        }
    });
    return found;
}