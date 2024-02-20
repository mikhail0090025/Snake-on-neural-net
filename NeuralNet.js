var RoundMethod;
(function (RoundMethod) {
    RoundMethod[RoundMethod["DontRound"] = 0] = "DontRound";
    RoundMethod[RoundMethod["Tanh"] = 1] = "Tanh";
    RoundMethod[RoundMethod["ZeroAndOne"] = 2] = "ZeroAndOne";
})(RoundMethod || (RoundMethod = {}));
var NodeNN = /** @class */ (function () {
    function NodeNN() {
        this.value = 0;
        this.Is_rounded = false;
    }
    // Getter for value
    NodeNN.prototype.CurrentValue = function () {
        return this.value;
    };
    NodeNN.prototype.SetValue = function (new_value) {
        this.value = new_value;
        this.Is_rounded = false;
    };
    NodeNN.prototype.RoundValue = function (RoundType) {
        if (this.Is_rounded)
            return;
        switch (RoundType) {
            case RoundMethod.DontRound:
                break;
            case RoundMethod.Tanh:
                this.value = Math.tanh(this.value);
                break;
            case RoundMethod.ZeroAndOne:
                if (this.value < 0)
                    this.value = 0;
                else
                    this.value = 1;
                break;
            default:
                throw new Error("Round method was undefined");
        }
        this.Is_rounded = true;
    };
    NodeNN.prototype.Reset = function () {
        this.value = 0;
        this.Is_rounded = false;
    };
    return NodeNN;
}());
var LayerNN = /** @class */ (function () {
    function LayerNN(count, roundType, NextLayer) {
        if (!Number.isInteger(count)) {
            throw new Error("count has to be an integer");
        }
        this.size = count;
        this.RoundType = roundType;
        for (var i = 0; i < count; i++)
            this.layer.push(new NodeNN());
        if (NextLayer) {
            this.next_layer = NextLayer;
            for (var i = 0; i < this.Size(); i++) {
                for (var j = 0; j < this.next_layer.Size(); j++) {
                    this.sinnapses[i][j] = (Math.random() * 2) - 1;
                }
            }
        }
    }
    // Getters
    LayerNN.prototype.Size = function () { return this.size; };
    LayerNN.prototype.RoundTypeG = function () { return this.RoundType; };
    LayerNN.prototype.Reset = function () {
        this.layer.forEach(function (element) {
            element.Reset();
        });
    };
    LayerNN.prototype.RoundValue = function () {
        var _this = this;
        this.layer.forEach(function (element) {
            element.RoundValue(_this.RoundType);
        });
    };
    LayerNN.prototype.CalcNextLayer = function () {
    };
    return LayerNN;
}());
var NeuralNet = /** @class */ (function () {
    function NeuralNet(inputsCount, outputsCount, neuralsInLayerCount, hiddenLayersCount) {
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
        this.NeuralsInLayerCount = neuralsInLayerCount;
        this.HiddenLayersCount = hiddenLayersCount;
        // Check if all properties are integers
        this.CheckIntegers();
    }
    NeuralNet.prototype.CheckIntegers = function () {
        if (Number.isInteger(this.InputsCount) &&
            Number.isInteger(this.HiddenLayersCount) &&
            Number.isInteger(this.NeuralsInLayerCount) &&
            Number.isInteger(this.OutputsCount)) {
            return;
        }
        throw new Error("Invalid property values. All properties must be integers.");
    };
    return NeuralNet;
}());
