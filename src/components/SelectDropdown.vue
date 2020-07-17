<template lang="pug">
    div.select-container
        a-select(mode="multiple" :value="selectedList" @change="handleChange" @search="searchItems" 
            ref="select" :class="mode == 'single' ? 'select-dropdown-single' : ''").select-input
        ul(@click="onDropdownClick").select-dropdown
            li(v-for="item in filteredtems" @click="selectChange(item)").select-item
                p.select-item-name {{item}}
</template>

<script>
    import { Select} from 'ant-design-vue'

    export default {
        name: 'SelectDropdown',
        components: {
            'a-select': Select,
        },
        props: ['items', 'value', 'mode'],
        data() {
            return {
                allItems: this.$props.items,
                filteredtems: this.$props.items,
                selectedList: this.$props.value
            }
        },
        watch: {
            items() {
                this.allItems = this.$props.items
                this.filteredtems = this.$props.items
            },
            value() {
                this.selectedList = this.value
            },
            selectedList () {
                this.$emit('input', this.selectedList)
            }
        },
        methods: {
            selectChange(selectedItem) {
                if (this.mode == 'single') {
                    this.selectedList = selectedItem
                } else if (this.mode == 'multiple' && !(this.selectedList.includes(selectedItem))) {
                    this.selectedList.push(selectedItem)
                }
            },
            handleChange(value) {
                this.selectedList = value
            },
            searchItems(value) {
                this.filteredtems = this.allItems.filter(user => {
                    return user.username.includes(value) || user.email.includes(value)
                })
            },
            onDropdownClick() {
                this.$refs.select.focus()
            }
        },
    }
</script>

<style lang="scss">
.select-container {
    position: relative;
    .select-dropdown-single {
        .ant-select-selection__choice__remove {
            display: none;
        }
    }
}
.select-input {
    width: 100%;
}
.select-item-name {
    line-height: 36px;
}
</style>