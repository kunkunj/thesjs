
export interface PluginContainer{
    use(plugin: Function | { install: Function })
}