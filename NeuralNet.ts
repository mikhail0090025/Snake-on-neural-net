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
    protected layer: NodeNN[];
    protected size: number;
    protected next_layer: LayerNN;
    protected sinnapses: number[][];
    protected RoundType: RoundMethod;

    // Getters
    public Size(): number { return this.size; }
    public RoundTypeG(): RoundMethod { return this.RoundType; }

    constructor(count: number, roundType: RoundMethod, NextLayer: LayerNN){

        if(!Number.isInteger(count)){
            throw new Error("count has to be an integer");
        }

        this.size = count;
        this.RoundType = roundType;

        for (let i = 0; i < count; i++) this.layer.push(new NodeNN());
        if(NextLayer) {
            this.next_layer = NextLayer;
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
    public RoundValue() :void{
        this.layer.forEach(element => {
            element.RoundValue(this.RoundType);
        });
    }
    public CalcNextLayer(): void{

    }
}
class NeuralNet {
    public InputsCount: number;
    public OutputsCount: number;
    public NeuralsInLayerCount: number;
    public HiddenLayersCount: number;
  
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
  
    constructor(
      inputsCount: number,
      outputsCount: number,
      neuralsInLayerCount: number,
      hiddenLayersCount: number
    ) {
      this.InputsCount = inputsCount;
      this.OutputsCount = outputsCount;
      this.NeuralsInLayerCount = neuralsInLayerCount;
      this.HiddenLayersCount = hiddenLayersCount;
  
      // Check if all properties are integers
      this.CheckIntegers();
    }
  }