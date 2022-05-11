<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'App',
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${this.siteConfig.site_title}` : this.siteConfig.site_title
            },
            link: [{ rel: 'icon', href: this.siteConfig.site_icon }],
        }
    },
    computed: {
        ...mapGetters(['siteConfig']),
    },
}
</script>
