import {BuildOptions} from './types/config'
import {ResolveOptions as ViteResolveOptions, AliasOptions} from 'vite'

type ResolveOptions = ViteResolveOptions & {
	alias?: AliasOptions,
}

const buildResolve = (args: BuildOptions): ResolveOptions => ({
	alias: args.aliases,
})

export {
	buildResolve,
}