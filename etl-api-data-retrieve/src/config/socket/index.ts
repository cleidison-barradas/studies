const {
  ETL_SOCKET_NODE = '8186',
  ETL_SOCKET_NODES = '8186,8187,8188',
  ETL_SOCKET_NODES_PRIMARY = '8186,8187,8188'
} = process.env

export default {
  node: ETL_SOCKET_NODE.toString()?.split(',') || [],
  nodes: ETL_SOCKET_NODES.toString()?.split(',') || [],
  nodesPrimary: ETL_SOCKET_NODES_PRIMARY.toString()?.split(',') || []
}
