module.exports = {
    processOrderStatus(order, statusCounts) {
        switch (order.statusOrder.type) {
          case 'pending':
            statusCounts.totalPending += order.totalOrder;
            break;
          case 'accepted':
            statusCounts.totalAccepted += order.totalOrder;
            break;
          case 'rejected':
            statusCounts.totalRejected += order.totalOrder;
            break;
          case 'delivery_made':
            statusCounts.totalDelivery_made += order.totalOrder;
            break;
          case 'reversed':
            statusCounts.totalReversed += order.totalOrder;
            break;
          case 'out_delivery':
            statusCounts.totalOut_delivery += order.totalOrder;
            break;
          case 'payment_made':
            statusCounts.totalPayment_made += order.totalOrder;
            break;
          default:
            statusCounts.totalDefault += order.totalOrder;
        }
      },
}