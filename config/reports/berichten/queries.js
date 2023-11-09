import * as rst from 'rdf-string-ttl';
import * as uti from './utils';
import * as n3 from 'n3';
import { NAMESPACES as ns } from './namespaces';
const { literal } = n3.DataFactory;

export function recentMessages(startDate) {
  const startDateLiteral = literal(startDate.toISOString(), ns.xsd`dateTime`);
  const alwaysFutureDateLiteral = literal(
    uti.addDays(new Date(), 1).toISOString(),
    ns.xsd`dateTime`
  );
  return `
PREFIX rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sch:     <http://schema.org/>
PREFIX nie:     <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
PREFIX nfo:     <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
PREFIX adms:    <http://www.w3.org/ns/adms#>
PREFIX deli:    <http://data.lblod.info/id/status/berichtencentrum/sync-with-kalliope/delivered/>
PREFIX js:      <http://redpencil.data.gift/id/concept/JobStatus/>
PREFIX task:    <http://redpencil.data.gift/vocabularies/tasks/>
PREFIX jo:      <http://lblod.data.gift/id/jobs/concept/JobOperation/>
PREFIX dct:     <http://purl.org/dc/terms/>
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX account: <http://mu.semte.ch/vocabularies/account/>
PREFIX core:    <http://mu.semte.ch/vocabularies/core/>
PREFIX cogs:    <http://vocab.deri.ie/cogs#>

SELECT DISTINCT ?conversation ?message ?sender ?recipient ?type ?dateSent ?dateReceived ?content ?attachment ?creator ?confirmedStatus
WHERE {
  GRAPH <http://mu.semte.ch/graphs/public> {
    ?organisation
      a besluit:Bestuurseenheid ;
      core:uuid ?organisationUUID .
  }
  BIND (IRI(CONCAT("http://mu.semte.ch/graphs/organizations/", STR(?organisationUUID), "/LoketLB-berichtenGebruiker")) AS ?organisationGraph)
  GRAPH ?organisationGraph {
    ?conversation
      a sch:Conversation ;
      sch:hasPart ?message .
    
    FILTER NOT EXISTS {
      ?message adms:status deli:unconfirmed .
    }
    FILTER NOT EXISTS {
      ?message adms:status deli:failedConfirmation .
    }
  
    ?message a sch:Message .
    OPTIONAL { ?message dct:type ?type . }
    OPTIONAL { ?message sch:dateSent ?dateSent . }
    BIND (
      COALESCE(?dateSent, ${rst.termToString(alwaysFutureDateLiteral)})
      AS ?compareDate)
    FILTER (?compareDate > ${rst.termToString(startDateLiteral)})
    OPTIONAL { ?message sch:dateReceived ?dateReceived . }
    OPTIONAL { ?message sch:text ?content . }
    OPTIONAL { ?message sch:sender ?sender . }
    OPTIONAL { ?message sch:recipient ?recipient . }
    ?message nie:hasPart ?attachment .
    
    ?attachment a nfo:FileDataObject .
    
    OPTIONAL {
      ?job
        dct:subject ?message ;
        task:operation jo:harvestBericht ;
        dct:creator ?creator ;
        a cogs:Job .
    }
    OPTIONAL { ?message adms:status ?confirmedStatus . }
  }
}
ORDER BY ?conversation ?message`;
}

//const originalQuery = `
//PREFIX rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
//PREFIX sch:     <http://schema.org/>
//PREFIX nie:     <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
//PREFIX nfo:     <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
//PREFIX adms:    <http://www.w3.org/ns/adms#>
//PREFIX deli:    <http://data.lblod.info/id/status/berichtencentrum/sync-with-kalliope/delivered/>
//PREFIX js:      <http://redpencil.data.gift/id/concept/JobStatus/>
//PREFIX task:    <http://redpencil.data.gift/vocabularies/tasks/>
//PREFIX jo:      <http://lblod.data.gift/id/jobs/concept/JobOperation/>
//PREFIX dct:     <http://purl.org/dc/terms/>
//PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
//PREFIX account: <http://mu.semte.ch/vocabularies/account/>
//PREFIX core:    <http://mu.semte.ch/vocabularies/core/>
//PREFIX cogs:    <http://vocab.deri.ie/cogs#>
//
//SELECT DISTINCT ?conversation ?message ?sender ?recipient ?type ?dateSent ?dateReceived ?content ?attachment ?provenance
//WHERE {
//  GRAPH <http://mu.semte.ch/graphs/public> {
//    ?organisation
//      a besluit:Bestuurseenheid ;
//      core:uuid ?organisationUUID .
//  }
//  BIND (IRI(CONCAT("http://mu.semte.ch/graphs/organizations/", STR(?organisationUUID), "/LoketLB-berichtenGebruiker")) AS ?organisationGraph)
//  BIND (bif:dateadd("month", -6, NOW()) AS ?startDate)
//  BIND (bif:dateadd("day", 1, NOW()) AS ?alwaysFutureDate)
//  GRAPH ?organisationGraph {
//    ?conversation
//      a sch:Conversation ;
//      sch:hasPart ?message .
//
//    #Exclude unconfirmed or failed messages from Kaliope
//    FILTER NOT EXISTS {
//      ?message adms:status deli:unconfirmed .
//    }
//    FILTER NOT EXISTS {
//      ?message adms:status deli:failedConfirmation .
//    }
//
//    #Message and its properties (optionals are faster?!)
//    ?message a sch:Message .
//    OPTIONAL {
//      ?message dct:type ?type .
//    }
//    OPTIONAL {
//      ?message sch:dateSent ?dateSent .
//    }
//    FILTER (COALESCE(?dateSent, ?alwaysFutureDate) > ?startDate)
//    OPTIONAL {
//      ?message sch:dateReceived ?dateReceived .
//    }
//    OPTIONAL {
//      ?message sch:text ?content .
//    }
//    OPTIONAL {
//      ?message sch:sender ?sender .
//    }
//    OPTIONAL {
//      ?message sch:recipient ?recipient .
//    }
//    ?message nie:hasPart ?attachment .
//
//    ?attachment
//      a nfo:FileDataObject .
//
//    OPTIONAL {
//      ?job
//        dct:subject ?message ;
//        task:operation jo:harvestBericht ;
//        dct:creator ?creator ;
//        a cogs:Job .
//    }
//    OPTIONAL {
//      ?message
//        adms:status
//          ?confirmedStatus .
//    }
//    BIND (
//      COALESCE(
//        ?creator,
//        IF(BOUND(?confirmedStatus), <https://github.com/lblod/berichtencentrum-sync-with-kalliope-service>, ?void),
//        <https://github.com/lblod/frontend-loket>)
//        AS ?provenance)
//  }
//}
//ORDER BY ?conversation ?message
//LIMIT 1000
//`;
