import { OFFERS } from "./catalog";
import { fmtXOF } from "./format";

export function fmtOffersGroups() {
  const presentiel = OFFERS.filter((o) => o.mode === "presentiel").map((o) => ({
    ...o,
    priceLabel: fmtXOF(o.priceXof),
    priceFmt: fmtXOF(o.priceXof),
  }));

  const distance = OFFERS.filter((o) => o.mode === "distance").map((o) => ({
    ...o,
    priceLabel: fmtXOF(o.priceXof) + (o.id === "d_hub" || o.id === "d_pro" ? "/mois" : ""),
    priceFmt: fmtXOF(o.priceXof) + (o.id === "d_hub" || o.id === "d_pro" ? "/mois" : ""),
  }));

  return { presentiel, distance };
}

export default fmtOffersGroups;
