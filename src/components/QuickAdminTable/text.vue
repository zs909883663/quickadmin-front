<template>
    <div>
        {{ value }}
    </div>
</template>

<script>
export default {
    name: 'QuickAdminText',
    props: {
        value: {
            required: true,
            type: String | Number,
        },
    },
}
</script>
