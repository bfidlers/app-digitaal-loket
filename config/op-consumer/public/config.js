const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100;
const MU_CALL_SCOPE_ID_INITIAL_SYNC = process.env.MU_CALL_SCOPE_ID_INITIAL_SYNC || 'http://redpencil.data.gift/id/concept/muScope/deltas/consumer/initialSync';
const BYPASS_MU_AUTH_FOR_EXPENSIVE_QUERIES = process.env.BYPASS_MU_AUTH_FOR_EXPENSIVE_QUERIES == 'true' ? true : false;
const DIRECT_DATABASE_ENDPOINT = process.env.DIRECT_DATABASE_ENDPOINT || 'http://virtuoso:8890/sparql';
const MAX_DB_RETRY_ATTEMPTS = parseInt(process.env.MAX_DB_RETRY_ATTEMPTS || 5);
const MAX_REASONING_RETRY_ATTEMPTS = parseInt(process.env.MAX_REASONING_RETRY_ATTEMPTS || 5);
const SLEEP_BETWEEN_BATCHES = parseInt(process.env.SLEEP_BETWEEN_BATCHES || 1000);
const SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION = parseInt(process.env.SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION || 10000);
const SLEEP_TIME_AFTER_FAILED_DB_OPERATION = parseInt(process.env.SLEEP_TIME_AFTER_FAILED_DB_OPERATION || 60000);
const DELETE_GRAPH = process.env.DELETE_GRAPH || `http://mu.semte.ch/graphs/delete-op-public`;
const TARGET_GRAPH = process.env.TARGET_GRAPH || `http://mu.semte.ch/graphs/public`;

// TODO: get from main app?
// GRAPHS
const INGEST_GRAPH = process.env.INGEST_GRAPH || `http://mu.semte.ch/graphs/public`;

// ENDPOINTS
const INGEST_DATABASE = process.env.DCR_INGEST_DATABASE || 'database';
const INGEST_DATABASE_ENDPOINT = process.env.DCR_INGEST_DATABASE_ENDPOINT || `http://${INGEST_DATABASE}:8890/sparql`;


if (!process.env.FILE_SYNC_GRAPH)
  throw `Expected 'FILE_SYNC_GRAPH' to be provided.`;
const FILE_SYNC_GRAPH = process.env.FILE_SYNC_GRAPH;

module.exports = {
  BATCH_SIZE,
  MU_CALL_SCOPE_ID_INITIAL_SYNC,
  BYPASS_MU_AUTH_FOR_EXPENSIVE_QUERIES,
  DIRECT_DATABASE_ENDPOINT,
  MAX_DB_RETRY_ATTEMPTS,
  MAX_REASONING_RETRY_ATTEMPTS,
  SLEEP_BETWEEN_BATCHES,
  SLEEP_TIME_AFTER_FAILED_DB_OPERATION,
  SLEEP_TIME_AFTER_FAILED_REASONING_OPERATION,
  INGEST_GRAPH,
  INGEST_DATABASE_ENDPOINT,
  DELETE_GRAPH,
  TARGET_GRAPH
};