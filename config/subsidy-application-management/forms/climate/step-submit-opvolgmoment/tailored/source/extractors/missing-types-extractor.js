const URI_BASE = 'http://data.lblod.info/form-data/nodes/';

module.exports = {
  name: 'climate/step-submit-opvolgmoment/missing-types-extractor',
  execute: async (store, graphs, lib, source) => {
    const {$rdf, mu, sudo} = lib;

    const RDF_TYPE = new $rdf.NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    const SUBSIDIE = new $rdf.Namespace('http://lblod.data.gift/vocabularies/subsidie/');
    const ATTACHMENT = new $rdf.Namespace('http://lblod.data.gift/vocabularies/subsidie/climate/attachment/');

    const attachment = new $rdf.NamedNode(URI_BASE + mu.uuid());

    store.add($rdf.sym(source.uri), SUBSIDIE('attachment'), $rdf.sym(attachment), graphs.additions);
    store.add($rdf.sym(attachment), RDF_TYPE, ATTACHMENT('FormData'), graphs.additions);
  }
}