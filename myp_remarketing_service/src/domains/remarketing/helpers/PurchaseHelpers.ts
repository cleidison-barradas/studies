import { Cart, CartRepository } from "@mypharma/api-core";
import IntervalDays from "../../../interfaces/interval_days";
import * as moment from "moment";

export const INTERVALS: IntervalDays[] = [
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

export async function GetPurchasedCarts() {
  const purchases = new Map<number, Cart[]>([]);

  for await (const interval of INTERVALS) {
    const now = moment().subtract(interval.days, "days");

    const results = await CartRepository.repo().find({
      where: {
        purchased: "YES",
        customerId: { $ne: null },
        updatedAt: {
          $gte: now.startOf("day").toDate(),
          $lte: now.endOf("day").toDate(),
        },
      },
    });

    if (results.length > 0) {
      let cartPurchases = purchases.get(interval.days)

      cartPurchases.push(...results)

      purchases.delete(interval.days)

      purchases.set(interval.days, results)
    }
  }

  return purchases;
}
