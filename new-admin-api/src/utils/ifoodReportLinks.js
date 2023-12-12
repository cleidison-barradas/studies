function checkReportLinks (tenant) {
    //Data inicial de quando os relatórios começaram a ser emitidos. (Dezembro de 2021)
    const start = new Date(2021, 11);

    const reports = []
    const today = new Date();

    const numberOfReports = monthDiff(start, today)
    const reference = start;
    for(let report = 0; report < numberOfReports; report++){
        const url = getIndividualLink(tenant, reference.getMonth(), reference.getFullYear());
        const link = {
            label: `${getMonthName(reference.getMonth() + 1, true)} - ${reference.getFullYear()}`,
            value: url
        }
        reports.push(link)
        reference.setMonth(reference.getMonth() + 1)
    }
    
    return reports
}

function getIndividualLink(tenant, month, year) {
    return `${tenant}/reports/pedidos_ifood_${getMonthName(month + 1)}_${year}.csv`
}

function monthDiff(start, end) {
    var months;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    return months <= 0 ? 0 : months;
}

function getMonthName (month, fullName = false) {
    switch(month){
        case 1:
            return fullName ? "Janeiro" : "Jan"
        case 2:
            return fullName ? "Fevereiro" : "Fev"
        case 3:
            return fullName ? "Março" : "Mar"
        case 4:
            return fullName ? "Abril" : "Abr"
        case 5:
            return fullName ? "Maio" : "Mai"
        case 6:
            return fullName ? "Junho" : "Jun"
        case 7:
            return fullName ? "Julho" : "Jul"
        case 8:
            return fullName ? "Agosto" : "Ago"
        case 9:
            return fullName ? "Setembro" : "Set"
        case 10:
            return fullName ? "Outubro" : "Out"
        case 11:
            return fullName ? "Novembro" : "Nov"
        case 12:
            return fullName ? "Dezembro" : "Dez"
        default:
            return ""
    }
}

module.exports = { checkReportLinks }