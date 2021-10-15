import { generateReportFromData } from '../helpers.js';
import { querySudo as query } from '@lblod/mu-auth-sudo';

export default {
  cronPattern: '0 44 23 * * 0',
  name: 'gzgSendSubsidieReport',
  execute: async () => { 
    const reportData = {
      title: 'List of Send GzG Report',
      description: 'All GzG subsidy forms that have been send',
      filePrefix: 'gzgSendSubsidieReport'
    };

    const queryString = `
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX subsidie: <http://data.vlaanderen.be/ns/subsidie#>
      PREFIX lblodSubsidie: <http://lblod.data.gift/vocabularies/subsidie/>
      PREFIX transactie: <http://data.vlaanderen.be/ns/transactie#>
      PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
      PREFIX m8g: <http://data.europa.eu/m8g/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX adms: <http://www.w3.org/ns/adms#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX schema: <http://schema.org/>
  
      SELECT DISTINCT ?aanvraagdatum ?bestuurseenheid ?contactFirstName ?contactLastName ?contactTelephone ?contactEmail
          ?isSamenwerkingsverband ?projectNaam ?projectStartDatum ?projectEindDatum ?aanvraagBedrag ?thema ?aangemaaktDoor ?gewijzigdDoor ?status
          ?samenwerkingsverband
      WHERE {
        ?subsidie a subsidie:SubsidiemaatregelConsumptie ;
        transactie:isInstantieVan <http://lblod.data.info/id/subsidy-measure-offers/8379a4ea-fd83-47cc-89fa-1a72ee4fbaff>;
        m8g:hasParticipation ?participation ;
        dct:modified ?aanvraagdatum ;
        dct:creator ?creator;
        ext:lastModifiedBy ?lastModified;
        dct:source ?form .
  
        ?bestuur m8g:playsRole ?participation ;
                skos:prefLabel ?bestuurseenheid .
  
        ?participation m8g:role <http://lblod.data.gift/concepts/d8b8f3d1-7574-4baf-94df-188a7bd84a3a>.

        ?creator foaf:firstName ?creatorNaam.
        ?creator foaf:familyName ?creatorFamilienaam.

        BIND(CONCAT(?creatorNaam, " ", ?creatorFamilienaam) as ?aangemaaktDoor)

        ?lastModified foaf:firstName ?modifierNaam.
        ?lastModified foaf:familyName ?modifierFamilienaam.

        BIND(CONCAT(?modifierNaam, " ", ?modifierFamilienaam) as ?gewijzigdDoor)

        ?form dct:modified ?modified. 
        ?form adms:status ?statusCode.
        ?statusCode skos:prefLabel ?status.

        ?form schema:contactPoint ?contactPoint .
        ?contactPoint foaf:firstName ?contactFirstName . 
        ?contactPoint foaf:familyName ?contactLastName . 
        ?contactPoint schema:email ?contactEmail . 
        ?contactPoint schema:telephone ?contactTelephone . 

        ?form lblodSubsidie:isCollaboration/skos:prefLabel ?isSamenwerkingsverband. 
        ?form lblodSubsidie:collaborator/skos:prefLabel ?samenwerkingsverband. 

        ?form lblodSubsidie:projectName ?projectNaam. 
        ?form lblodSubsidie:projectStartDate ?projectStartDatum. 
        ?form lblodSubsidie:projectEndDate ?projectEindDatum. 
        ?form lblodSubsidie:totalAmount ?aanvraagBedrag. 
        ?form lblodSubsidie:projectType/skos:prefLabel ?thema.

        FILTER(?statusCode = <http://lblod.data.gift/concepts/9bd8d86d-bb10-4456-a84e-91e9507c374c>)
      }
      ORDER BY DESC(?modified)
    `;
    const queryResponse = await query(queryString);
    const data = queryResponse.results.bindings.map((subsidie) => {
      return {
        aanvraagdatum: getSafeValue(subsidie, 'aanvraagdatum'),
        bestuurseenheid: getSafeValue(subsidie, 'bestuurseenheid'),
        contactFirstName: getSafeValue(subsidie, 'contactFirstName'),
        contactLastName: getSafeValue(subsidie, 'contactLastName'),
        contactEmail: getSafeValue(subsidie, 'contactEmail'),
        contactTelephone: getSafeValue(subsidie, 'contactTelephone'),
        isSamenwerkingsverband: getSafeValue(subsidie, 'isSamenwerkingsverband'),
        samenwerkingsverband: getSafeValue(subsidie, 'samenwerkingsverband'),
        projectNaam: getSafeValue(subsidie, 'projectNaam'),
        projectStartDatum: getSafeValue(subsidie, 'projectStartDatum'),
        projectEindDatum: getSafeValue(subsidie, 'projectEindDatum'),
        aanvraagBedrag: getSafeValue(subsidie, 'aanvraagBedrag'),
        thema: getSafeValue(subsidie, 'thema'),
        aangemaaktDoor: getSafeValue(subsidie, 'aangemaaktDoor'),
        gewijzigdDoor: getSafeValue(subsidie, 'gewijzigdDoor'),
        status: getSafeValue(subsidie, 'status'),
      };
    });

    await generateReportFromData(data, [
      'aanvraagdatum',
      'bestuurseenheid',
      'contactFirstName',
      'contactLastName',
      'contactTelephone',
      'contactEmail',
      'samenwerkingsverband',
      'bestuurseenheidConditinal',
      'projectNaam',
      'projectStartDatum',
      'projectEindDatum',
      'aanvraagBedrag',
      'thema',
      'aangemaaktDoor',
      'gewijzigdDoor',
      'status'
    ], reportData);
      
  }
};

function getSafeValue(entry, property){
  return entry[property] ? wrapInQuote(entry[property].value) : null;
}

// Some values might contain comas, wrapping them in escapes quotes doesn't disturb the colomns
function wrapInQuote(value) {
  return `\"${value}\"`;
}
