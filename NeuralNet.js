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
    NodeNN.prototype.Clone = function () {
        var result = new NodeNN();
        result.Is_rounded = this.Is_rounded;
        result.value = this.value;
        return result;
    };
    return NodeNN;
}());
var LayerNN = /** @class */ (function () {
    function LayerNN(count, NextLayer) {
        if (!Number.isInteger(count)) {
            throw new Error("count has to be an integer");
        }
        this.size = count;
        this.layer = [];
        this.sinnapses = new Array();
        for (var i = 0; i < count; i++)
            this.layer.unshift(new NodeNN());
        if (NextLayer) {
            this.next_layer = NextLayer;
            for (var i = 0; i < this.Size(); i++)
                this.sinnapses[i] = new Array();
            for (var i = 0; i < this.Size(); i++) {
                for (var j = 0; j < this.next_layer.Size(); j++) {
                    this.sinnapses[i][j] = (Math.random() * 2) - 1;
                }
            }
        }
    }
    // Getters
    LayerNN.prototype.Size = function () { return this.size; };
    LayerNN.prototype.Clone = function () {
        var result = new LayerNN(this.size);
        result.sinnapses = new Array();
        for (var i = 0; i < this.sinnapses.length; i++) {
            result.sinnapses.push(new Array());
            for (var j = 0; j < this.sinnapses[i].length; j++) {
                result.sinnapses[i].push(this.sinnapses[i][j]);
            }
        }
        return result;
    };
    LayerNN.prototype.Reset = function () {
        this.layer.forEach(function (element) {
            element.Reset();
        });
    };
    LayerNN.prototype.RoundValues = function (RoundType) {
        this.layer.forEach(function (element) {
            element.RoundValue(RoundType);
        });
    };
    LayerNN.prototype.CalcNextLayer = function (RoundType) {
        this.RoundValues(RoundType);
        this.next_layer.Reset();
        for (var i = 0; i < this.Size(); i++) {
            for (var j = 0; j < this.next_layer.Size(); j++) {
                var cur_node_next_layer = this.next_layer.layer[j];
                var cur_node = this.layer[i];
                cur_node_next_layer.SetValue(cur_node_next_layer.CurrentValue() + (cur_node.CurrentValue() * this.sinnapses[i][j]));
            }
        }
    };
    LayerNN.prototype.OffsetSinnapses = function (factor) {
        this.sinnapses.forEach(function (row) {
            row.map(function (num) { num += ((Math.random() * 2) - 1) * factor; });
        });
    };
    return LayerNN;
}());
var NeuralNet = /** @class */ (function () {
    function NeuralNet(inputsCount, outputsCount, neuralsInLayerCount, hiddenLayersCount, inputsRound, neuralsRound, outputsRound) {
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
        this.NeuralsInLayerCount = neuralsInLayerCount;
        this.HiddenLayersCount = hiddenLayersCount;
        this.InputsRound = inputsRound;
        this.NeuralsRound = neuralsRound;
        this.OutputsRound = outputsRound;
        this.score = 0;
        this.HiddenLayer = new Array();
        this.Outputs = new LayerNN(this.OutputsCount);
        for (var i = 0; i < this.HiddenLayersCount; i++) {
            if (i == 0)
                this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.Outputs);
            else
                this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.HiddenLayer[i - 1]);
        }
        this.Inputs = new LayerNN(this.InputsCount, this.HiddenLayer[this.HiddenLayersCount - 1]);
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
    NeuralNet.prototype.Score = function () {
        return this.score;
    };
    NeuralNet.prototype.Clone = function () {
        var result = new NeuralNet(this.InputsCount, this.OutputsCount, this.NeuralsInLayerCount, this.HiddenLayersCount, this.InputsRound, this.NeuralsRound, this.OutputsRound);
        result.Outputs = this.Outputs.Clone();
        for (var i = this.HiddenLayer.length - 1; i > 0; i--) {
            result.HiddenLayer[i] = this.HiddenLayer[i].Clone();
            if (i == this.HiddenLayer.length - 1)
                result.HiddenLayer[i].next_layer = result.Outputs;
            else
                result.HiddenLayer[i].next_layer = result.HiddenLayer[i - 1].next_layer;
            result.Inputs.next_layer = result.HiddenLayer[0];
        }
        result.Inputs = this.Inputs.Clone();
        result.score = 0;
        return result;
    };
    NeuralNet.prototype.GetInputs = function (numbers) {
        if (numbers.length != this.InputsCount)
            throw new Error("numbers count does not appropriate to count of inputs in your NN");
        for (var i = 0; i < this.Inputs.layer.length; i++) {
            this.Inputs.layer[i].SetValue(numbers[i]);
        }
    };
    NeuralNet.prototype.ChangeScore = function (change) {
        this.score += change;
    };
    NeuralNet.prototype.OffsetSinnapses = function (factor) {
        this.Inputs.OffsetSinnapses(factor);
        this.HiddenLayer.forEach(function (l) { return l.OffsetSinnapses(factor); });
    };
    NeuralNet.prototype.Calc = function () {
        this.Inputs.CalcNextLayer(this.InputsRound);
        for (var i = this.HiddenLayer.length - 1; i >= 0; i--) {
            this.HiddenLayer[i].CalcNextLayer(this.NeuralsRound);
        }
        this.Outputs.RoundValues(this.OutputsRound);
    };
    NeuralNet.prototype.Result = function () {
        this.Calc();
        var result = new Array();
        this.Outputs.layer.forEach(function (element) {
            result.push(element.CurrentValue());
        });
        return result;
    };
    return NeuralNet;
}());
var Generation = /** @class */ (function () {
    function Generation(inputsCount, outputsCount, neuralsInLayerCount, hiddenLayersCount, size, inputsRound, neuralsRound, outputsRound) {
        console.log("Creating generation...");
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
        this.NeuralsInLayerCount = neuralsInLayerCount;
        this.HiddenLayersCount = hiddenLayersCount;
        this.InputsRound = inputsRound;
        this.NeuralsRound = neuralsRound;
        this.OutputsRound = outputsRound;
        this.Size = size;
        this.SensivityLearning = 0.001;
        this.Generation_ = new Array();
        for (var i = 0; i < this.Size; i++) {
            this.Generation_.push(new NeuralNet(this.InputsCount, this.OutputsCount, this.NeuralsInLayerCount, this.HiddenLayersCount, this.InputsRound, this.NeuralsRound, this.OutputsRound));
        }
        console.log("Generation is created!");
    }
    Object.defineProperty(Generation.prototype, "size", {
        get: function () {
            return this.Size;
        },
        enumerable: false,
        configurable: true
    });
    Generation.prototype.BestNet = function () {
        return this.Generation_.reduce(function (max, obj) { return (obj.Score() > ((max === null || max === void 0 ? void 0 : max.Score()) || 0) ? obj : max); });
    };
    Generation.prototype.BestNetIndex = function () {
        return this.Generation_.indexOf(this.BestNet());
    };
    Generation.prototype.BestScore = function () {
        if (this.BestNet())
            return this.BestNet().Score();
        else
            return 0;
    };
    Generation.prototype.SetByBestNet = function () {
        var BestNet_ = this.BestNet();
        for (var i = 0; i < this.Generation_.length; i++) {
            this.Generation_[i] = BestNet_.Clone();
            if (i != 0)
                this.Generation_[i].OffsetSinnapses(this.SensivityLearning);
            this.Generation_[i].ChangeScore(-this.Generation_[i].Score());
        }
        console.log("Next generation is ready");
    };
    return Generation;
}());
