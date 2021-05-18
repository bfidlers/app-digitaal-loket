import { generateReportFromData } from '../helpers.js';
import { querySudo as query } from '@lblod/mu-auth-sudo';

export default {
  cronPattern: '0 40 23 * * *',
  name: 'fietsSubsidiesReport',
  execute: async () => {
    const reportData = {
      title: 'List of fiets subsidies',
      description: 'All bike subsidies that have been sent with their related information',
      filePrefix: 'fietsSubsidiesReport'
    };
    console.log('Generate Fiets Subsidies Report');
    const queryString = `
      PREFIX pav: <http://purl.org/pav/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX subsidie: <http://data.vlaanderen.be/ns/subsidie#>
      PREFIX transactie: <http://data.vlaanderen.be/ns/transactie#>
      PREFIX m8g: <http://data.europa.eu/m8g/>

      SELECT ?submissionDate ?bestuurseenheid ?subsidiemaatregelConsumptie
      WHERE {
        ?subsidiemaatregelConsumptie transactie:isInstantieVan <http://lblod.data.gift/concepts/70cc4947-33a3-4d26-82e0-2e1eacd2fea2> ;
          prov:wasGeneratedBy ?aanvraag ;
          m8g:hasParticipation ?participation .
        ?aanvraag subsidie:aanvraagdatum ?submissionDate .
        ?bestuur m8g:playsRole ?participation ; skos:prefLabel ?bestuurseenheid .
      }
      ORDER BY DESC(?submissionDate)
    `;
    const queryResponse = await query(queryString);
    const data = queryResponse.results.bindings.map((subsidie) => {
      return {
        submissionDate: subsidie.submissionDate.value,
        bestuurseenheid: subsidie.bestuurseenheid.value,
        subsidiemaatregelConsumptie: subsidie.subsidiemaatregelConsumptie.value
      };
    });

    await generateReportFromData(data, [
      'submissionDate',
      'bestuurseenheid',
      'subsidiemaatregelConsumptie'
    ], reportData);
  }
};
