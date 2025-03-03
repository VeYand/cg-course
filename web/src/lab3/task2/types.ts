type Position = {
	x: number,
	y: number,
}

type Color = {
	r: number,
	g: number,
	b: number,
	a: number,
}

type Renderable = {
	render: () => void,
	update: (time: number) => void,
}

export type {
	Position,
	Color,
	Renderable,
}