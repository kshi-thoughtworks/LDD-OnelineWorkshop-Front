<template lang="pug">
    div
        div(v-for="type in Object.keys(toolTypes)").tool-list-container
            p.tool-list-title 工具卡-{{toolTypes[type]}}
            ul.tool-list
                li(v-for="card in cardsOfType(type)" @click="showDetail(card)" :class="`tool-card-${card.sup_type}`").tool-card 
                    p.tool-card-name {{card.name}}
</template>

<script>
    import { loadToolCards } from '../service'

    export default {
        name: 'ToolCards',
        data() {
            return {
                cards: [],
                toolTypes: {
                    'subject': '主题', 
                    'class': '类别', 
                    'tech': '技能', 
                    'monetizing': '价值'
                }
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
                    title: '工具卡—' + card.name,
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
            },
            cardsOfType(type) {
                return this.cards.filter(card => card.sup_type == type)
            }
        }
    }
</script>

<style lang="scss">
.tool-list-container {
    margin: 30px 100px;
    padding: 30px 40px;
    border-radius: 8px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
}

.tool-list-title {
    text-align: left;
    padding-left: 16px;
    font-size: 24px;
    font-weight: 600;
    color: var(--midnight-purple);
}

.tool-list {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
}

.tool-card {
    height: 300px;
    width: 18%;
    position: relative;
    border-radius: 8px;
    background-repeat: round;
    cursor: pointer;
    margin: 10px;

    &-name {
        color: #6c684b;
        bottom: 20px;
        position: absolute;
        width: 100%;
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    &-subject {
        background-image: url(../../assets/images/cards/subject.png);
    }

    &-class {
        background-image: url(../../assets/images/cards/class.png);
    }

    &-tech {
        background-image: url(../../assets/images/cards/tech.png);
    }

    &-monetizing {
        background-image: url(../../assets/images/cards/monetizing.png);
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