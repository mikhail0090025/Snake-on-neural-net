const MaxStepsForGameAI = 500;
const gen_size = 20;
let generations_passed = 0;
let gen = new Generation(12, 4, 30, 6, gen_size, RoundMethod.DontRound, RoundMethod.ZeroAndOne, RoundMethod.Tanh);
gen.Generation_[0].Clone();
let playing = true;
function PassOneGeneration() {
    let steps = 0;
    for (let i = 0; i < gen_size; i++) {
        steps = 0;
        playing = true;
        while (playing) {
            StepNN(i);
            steps++;
            if(steps > MaxStepsForGameAI){
                gen.Generation_[i].ChangeScore(-100);
                console.log("Player " + i + " got into cycle or made too many steps");
                break;
            }
        }
    }
    gen.SetByBestNet();
    generations_passed++;
}
        function StepNN(index) {
            gen.Generation_[index].GetInputs(game.StateForNeuralNet());
            let res = gen.Generation_[index].Result();
            let step = res.indexOf(Math.max(...res));
            let step_result = game.Step(step, true);
            switch (step_result) {
                case 0:
                    gen.Generation_[index].ChangeScore(0.1);
                    break;
                case 1:
                    console.log(index + " played, and has score " + gen.Generation_[index].Score());
                    playing = false;
                    break;
                case 2:
                    gen.Generation_[index].ChangeScore(30);
                    break;
                default:
                    throw new Error("Unknown step result!");
            }
        }