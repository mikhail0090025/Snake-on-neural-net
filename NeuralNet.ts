enum RoundMethod {
    DontRound = 0,
    Tanh = 1,
    ZeroAndOne = 2
}
interface ICloneable{
    Clone(): ICloneable;
}
class NodeNN implements ICloneable{
    protected value: number;
    protected Is_rounded: boolean;
    // Getter for value
    public CurrentValue(): number {
        return this.value;
    }
    public SetValue(new_value: number): void{
        this.value = new_value;
        this.Is_rounded = false;
    }
    public RoundValue(RoundType: RoundMethod): void {
        if(this.Is_rounded) return;
        switch (RoundType) {
            case RoundMethod.DontRound:
                break;
            case RoundMethod.Tanh:
                this.value = Math.tanh(this.value);
                break;
            case RoundMethod.ZeroAndOne:
                if(this.value < 0) this.value = 0;
                else this.value = 1;
                break;
            default:
                throw new Error("Round method was undefined");
        }
        this.Is_rounded = true;
    }
    public Reset(): void{
        this.value = 0;
        this.Is_rounded = false;
    }
    constructor() {
        this.value = 0;
        this.Is_rounded = false;
    }
    Clone(): NodeNN {
        var result = new NodeNN();
        result.Is_rounded = this.Is_rounded;
        result.value = this.value;
        return result;
    }
}
class LayerNN implements ICloneable{
    public layer: NodeNN[];
    protected size: number;
    public next_layer: LayerNN;
    public sinnapses: number[][];

    // Getters
    public Size(): number { return this.size; }
    
    constructor(count: number, NextLayer?: LayerNN){

        if(!Number.isInteger(count)){
            throw new Error("count has to be an integer");
        }

        this.size = count;
        this.layer = [];
        this.sinnapses = new Array();

        for (let i = 0; i < count; i++) this.layer.unshift(new NodeNN());
        if(NextLayer) {
            this.next_layer = NextLayer;
            for (let i = 0; i < this.Size(); i++) this.sinnapses[i] = new Array();
            for (let i = 0; i < this.Size(); i++) {
                for (let j = 0; j < this.next_layer.Size(); j++) {
                    this.sinnapses[i][j] = (Math.random() * 2) - 1;
                }
            }
        }
    }
    Clone(): LayerNN {
        var result = new LayerNN(this.size);
        result.sinnapses = new Array();
        for (let i = 0; i < this.sinnapses.length; i++) {
            result.sinnapses.push(new Array());
            for (let j = 0; j < this.sinnapses[i].length; j++) {
                result.sinnapses[i].push(this.sinnapses[i][j]);
            }
        }

        return result;
    }
    public Reset() :void{
        this.layer.forEach(element => {
            element.Reset();
        });
    }
    public RoundValues(RoundType: RoundMethod) :void{
        this.layer.forEach(element => {
            element.RoundValue(RoundType);
        });
    }
    public CalcNextLayer(RoundType: RoundMethod): void{
        this.RoundValues(RoundType);
        this.next_layer.Reset();

        for (let i = 0; i < this.Size(); i++) {
            for (let j = 0; j < this.next_layer.Size(); j++) {
                var cur_node_next_layer = this.next_layer.layer[j];
                var cur_node = this.layer[i];
                cur_node_next_layer.SetValue(cur_node_next_layer.CurrentValue() + (cur_node.CurrentValue() * this.sinnapses[i][j]));
            }
        }
    }
    public OffsetSinnapses(factor: number): void{
        this.sinnapses.forEach((row) => {
            row.map((num) => {num += ((Math.random() * 2) - 1) * factor;});
        });
    }
}
class NeuralNet implements ICloneable {
    public readonly InputsCount: number;
    public readonly OutputsCount: number;
    public readonly NeuralsInLayerCount: number;
    public readonly HiddenLayersCount: number;
    public InputsRound: RoundMethod;
    public OutputsRound: RoundMethod;
    public NeuralsRound: RoundMethod;

    protected score: number;
    
    protected Inputs: LayerNN;
    protected Outputs: LayerNN;
    protected HiddenLayer: LayerNN[];

    protected CheckIntegers(): void {
      if (
        Number.isInteger(this.InputsCount) &&
        Number.isInteger(this.HiddenLayersCount) &&
        Number.isInteger(this.NeuralsInLayerCount) &&
        Number.isInteger(this.OutputsCount)
      ) {
        return;
      }
      throw new Error("Invalid property values. All properties must be integers.");
    }
    public Score(): number{
        return this.score;
    }
  
    constructor(
      inputsCount: number,
      outputsCount: number,
      neuralsInLayerCount: number,
      hiddenLayersCount: number,
      inputsRound: RoundMethod,
      neuralsRound: RoundMethod,
      outputsRound: RoundMethod
    ) {
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
      for (let i = 0; i < this.HiddenLayersCount; i++) {
        if(i == 0) this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.Outputs);
        else this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.HiddenLayer[i - 1]);
      }
      this.Inputs = new LayerNN(this.InputsCount, this.HiddenLayer[this.HiddenLayersCount - 1]);
      // Check if all properties are integers
      this.CheckIntegers();
    }
    Clone(): NeuralNet {
        var result = new NeuralNet(this.InputsCount, this.OutputsCount, this.NeuralsInLayerCount, this.HiddenLayersCount, this.InputsRound, this.NeuralsRound, this.OutputsRound);
        result.Outputs = this.Outputs.Clone();
        for (let i = this.HiddenLayer.length - 1; i > 0; i--) {
            result.HiddenLayer[i] = this.HiddenLayer[i].Clone();
            if(i == this.HiddenLayer.length - 1) result.HiddenLayer[i].next_layer = result.Outputs;
            else result.HiddenLayer[i].next_layer = result.HiddenLayer[i - 1].next_layer;
            result.Inputs.next_layer = result.HiddenLayer[0];
        }
        result.Inputs = this.Inputs.Clone();
        result.score = 0;
        return result;
    }
    public GetInputs(numbers: number[]): void{
        if(numbers.length != this.InputsCount) throw new Error("numbers count does not appropriate to count of inputs in your NN");

        for (let i = 0; i < this.Inputs.layer.length; i++) {
            this.Inputs.layer[i].SetValue(numbers[i]);
        }
    }
    public ChangeScore(change: number): void{
        this.score += change;
    }
    public OffsetSinnapses(factor:number):void{
        this.Inputs.OffsetSinnapses(factor);
        this.HiddenLayer.forEach((l) => l.OffsetSinnapses(factor));
    }
    public Calc(): void{
        this.Inputs.CalcNextLayer(this.InputsRound);
        for (let i = this.HiddenLayer.length - 1; i >= 0; i--) {
            this.HiddenLayer[i].CalcNextLayer(this.NeuralsRound);
        }
        this.Outputs.RoundValues(this.OutputsRound);

    }
    public Result(): number[]{
        this.Calc();
        var result: number[] = new Array();
        this.Outputs.layer.forEach(element => {
            result.push(element.CurrentValue());
        });
        return result;
    }
  }
  class Generation{
    public Generation_: NeuralNet[];
    public InputsCount: number;
    public OutputsCount: number;
    public NeuralsInLayerCount: number;
    public HiddenLayersCount: number;
    public InputsRound: RoundMethod;
    public NeuralsRound: RoundMethod;
    public OutputsRound: RoundMethod;
    protected Size: number;
    public SensivityLearning: number;
    
    constructor(
        inputsCount: number,
        outputsCount: number,
        neuralsInLayerCount: number,
        hiddenLayersCount: number,
        size: number,
        inputsRound: RoundMethod,
        neuralsRound: RoundMethod,
        outputsRound: RoundMethod
    ) {
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
        for (let i = 0; i < this.Size; i++) {
            this.Generation_.push(new NeuralNet(
                this.InputsCount,
                this.OutputsCount,
                this.NeuralsInLayerCount,
                this.HiddenLayersCount,
                this.InputsRound,
                this.NeuralsRound,
                this.OutputsRound
            ));
        }
        console.log("Generation is created!");
    }

    public get size() : number {
        return this.Size;
    }
    
    public BestNet() : NeuralNet{
        return this.Generation_.reduce((max, obj) => (obj.Score() > (max?.Score() || 0) ? obj : max));
    }
    public BestNetIndex() : number{
        return this.Generation_.indexOf(this.BestNet());
    }
    public BestScore(): number{
        if(this.BestNet()) return this.BestNet().Score();
        else return 0;
    }
    public SetByBestNet(): void{
        var BestNet_: NeuralNet = this.BestNet();
        for (let i = 0; i < this.Generation_.length; i++) {
            this.Generation_[i] = BestNet_.Clone();
            if(i != 0) this.Generation_[i].OffsetSinnapses(this.SensivityLearning);
            this.Generation_[i].ChangeScore(-this.Generation_[i].Score());
        }
        console.log("Next generation is ready");
    }
  }