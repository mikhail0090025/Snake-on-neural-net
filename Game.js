var canv = document.getElementById("game_canv");
var CellSize = 18;
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.X = x;
        this.Y = y;
    }
    Point.RandomPoint = function (max) {
        return new Point(Math.round(Math.random() * max), Math.round(Math.random() * max));
    };
    Point.prototype.Compare = function (p) {
        return p.X == this.X && p.Y == this.Y;
    };
    return Point;
}());
var Snake = /** @class */ (function () {
    function Snake(StartPoint) {
        this.direction = 0;
        this.Points = new Array(StartPoint);
    }
    Snake.prototype.Head = function () {
        return this.Points[0];
    };
    Snake.prototype.Tall = function () {
        return this.Points[this.Points.length - 1];
    };
    Snake.prototype.NewPoint = function () {
        var tall = this.Tall();
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
    };
    Snake.prototype.Step = function () {
        for (var i = this.Points.length - 1; i > 0; i--) {
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
        if (this.Points[1]) {
            if (this.Head().Compare(this.Points[1])) {
                alert("You dead");
            }
        }
    };
    return Snake;
}());
var Game = /** @class */ (function () {
    function Game(size) {
        this.Size = size;
        this.Apple = Point.RandomPoint(this.Size);
        var point_snake = Point.RandomPoint(this.Size);
        while (point_snake == this.Apple)
            point_snake = Point.RandomPoint(this.Size);
        this.snake = new Snake(point_snake);
    }
    Game.prototype.Draw = function () {
        if (canv) {
            var cont = canv.getContext("2d");
            cont.clearRect(0, 0, 10000, 10000);
            var _loop_1 = function (i) {
                var _loop_2 = function (j) {
                    if (this_1.Apple.X == i && this_1.Apple.Y == j) {
                        cont.fillStyle = "red";
                        cont.fillRect(i * CellSize, j * CellSize, CellSize, CellSize);
                    }
                    else {
                        found = false;
                        this_1.snake.Points.forEach(function (point, index) {
                            if (point.X == i && point.Y == j) {
                                cont.fillStyle = index == 0 ? "lightgreen" : "green";
                                cont.fillRect(i * CellSize, j * CellSize, CellSize, CellSize);
                                found = true;
                            }
                        });
                        if (found)
                            return "continue";
                        cont.fillStyle = "black";
                        cont.fillRect(i * CellSize, j * CellSize, CellSize, CellSize);
                    }
                };
                for (var j = 0; j < this_1.Size; j++) {
                    _loop_2(j);
                }
            };
            var this_1 = this, found;
            for (var i = 0; i < this.Size; i++) {
                _loop_1(i);
            }
        }
        else
            throw new Error("canvas is null");
    };
    Game.prototype.NewApple = function () {
        var p = Point.RandomPoint(this.Size);
        while (true) {
            p = Point.RandomPoint(this.Size);
            var f = false;
            this.snake.Points.forEach(function (element) {
                if (element.Compare(p))
                    f = true;
            });
            if (!f)
                break;
        }
        this.Apple = p;
    };
    Game.prototype.Step = function (dir, redraw) {
        this.snake.direction = dir;
        this.snake.Step();
        if (this.snake.Head().Compare(this.Apple)) {
            this.snake.NewPoint();
            this.NewApple();
        }
        if (redraw)
            this.Draw();
    };
    return Game;
}());
var game = new Game(28);
game.Draw();
document.addEventListener("keydown", function (event) {
    console.log(event);
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
