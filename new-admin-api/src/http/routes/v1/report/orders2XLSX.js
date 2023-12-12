const XLSX = require('xlsx-js-style')
const {format} = require('date-fns')
const {
    normalizeOrders,
    getOrdersProducts,
    getOrdersEmails,
} = require('../../../../helpers/normalize')

module.exports = {

  /**
   * [Converts MongoDB orders list into Excel Workbook]
   * @param  {[array]} orders [Array objects containing orders data]
   * @param  {[string]} startAt [Start date of orders history, can be 'null']
   * @param  {[string]} endAt [End date of orders history, can be 'null']
   * @return {[XLSX.Book]} [XLSX.utils.book spreadsheet workbook from 'xlsx-js-style' library]
   */
    orders2XLSX(orders=[],startAt,endAt){
        const content = normalizeOrders(orders)
        var ordersPeriod = ""

      if (startAt ==='null' && endAt === 'null'){
        ordersPeriod = "Relatório de todo o histórico de vendas."
      }
      else if (startAt !=='null' && endAt === 'null'){
        const today =format(new Date(),'dd/MM/yyyy');
        ordersPeriod = "Relatório de "+startAt+" até "+today
      }
      else if (startAt ==='null' && endAt !== 'null'){
        ordersPeriod = "Relatório do início das vendas até "+endAt
      }
      else ordersPeriod = "Relatório de "+startAt+" à "+endAt


        var ordersSheet = XLSX.utils.aoa_to_sheet([
            [ordersPeriod],
            ["OBS: Atenção, esta planilha possuí em seu rodapé outras 2 páginas que informam quais os produtos mais vendidos e quais clientes mais compraram."],
            ["Para melhor visualização com opções de filtragem é recomendado abrir este relatório no Microsoft Excel."],
            [" "]
        ]);

        XLSX.utils.sheet_add_json(ordersSheet, content, {origin:-1})
        ordersSheet['!cols'] = [{ width: 19 }, { width: 25 }, { width: 24 }, { width: 31 }, { width: 17 }, { width: 12 }, { width: 12 }, { width: 28 }, { width: 29 }, { width: 29 }, { width: 29 }, { width: 29 }, { width: 29 }, { width: 29 }, { width: 29 }, { width: 29 }, { width: 29 }, { width: 29 } ] //set col. widths
        ordersSheet['!autofilter'] = { ref:"E5:G7" } // add filters to columns E and F

        /*Format all cells of the worksheet */
        for (i in ordersSheet) {
          if (typeof(ordersSheet[i]) != "object") continue;
          let cell = XLSX.utils.decode_cell(i);

          ordersSheet[i].s = { // styling for all cells
              alignment: {
                  vertical: "top",
                  horizontal: "left",
                  wrapText: '1', // any truthy value here
              }
          };
       }

      /* Merges cells A to H of the three first lines*/
      if(!ordersSheet["!merges"]) ordersSheet["!merges"] = []
      ordersSheet["!merges"].push(XLSX.utils.decode_range("A1:H1"))
      ordersSheet["!merges"].push(XLSX.utils.decode_range("A2:H2"))
      ordersSheet["!merges"].push(XLSX.utils.decode_range("A3:H3"))


      let ordersCustomers = getOrdersEmails(content)
      ordersCustomers = XLSX.utils.json_to_sheet(ordersCustomers)
      ordersCustomers['!cols'] = [{ width: 31 }, { width: 31 }]

      const ordersProducts = XLSX.utils.json_to_sheet(getOrdersProducts(orders))
      ordersProducts['!cols'] = [{ width: 20 }, { width: 40 }]

      /*Append the three worksheets as pages of workbook */
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, ordersSheet, "Pedidos")
      XLSX.utils.book_append_sheet(workbook, ordersCustomers, "Clientes que mais compram")
      XLSX.utils.book_append_sheet(workbook, ordersProducts, "Produtos mais vendidos")

        return workbook
        }
    }
