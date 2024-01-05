-- Supprimez d'abord les tables d'association pour éviter les problèmes de clés étrangères
DROP TABLE IF EXISTS "post_tags" CASCADE;
DROP TABLE IF EXISTS "tips_tags" CASCADE;

-- Supprimez ensuite les tables principales
DROP TABLE IF EXISTS "post" CASCADE;
DROP TABLE IF EXISTS "tips" CASCADE;
DROP TABLE IF EXISTS "reaction" CASCADE;
DROP TABLE IF EXISTS "tag" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "comment" CASCADE;

-- Supprimez tous les types personnalisés
DROP TYPE IF EXISTS roles;
DROP TYPE IF EXISTS reaction_enum;
