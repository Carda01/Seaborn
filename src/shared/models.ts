import {Socket} from "socket.io";
import {Loot} from '../client/loot/loot.class'

type JSONValue =
    | string
    | number
    | Coordinates
    | Loot
    | JSONObject;

export interface Ship {
    name: string;
    id: string;
    x: number;
    y: number;
    ammo: number;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface JSONObject{
    [x: string]: JSONValue;
}

export interface playerActions {
    r: number;
    a: number;
    f: boolean;
    m: boolean;
}

export interface Player {
    id: string;
    uuid?: number;
    ammo: number;
    name: string;
    x: number;
    y: number;
    player?: Player;
    coors?: Coordinates & playerActions;
}

export interface DomainSocket extends Socket {
    player: Player;
}

