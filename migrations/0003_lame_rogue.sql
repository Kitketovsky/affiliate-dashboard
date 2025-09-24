CREATE TYPE "public"."service_category" AS ENUM('domain', 'storage', 'vps', 'tracker');--> statement-breakpoint
CREATE TYPE "public"."service_provider" AS ENUM('namesilo', 'internet_bs', 'dynodot', 'keitaro', 'dropbox', 'digital_ocean');--> statement-breakpoint
ALTER TYPE "public"."permissions_resource" ADD VALUE 'settings';--> statement-breakpoint
CREATE TABLE "providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_key_id" uuid NOT NULL,
	"label" varchar NOT NULL,
	"service_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "service_category" NOT NULL,
	"name" "service_provider" NOT NULL,
	CONSTRAINT "services_category_name_unique" UNIQUE("category","name")
);
--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_api_key_id_secrets_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "vault"."secrets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;