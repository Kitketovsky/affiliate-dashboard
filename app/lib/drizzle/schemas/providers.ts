import {
	customType,
	pgTable,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { services } from './services';
import { privateDecrypt, privateEncrypt } from 'node:crypto';

const encryptedText = customType<{ data: string }>({
	dataType() {
		return 'text';
	},
	fromDriver(value: unknown) {
		return privateDecrypt(
			Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'),
			Buffer.from(value as string, 'hex')
		).toString('utf8');
	},
	toDriver(value: string) {
		return privateEncrypt(
			Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'),
			Buffer.from(value, 'utf8')
		).toString('hex');
	}
});

export const providers = pgTable('providers', {
	id: uuid().primaryKey().defaultRandom(),
	api_key: encryptedText().notNull(),
	label: varchar().notNull(),
	service_id: uuid()
		.notNull()
		.references(() => services.id, { onDelete: 'cascade' })
});
