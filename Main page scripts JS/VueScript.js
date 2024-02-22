// View of generation
var GenerationVue = new Vue({
    el: "#gen_data",
    data: {
        generation: gen,
        GenerationsPassed: generations_passed,
        score: this.generation!==undefined ? this.generation.BestScore() : 0
    },
    computed: {
        BestNN() {
            const bestNet = this.generation.BestNet();
            return bestNet !== undefined ? bestNet : null;
        }
    },
    methods: {
        update: function(){
            this.generation = gen;
            this.GenerationsPassed = generations_passed;
            this.score = this.generation.BestScore();
        }
    }
});