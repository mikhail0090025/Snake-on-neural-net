enum RoundMethod {
    DontRound = 0,
    Tanh = 1,
    ZeroAndOne = 2
}
class NodeNN{
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
}
class LayerNN{
    public layer: NodeNN[];
    protected size: number;
    protected next_layer: LayerNN;
    protected sinnapses: number[][];

    // Getters
    public Size(): number { return this.size; }

    constructor(count: number, roundType: RoundMethod, NextLayer?: LayerNN){

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
}
class NeuralNet {
    public InputsCount: number;
    public OutputsCount: number;
    public NeuralsInLayerCount: number;
    public HiddenLayersCount: number;
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
      this.Outputs = new LayerNN(this.OutputsCount, this.OutputsRound);
      for (let i = 0; i < this.HiddenLayersCount; i++) {
        if(i == 0) this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.NeuralsRound, this.Outputs);
        else this.HiddenLayer[i] = new LayerNN(this.NeuralsInLayerCount, this.NeuralsRound, this.HiddenLayer[i - 1]);
      }
      this.Inputs = new LayerNN(this.InputsCount, this.InputsRound, this.HiddenLayer[this.HiddenLayersCount - 1]);
      // Check if all properties are integers
      this.CheckIntegers();
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
    public Calc(): void{
        this.Inputs.CalcNextLayer(this.InputsRound);
        for (let i = this.HiddenLayer.length - 1; i >= 0; i--) {
            this.HiddenLayer[i].CalcNextLayer(this.NeuralsRound);
        }
        this.Outputs.RoundValues(this.OutputsRound);

        console.log(this.Outputs);
    }
    public Result(): number[]{
        this.Calc();
        var result: number[] = new Array();
        this.Outputs.layer.forEach(element => {
            result.push(element.CurrentValue());
        });
        console.log(result);
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
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
        this.NeuralsInLayerCount = neuralsInLayerCount;
        this.HiddenLayersCount = hiddenLayersCount;
        this.InputsRound = inputsRound;
        this.NeuralsRound = neuralsRound;
        this.OutputsRound = outputsRound;
        this.Size = size;
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
    }

    public get size() : number {
        return this.Size;
    }

    public BestNet() : NeuralNet{
        return this.Generation_.reduce((max, obj) => (obj.Score() > (max?.Score() || 0) ? obj : max));
    }
    
  }