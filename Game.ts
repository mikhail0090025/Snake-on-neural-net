const canv: HTMLCanvasElement | null = document.getElementById("game_canv") as HTMLCanvasElement;
class Point{
    public X: number;
    public Y: number;
    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
    static RandomPoint(max: number): Point{
        return new Point(Math.round(Math.random() * max), Math.round(Math.random() * max));
    }
}
class Snake{
    public Points: Point[];
    constructor(StartPoint: Point){
        this.Points = new Array(StartPoint);
    }
}
class Game{
    public readonly Size: number;
    public Apple: Point;
    public snake: Snake;
    constructor(size: number){
        this.Size = size;
        this.Apple = Point.RandomPoint(this.Size);
        var point_snake: Point = Point.RandomPoint(this.Size);
        while(point_snake == this.Apple) point_snake = Point.RandomPoint(this.Size);
        this.snake = new Snake(point_snake);
    }
    public Draw(): void{
        if(canv){
            const CellSize:number = 20;
            for (let i = 0; i < this.Size; i++) {
                for (let j = 0; j < this.Size; j++) {
                    if(this.Apple.X == i && this.Apple.Y == j){
                        canv.getContext("2d").fillStyle = "red";
                        canv.getContext("2d").fillRect(i * CellSize, j * CellSize, CellSize, CellSize);
                    }
                    else {
                        var found: boolean = false;
                        this.snake.Points.forEach(point => {
                            if(point.X == i && point.Y == j){
                                canv.getContext("2d").fillStyle = "green";
                                canv.getContext("2d").fillRect(i * CellSize, j * CellSize, CellSize, CellSize);
                                found = true;
                            }
                        });
                        if(found) continue;
                        canv.getContext("2d").fillStyle = "black";
                        canv.getContext("2d").fillRect(i * CellSize, j * CellSize, CellSize, CellSize);
                    }
                }
            }
        }
        else throw new Error("canvas is null");
    }
}
var game: Game = new Game(30);
game.Draw();
console.log(game);