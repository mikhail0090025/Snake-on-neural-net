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
        for (var i = 0; i < count; i++)
            this.layer.unshift(new NodeNN());
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
    return LayerNN;
}());
var NeuralNet = /** @class */ (function () {
    function NeuralNet(inputsCount, outputsCount, neuralsInLayerCount, hiddenLayersCount, inputsRound, outputsRound, neuralsRound) {
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
        this.NeuralsInLayerCount = neuralsInLayerCount;
        this.HiddenLayersCount = hiddenLayersCount;
        this.InputsRound = inputsRound;
        this.NeuralsRound = neuralsRound;
        this.OutputsRound = outputsRound;
        this.Outputs = new LayerNN(this.OutputsCount, this.OutputsRound);
        for (var i = 0; i < this.HiddenLayersCount; i++) {
            if (i == 0)
                this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.NeuralsRound, this.Outputs);
            else
                this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.NeuralsRound, this.HiddenLayer[i - 1]);
        }
        this.Inputs = new LayerNN(this.InputsCount, this.InputsRound, this.HiddenLayer[this.HiddenLayersCount - 1]);
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
    NeuralNet.prototype.GetInputs = function (numbers) {
        if (numbers.length != this.InputsCount)
            throw new Error("numbers count does not appropriate to count of inputs in your NN");
        for (var i = 0; i < this.Inputs.layer.length; i++) {
            this.Inputs.layer[i].SetValue(numbers[i]);
        }
    };
    NeuralNet.prototype.Calc = function () {
        this.Inputs.CalcNextLayer(this.InputsRound);
        for (var i = this.HiddenLayer.length - 1; i > 0; i--) {
            this.HiddenLayer[i].CalcNextLayer(this.NeuralsRound);
        }
        this.Outputs.RoundValues(this.OutputsRound);
        console.log(this.Outputs);
    };
    return NeuralNet;
}());
