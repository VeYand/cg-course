type BuildMode = 'development' | 'production'

type BuildPaths = {
	html: string,
	entry: string,
}

type BuildAliases = Record<string, string>

type BuildOptions = {
	minify: boolean,
	port: number,
	isDev: boolean,
	mode: BuildMode,
	paths: BuildPaths,
	aliases: BuildAliases,
}

export type {
	BuildMode,
	BuildPaths,
	BuildAliases,
	BuildOptions,
}