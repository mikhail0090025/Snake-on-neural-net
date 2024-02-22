// View of generation
new Vue({
    el: "#gen_data",
    data: {
        generation: gen,
        GenerationsPassed: generations_passed,
    },
    computed: {
        BestNN() {
            const bestNet = this.generation.BestNet();
            return bestNet !== undefined ? bestNet : null;
        }
    },
    methods: {
        
    }
});