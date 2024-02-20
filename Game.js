var canv = document.getElementById("game_canv");
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.X = x;
        this.Y = y;
    }
    Point.RandomPoint = function (max) {
        return new Point(Math.round(Math.random() * max), Math.round(Math.random() * max));
    };
    return Point;
}());
var Snake = /** @class */ (function () {
    function Snake(StartPoint) {
        this.Points = new Array(StartPoint);
    }
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
            var CellSize_1 = 20;
            var _loop_1 = function (i) {
                var _loop_2 = function (j) {
                    if (this_1.Apple.X == i && this_1.Apple.Y == j) {
                        canv.getContext("2d").fillStyle = "red";
                        canv.getContext("2d").fillRect(i * CellSize_1, j * CellSize_1, CellSize_1, CellSize_1);
                    }
                    else {
                        found = false;
                        this_1.snake.Points.forEach(function (point) {
                            if (point.X == i && point.Y == j) {
                                canv.getContext("2d").fillStyle = "green";
                                canv.getContext("2d").fillRect(i * CellSize_1, j * CellSize_1, CellSize_1, CellSize_1);
                                found = true;
                            }
                        });
                        if (found)
                            return "continue";
                        canv.getContext("2d").fillStyle = "black";
                        canv.getContext("2d").fillRect(i * CellSize_1, j * CellSize_1, CellSize_1, CellSize_1);
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
    return Game;
}());
var game = new Game(30);
game.Draw();
console.log(game);
