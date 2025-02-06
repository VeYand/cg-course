import {PluginOption} from 'vite'
import react from '@vitejs/plugin-react'

const buildPlugins = (): PluginOption[] => ([
	react(),
])

export {
	buildPlugins,
}