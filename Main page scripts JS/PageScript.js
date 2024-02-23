const MaxStepsForGameAI = 1000;
const gen_size = 100;
let generations_passed = 0;
let gen = new Generation(12, 4, 30, 6, gen_size, RoundMethod.DontRound, RoundMethod.ZeroAndOne, RoundMethod.Tanh);
alert(gen.Generation_);
let playing = true;
let FoundApple = false;
function PassOneGeneration() {
    let steps = 0;
    for (let i = 0; i < gen_size; i++) {
        steps = 0;
        playing = true;
        while (playing) {
            StepNN(i);
            steps++;
            if(FoundApple){
                step = 0;
                FoundApple = false;
            }
            if(steps > MaxStepsForGameAI){
                gen.Generation_[i].ChangeScore(-100);
                console.log(i + " stopped");
                break;
            }
        }
    }
    gen.SetByBestNet();
    try {
        for (let i = 0; i < gen_size; i++) {
            gen.Generation_[i].ChangeScore(-Generation_[i].Score());
        }
    } catch (error) {
        alert(error);
    }
    
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
            console.log(index + ": " + gen.Generation_[index].Score().toFixed(2));
            playing = false;
            break;
        case 2:
            gen.Generation_[index].ChangeScore(30);
            FoundApple = true;
            break;
        default:
            throw new Error("Unknown step result!");
    }
}