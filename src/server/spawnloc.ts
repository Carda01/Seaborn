import {Coordinates} from "../shared/models";
import {ArrayRandCoord} from "../consts/enums";

export class SpawnArea {
    private rects: Array<Rectangle>;


    constructor() {
        this.rects = [];
        let points = ArrayRandCoord;
        points = points.map(value => value * 32);
        for(let i = 0; i < points.length; i+=4){
            this.rects.push(new Rectangle(points[i], points[i + 1], points[i + 2], points[i + 3]));
        }
    }

    public inside(x, y) : boolean{
        for(let i = 0; i < this.rects.length; i++) {
            if (this.rects[i].inside(x, y)){
                return true;
            }
        }
        return false;
    }
}

export class Rectangle {
    private topLeftX: number;
    private topLeftY: number;
    private bottomRightX: number;
    private bottomRightY: number;

    constructor(x1, y1, x2, y2) {
        this.topLeftX = x1;
        this.bottomRightX = x2;
        this.topLeftY = y1;
        this.bottomRightY = y2;
    }

    public inside(x, y) {
        let answer = true;
        if (x <= this.topLeftX || x >= this.bottomRightX || y >= this.bottomRightY || y <= this.topLeftY)
            answer = false;
        return answer;
    }

}