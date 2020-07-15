<template lang="pug">
    a-modal(
        wrapClassName="edit-card-modal"
        visible=true 
        cancelText="取消"
        :width="620"
        :title="this.editable ? '修改卡牌' : '添加卡牌'"
        :okText="this.editable ? '保存' : '添加'"
        @ok="submitCard"
        @cancel="cancelCard"
    )
        label 业务价值卡
        a-input(:maxLength="16" placeholder="请输入标题" v-model="name").data-card-input
        label 业务价值权重
        div.data-card-input
            a-input-number(:maxLength="16" placeholder="请输入权重" v-model="weight" :min="1" :max="100").data-card-input-inside
            span.data-card-input-suffix %
</template>

<script>
import { Input, InputNumber } from 'ant-design-vue'

export default {
    name: 'ValueCard',
    components: {
        'a-input': Input,
        'a-input-number': InputNumber
    },
    props: ['editable', 'initName', 'initWeight'],
    data() {
        return {
            name: this.initName,
            weight: this.initWeight
        }
    },
    methods: {
        submitCard() {
            const { confirm } = this.$listeners
            const data = {
                content: this.name,
                weight: this.weight
            }
            confirm(JSON.stringify(data), this.editable)
        },
        cancelCard() {
            const { close } = this.$listeners
            close()
        }
    }
}
</script>

<style lang="scss">
.edit-card-modal {
    .data-card-input-inside {
        width: 95%;
    }    
}
.data-card-input-suffix {
    font-size: 24px;
    color: var(--midnight-purple);
    padding-left: 8px;
}
</style>