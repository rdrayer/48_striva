\echo 'Delete and recreate striva db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE striva;
CREATE DATABASE striva;
\connect striva

\i striva-schema.sql
\i striva-seed.sql

