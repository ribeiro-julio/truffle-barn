CREATE TYPE "public"."visibilities" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "occurrence" (
	"id" serial PRIMARY KEY NOT NULL,
	"repo_id" integer NOT NULL,
	"secret_id" integer NOT NULL,
	"commit" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repo" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner" text NOT NULL,
	"name" text NOT NULL,
	"archived" boolean NOT NULL,
	"visibility" "visibilities" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "secret" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"detector" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occurrence" ADD CONSTRAINT "occurrence_repo_id_repo_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "occurrence" ADD CONSTRAINT "occurrence_secret_id_secret_id_fk" FOREIGN KEY ("secret_id") REFERENCES "public"."secret"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
