const {
  ETL_SOCKET_NODES = '8186'
} = process.env

export default {
  nodes: ETL_SOCKET_NODES.toString()?.split(',') || []
}
