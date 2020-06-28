<template lang="pug">
    div
        ul.tool-list
            li(v-for="card in cards" @click="showDetail(card)").tool-card 
                p.tool-card-name {{card.name}}
</template>

<script>
    import { Modal } from 'ant-design-vue';
    import { loadToolCards } from '../service'
    import Vue from 'vue'

    Vue.use(Modal)

    export default {
        name: 'ToolCards',
        data() {
            return {
                cards: []
            }
        },
        mounted() {
            loadToolCards().then(cards => this.cards = cards)
        },
        methods: {
            showDetail(card) {
                const content = JSON.parse(card.description)
                const h = this.$createElement;
                this.$info({
                    title: card.name,
                    content: h('div', {}, [
                        h('p', content.description),
                        h('p', content.sample),
                    ]),
                })
            }
        }
    }
</script>

<style lang="scss">
.tool-list {
    display: flex;
    justify-content: space-around;
    list-style-type: none;
    padding: 40px;
    margin: 30px 100px;
    border-radius: 8px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}

.tool-card {
    height: 300px;
    width: 16%;
    position: relative;
    border-radius: 8px;
    background-color: var(--violet-blue);

    &-name {
        color: #ffffff;
        bottom: 20px;
        position: absolute;
        width: 100%;
        font-weight: 600;
        font-size: 20px;
    }
}
</style>