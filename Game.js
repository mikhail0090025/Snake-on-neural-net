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
        for (var i = 0; i < 3; i++)
            this.NewPoint();
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
                throw new Error("Unknown direction: " + this.direction.toString());
        }
    };
    return Snake;
}());
var Game = /** @class */ (function () {
    function Game(size) {
        this.Size = size;
        this.NewGame();
    }
    Game.prototype.NewGame = function () {
        this.NewApple();
        var point_snake = Point.RandomPoint(this.Size - 1);
        this.snake = new Snake(point_snake);
        this.Draw();
    };
    Game.prototype.IsSnake = function (point) {
        this.snake.Points.forEach(function (p) {
            if (p.X == point.X && p.Y == point.Y)
                return true;
        });
        return false;
    };
    Game.prototype.Draw = function () {
        if (canv) {
            // Preparation
            var cont = canv.getContext("2d");
            cont.clearRect(0, 0, 10000, 10000);
            cont.fillStyle = "#555";
            cont.fillRect(0, 0, CellSize * this.Size, CellSize * this.Size);
            // Draw apple
            cont.fillStyle = "red";
            cont.fillRect((this.Apple.X * CellSize) + 2, (this.Apple.Y * CellSize) + 2, CellSize - 4, CellSize - 4);
            // Draw snake
            this.snake.Points.forEach(function (point, index) {
                cont.fillStyle = index == 0 ? "lightgreen" : "green";
                cont.fillRect((point.X * CellSize) + 2, (point.Y * CellSize) + 2, CellSize - 4, CellSize - 4);
            });
        }
        else
            throw new Error("canvas is null");
    };
    Game.prototype.NewApple = function () {
        var p = Point.RandomPoint(this.Size - 1);
        if (!this.snake) {
            this.Apple = p;
            return;
        }
        while (true) {
            p = Point.RandomPoint(this.Size - 1);
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
        var _this = this;
        if (redraw === void 0) { redraw = true; }
        var head = this.snake.Head();
        this.snake.direction = dir;
        this.snake.Step();
        if (head.Compare(this.Apple)) {
            this.snake.NewPoint();
            this.NewApple();
            if (redraw)
                this.Draw();
            return 2;
        }
        if (head.X < 0 || head.Y < 0 || head.X >= this.Size || head.Y >= this.Size) {
            this.Dead();
            if (redraw)
                this.Draw();
            return 1;
        }
        this.snake.Points.forEach(function (point, index) {
            if (point.Compare(_this.snake.Head()) && index != 0) {
                _this.Dead();
                if (redraw)
                    _this.Draw();
                return 1;
            }
        });
        if (redraw)
            this.Draw();
        return 0;
    };
    /*
        0 - Just step
        1 - Death
        2 - Taken apple
    */
    Game.prototype.Dead = function () {
        this.NewGame();
    };
    Game.prototype.checkCell = function (offsetX, offsetY) {
        if (this.snake.Head().X + offsetX < 0 || this.snake.Head().Y + offsetY < 0) {
            return -2;
        }
        else if (this.snake.Head().X + offsetX > this.Size - 1 || this.snake.Head().Y + offsetY > this.Size - 1) {
            return -2;
        }
        else if (game.IsSnake(new Point(this.snake.Head().X + offsetX, this.snake.Head().Y + offsetY))) {
            return -1;
        }
        else if (new Point(this.snake.Head().X + offsetX, this.snake.Head().Y + offsetY).Compare(this.Apple)) {
            return 1;
        }
        else
            return 0;
    };
    // State of the map for neural net
    Game.prototype.StateForNeuralNet = function () {
        var result = new Array();
        result.push(this.Apple.X);
        result.push(this.Apple.Y);
        result.push(this.snake.Head().X);
        result.push(this.snake.Head().Y);
        result.push(this.checkCell(0, 1));
        result.push(this.checkCell(0, -1));
        result.push(this.checkCell(1, 0));
        result.push(this.checkCell(-1, 0));
        result.push(this.checkCell(1, 1));
        result.push(this.checkCell(1, -1));
        result.push(this.checkCell(-1, 1));
        result.push(this.checkCell(-1, -1));
        return result;
    };
    Game.prototype.Score = function () {
        return this.snake.Points.length - 1;
    };
    return Game;
}());
var game = new Game(28);
game.Draw();
document.addEventListener("keydown", function (event) {
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
