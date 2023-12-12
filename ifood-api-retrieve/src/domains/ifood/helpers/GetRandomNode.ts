export const getRandomNode = (nodes: string[]) => {

  return nodes[Math.floor(Math.random() * nodes.length)]
}