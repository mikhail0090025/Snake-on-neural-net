const root_for_nn_view = document.getElementById("root_for_nn_view");
function NeuralNetView({NeuralNet}) {
    /*
        Properties to show
        public readonly InputsCount: number;
        public readonly OutputsCount: number;
        public readonly NeuralsInLayerCount: number;
        public readonly HiddenLayersCount: number;
        public Score(): number
    */
    return (
        /*
        <div className="col-sm-10 col-md-4 col-lg-4 col-xl-9 border p-3 border-primary rounded">
            <p>Inputs count: {NeuralNet.InputsCount}</p>
            <p>Outputs count: {NeuralNet.OutputsCount}</p>
            <p>Neurals in layer count: {NeuralNet.NeuralsInLayerCount}</p>
            <p>Hidden layers count: {NeuralNet.HiddenLayersCount}</p>
            <p>Score: {NeuralNet.Score()}</p>
        </div>
        */
        <div>
            {NeuralNet.Inputs.sinnapses.map((row, index) => (
                <p key={index}>
                    {row.map((number, index) => (
                        <span key={index}>{number.toFixed(2)} &nbsp;</span>
                    ))}
                </p>
            ))}
        </div>
    );
}
function ShowNNsInGeneration({Generation}) {
    return(
        <div>
            {Generation.Generation_.map((net, index) => (
                <NeuralNetView NeuralNet={net} key={index} />
            ))}
        </div>
    );
}
//ReactDOM.render(<NeuralNetView NeuralNet={gen.Generation_[0]} />, root_for_nn_view);
//ReactDOM.render(<ShowNNsInGeneration Generation={gen} />, root_for_nn_view);