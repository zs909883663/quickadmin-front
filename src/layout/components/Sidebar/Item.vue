<script>
export default {
    name: 'MenuItem',
    functional: true,
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        tag: {
            type: Object,
            default: () => {
                return {
                    type: 'danger',
                    value: '',
                }
            },
        },
    },
    render(h, context) {
        const { icon, title, tag } = context.props

        const vnodes = []

        if (icon) {
            vnodes.push(<svg-icon icon-class={icon} />)
        }

        if (title) {
            vnodes.push(
                <span slot="title">
                    {title} <el-badge class="ml10" value={tag.value} type={tag.type}></el-badge>
                </span>,
            )
        }

        return vnodes
    },
}
</script>
