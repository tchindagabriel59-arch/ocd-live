import { offersFor, type Mode } from "./catalog";
import { fmtXOF } from "./format";

export { OFFERS, SLOT_TIMES, WINDOWS } from "./catalog";

/** Offres groupées par mode avec prix pré-formatés (rendu serveur). */
export function fmtOffersGroups() {
  const groups: Array<{ mode: Mode; title: string }> = [
    { mode: "presentiel", title: "Studio Lomé · Présentiel" },
    { mode: "distance", title: "Hub Afrique · À distance" },
  ];
  return groups.map((g) => ({
    ...g,
    offers: offersFor(g.mode).map((o) => ({ ...o, priceFmt: fmtXOF(o.priceXof) })),
  }));
}
