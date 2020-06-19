import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Input } from 'ant-design-vue'

@Component({
    components: {
        'a-input': Input
    }
})
export default class WorkshopModal extends Vue {

    @Prop(String) modalTitle!: string;
    @Prop(String) workshopName?: string;
    @Prop(String) workshopDescription?: string;

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

    mounted() {
        this.form.name = this.$props.workshopName
        this.form.description = this.$props.workshopDescription
    }

    onClickConfirm() {
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
        const {confirm} = this.$listeners
        if (confirm instanceof Function) {
            confirm(this.form.name.trim(), this.form.description.trim())
        }
    }

    render(h) {
        const { cancel } = this.$listeners
        return (
            <a-modal
                title={this.$props.modalTitle}
                visible={true}
                onOk={this.onClickConfirm}
                onCancel={cancel}
                okText="完成"
                cancelText="取消"
            >
                <a-form-model ref="ruleForm" rules={this.rules} v-model={this.form}>
                    <a-form-model-item label="工作坊名称">
                        <a-input v-model={this.form.name} />
                    </a-form-model-item>
                    <a-form-model-item label="工作坊介绍">
                        <a-input v-model={this.form.description} type="textarea" />
                    </a-form-model-item>
                </a-form-model>
            </a-modal>
        )
    }
}