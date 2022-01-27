import { SavePurchases } from "@/domain/use-cases";
import faker from "faker";

export const mockPurchase = ():Array<SavePurchases.Params> => {
  return [
    {
      id:faker.random.uuid(),
      date:faker.date.recent(),
      value:faker.random.number()
    },
    {
      id:faker.random.uuid(),
      date:faker.date.recent(),
      value:faker.random.number()
    },
  ]
}

