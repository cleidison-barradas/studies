import IntervalDays from "../../../interfaces/interval_days";

const intervals: IntervalDays[] = [
  {
    days: 15,
    title: "{name}, está acontecendo algo!?...",
    subTitle:
      "Calma, não precisa ficar preocupado! hehe. É que nós vimos que você não utilizou mais o nosso site.",
    message:
      "Ocorreu alguma coisa? Se precisar de ajuda ou passar algum feedback, chama a gente no whatsapp {storeWhatsapp} ou pelo telefone {storePhone}!",
  },
  {
    days: 20,
    title: "Ofertas em medicamentos e perfumaria na {storeName}!",
    subTitle: "Opa, {name}, tudo beleza?",
    message:
      "Você já viu que nosso site está recheado de novidades e ofertas para você?! Confira!",
  },
  {
    days: 30,
    title: "{name}, está tudo bem por aí!?...",
    subTitle: "Opa! Espero que você esteja muito bem!",
    message:
      "Estou passando para te desejar um excelente dia, em nome da {storeName}! Ah! E não deixe de conferir nosso site, está recheadinho de produtos que você gosta.",
  },
]

export function getIntervalDays() {

  return intervals
}