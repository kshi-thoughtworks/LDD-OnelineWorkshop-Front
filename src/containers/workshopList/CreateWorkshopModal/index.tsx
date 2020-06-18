import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import {Input} from 'ant-design-vue';
import axios from 'axios';

@Component({
    components: {
        'a-input': Input
    }
})
export default class CreateWorkshopModal extends Vue {

    form = {
        name: '',
        description: ''
    }

    rules = {
        name: [
            {required: true, message: '请输入工作坊名称', trigger: 'change'},
            {max: 20, message: '工作坊名称不可超过20个字符', trigger: 'change'}
            ],
        description: [
            {required: true, message: '请输入工作坊介绍', trigger: 'change'},
            {max: 200, message: '工作坊介绍不可超过200个字符', trigger: 'change'}
            ],
        }

    createWorkshop() {
        if (this.form.name.length == 0) {
            this.$message.error('请输入工作坊名称')
            return
        } else if (this.form.name.length > 20) {
            this.$message.error('工作坊名称不可超过20个字符')
            return
        } else if (this.form.description.length == 0) {
            this.$message.error('请输入工作坊介绍')
            return
        } else if (this.form.description.length > 200) {
            this.$message.error('工作坊介绍不可超过200个字符')
            return
        }
        axios.post('/api/workbenches', this.form)
            .then(() => {
                this.$message.success('创建成功')
                const {confirm, cancel} = this.$listeners
                if (cancel instanceof Function) {
                    cancel()
                }
                if (confirm instanceof Function) {
                    confirm()
                }
            })
            .catch(error => this.$message.error(error.response.data))
    }

    render(h) {
        const { cancel} = this.$listeners
        return (
            <a-modal
                title="编辑工作坊信息"
                visible={true}
                onOk={this.createWorkshop}
                onCancel={cancel}
            >
                <a-form-model ref="ruleForm" rules={this.rules} v-model={this.form}>
                    <a-form-model-item label="工作方名称">
                        <a-input v-model={this.form.name} />
                    </a-form-model-item>
                    <a-form-model-item label="工作坊介绍">
                        <a-input v-model={this.form.description} />
                    </a-form-model-item>
                </a-form-model>
            </a-modal>
        )
    }
}