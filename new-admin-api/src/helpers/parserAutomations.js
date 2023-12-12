module.exports = (args) => {
  const { MISS_YOU } = args
  const field = 'MISS_YOU'
  let obj = {}

  MISS_YOU.forEach(item => {
    const key = field.concat('_', item.interval)
  
    obj = {
      ...obj,
      [key]: item.active
    }
  })

  return {
    _id: args._id,
    status: args.status,
    RECENT_CART: args.RECENT_CART,
    subject: args.subject,
    message: args.message,
    target: args.target,
    ...obj,
  }
}