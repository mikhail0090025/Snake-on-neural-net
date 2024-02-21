const canv: HTMLCanvasElement | null = document.getElementById("game_canv") as HTMLCanvasElement;
const CellSize:number = 18;
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
    public Compare(p: Point): boolean{
        return p.X == this.X && p.Y == this.Y;
    }
}
class Snake{
    public Points: Point[];
    public direction: number = 0;
    constructor(StartPoint: Point){
        this.Points = new Array(StartPoint);
    }
    public Head() : Point{
        return this.Points[0];
    }
    public Tall() : Point{
        return this.Points[this.Points.length - 1];
    }
    public NewPoint(): void{
        var tall: Point = this.Tall();
        /*
        if(this.Points.length < 2){
            this.Points.push(new Point(tall.X, tall.Y + 1));
            return;
        }
        if(this.Points[this.Points.length - 2].X == tall.X && this.Points[this.Points.length - 2].Y == tall.Y + 1){
            this.Points.push(new Point(tall.X, tall.Y - 1));
        }
        else if(this.Points[this.Points.length - 2].X == tall.X + 1 && this.Points[this.Points.length - 2].Y == tall.Y){
            this.Points.push(new Point(tall.X - 1, tall.Y));
        }
        else if(this.Points[this.Points.length - 2].X == tall.X - 1 && this.Points[this.Points.length - 2].Y == tall.Y){
            this.Points.push(new Point(tall.X + 1, tall.Y));
        }
        else this.Points.push(new Point(tall.X, tall.Y + 1));
        */
        this.Points.push(new Point(tall.X, tall.Y + 1));
    }
    public Step(): void {
        for (let i = this.Points.length - 1; i > 0; i--) {
            this.Points[i].X = this.Points[i - 1].X;
            this.Points[i].Y = this.Points[i - 1].Y;
        }
        switch (this.direction % 4) {
            case 0:
                this.Head().Y--;
                break;
            case 1:
                this.Head().X++;
                break;
            case 2:
                this.Head().Y++;
                break;
            case 3:
                this.Head().X--;
                break;
            default:
                throw new Error("Unknown direction");
        }
    }
}
class Game{
    public readonly Size: number;
    public Apple: Point;
    public snake: Snake;
    constructor(size: number){
        this.Size = size;
        this.NewGame();
    }
    public NewGame() : void {
        this.NewApple();
        var point_snake: Point = Point.RandomPoint(this.Size - 1);
        this.snake = new Snake(point_snake);
        this.Draw();
    }
    public Draw(): void{
        if(canv){
            // Preparation
            var cont = canv.getContext("2d");
            cont.clearRect(0, 0, 10000, 10000);

            // Draw apple
            cont.fillStyle = "red";
            cont.fillRect(this.Apple.X * CellSize, this.Apple.Y * CellSize, CellSize, CellSize);

            // Draw snake
            this.snake.Points.forEach((point, index) => {
                cont.fillStyle = index == 0 ? "lightgreen" : "green";
                cont.fillRect(point.X * CellSize, point.Y * CellSize, CellSize, CellSize);
            });
        }
        else throw new Error("canvas is null");
    }
    public NewApple(){
        var p: Point = Point.RandomPoint(this.Size - 1);
        if(!this.snake) {
            this.Apple = p;
            return;
        }
        while (true) {
            p = Point.RandomPoint(this.Size);
            var f: boolean = false;
            this.snake.Points.forEach(element => {
                if(element.Compare(p)) f=true;
            });
            if(!f) break;
        }
        this.Apple = p;
    }
    public Step(dir: number, redraw: boolean = true): void{
        var head = this.snake.Head();
        this.snake.direction = dir;
        this.snake.Step();
        if(head.Compare(this.Apple)){
            this.snake.NewPoint();
            this.NewApple();
        }
        if(redraw) this.Draw();

        if(head.X < 0 || head.Y < 0 || head.X >= this.Size || head.Y >= this.Size) this.Dead();

        this.snake.Points.forEach((point, index) => {
            if(point.Compare(this.snake.Head()) && index != 0){
                this.Dead();
            }
        });
    }
    public Dead() : void{
        alert("You dead");
        this.NewGame();
    }
}
var game: Game = new Game(28);
game.Draw();
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "W":
            game.Step(0, true);
            break;
        case "w":
            game.Step(0, true);
            break;
        case "D":
            game.Step(1, true);
            break;
        case "d":
            game.Step(1, true);
            break;
        case "S":
            game.Step(2, true);
            break;
        case "s":
            game.Step(2, true);
            break;
        case "A":
            game.Step(3, true);
            break;
        case "a":
            game.Step(3, true);
            break;
    }
});