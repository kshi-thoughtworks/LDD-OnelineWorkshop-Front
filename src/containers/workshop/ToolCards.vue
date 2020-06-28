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
                        h('a-icon', {props: {
                            type: 'book',
                            theme: 'filled'
                        }},),
                        h('span', '简介'),
                        h('p', content.description),
                        h('a-icon', {props: {
                            type: 'bulb',
                            theme: 'filled'
                        }},),
                        h('span', '举例'),
                        h('p', content.sample),
                    ]),
                    maskClosable: true,
                    class: 'tool-card-detail',
                })
            }
        }
    }
</script>

<style lang="scss">
.tool-list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 40px;
    margin: 30px 100px;
    border-radius: 8px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}

.tool-card {
    height: 300px;
    width: 18%;
    margin: 10px;
    position: relative;
    border-radius: 8px;
    background-color: var(--violet-blue);

    &-name {
        color: #ffffff;
        bottom: 20px;
        position: absolute;
        width: 100%;
        font-size: 20px;
    }
}

.tool-card-detail {
    &.ant-modal-confirm .ant-modal-body {
        padding: 0;
        margin-bottom: 0;
    }

    &.ant-modal-confirm .ant-modal-confirm-title {
        font-size: 24px;
        color: var(--midnight-purple);
    }

    .ant-modal-confirm-body > .anticon + .ant-modal-confirm-title + .ant-modal-confirm-content {
        margin-left: 0;
        margin-top: 40px;
        color: var(--midnight-purple);
    }

    .anticon-info-circle {
        display: none;
    } 
    
    p {
        margin-top: 10px;
        margin-bottom: 30px;
    }

    .anticon {
        margin-right: 6px;
    }

    i + span {
        font-weight: 600;
    }
}
</style>