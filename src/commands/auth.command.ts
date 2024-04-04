import { Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';
import { EmailCommand } from './email.command';

export class AuthCommand extends Command {
	
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	emailCommand: EmailCommand;
	public settings: string = '';

	handle(): void {
		this.bot.action('auth_inline', (ctx: IBotContext) => {
			this.convertSettingEmail(ctx);
		})
		this.bot.action('apply_email', async (ctx) => {
			this.convertSettingsTo(ctx);
		})
	}

	convertSettingEmail(ctx: IBotContext) {
		ctx.session.email = '';
		ctx.session.url = '';
		ctx.session.convert_to = '';
		ctx.session.convert_type = '';
		ctx.session.convert_settings = '';
		ctx.reply('Введите почту')
		this.bot.hears(/^[^\s@]+@gmail\.com$/, async (ctx) => {
			const email = ctx.update.message.text;
			if(this.validateEmail(email)) {
				ctx.reply(`Ваш электронный адрес Google-почты: ${ctx.update.message.text}\n\nВсе верно?`, {
					reply_markup: {
						inline_keyboard: [
							[{ text: 'Потдвердить ✅', callback_data: 'apply_email' }, { text: 'Изменить ↩️', callback_data: 'restart' }]
						]
					}
				});
				ctx.session.email = ctx.update.message.text;
			} else {
				ctx.reply('Похоже ваша почта неверного формата 🤨\n\nВведите почту вашего Gmail-аккаунта');
				this.convertSettingEmail(ctx);
			}
		})

		this.bot.action('apply_email', async (ctx) => {
			this.convertSettingsTo(ctx);
		})

		this.bot.action('restart', async (ctx) => {
			this.convertSettingEmail(ctx);
		})
	}

	convertSettingsTo(ctx: IBotContext) {
		this.checkSettings(ctx);
		ctx.editMessageText(`${this.settings}В какую таблицу будет производится выгрузка CSV-файла`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Новая таблица', callback_data: 'new_table'}],
					[{ text: 'Моя таблица(добавить)', callback_data: 'exist_table'}],
				]
			}
		})

		this.bot.action('new_table', async (ctx) => {
			ctx.session.convert_to = 'Новая таблица';
			this.convertSettings(ctx);
		}) 

		this.bot.action('exist_table', async (ctx) => {
			ctx.session.convert_to = 'Существующая таблица';
			ctx.editMessageText('Отправьте URL вашей таблицы');
			this.bot.hears(/https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit/, async (ctx) => {
				const urlParts = ctx.update.message.text.split('/');
				ctx.session.url = ctx.update.message.text;
				const spreadsheetId = urlParts[urlParts.length - 2];
				ctx.reply(`Ваш URL: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`)
				
				this.convertSettings(ctx);
			})
		}) 

	}

	convertSettings(ctx: IBotContext) {
		this.checkSettings(ctx);
		ctx.reply(`${this.settings}Какую выборку необходимо применить к выгрузке?`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Безопасная', callback_data: 'safe'}],
					[{ text: 'Полная', callback_data: 'unsafe'}],
					// [{ text: 'Пользовательская', callback_data: 'custom'}]
				]
			}
		})

		this.bot.action('safe', async(ctx) => {
			ctx.session.convert_settings = 'Безопасная';
			this.checkSettings(ctx);
			ctx.editMessageText(`Ваши настройки:\n\n${this.settings}`, {
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Потдвердить ✅', callback_data: 'start' }, { text: 'Изменить ↩️', callback_data: 'restart' }]
					]
				}
			})
		})
		
		this.bot.action('safe', async(ctx) => {
			ctx.session.convert_settings = 'Полная';
			this.checkSettings(ctx);
			ctx.editMessageText(`Ваши настройки:\n\n${this.settings}`, {
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Потдвердить ✅', callback_data: 'start' }, { text: 'Изменить ↩️', callback_data: 'restart' }]
					]
				}
			})
		})
	}

	validateEmail(email: string): boolean {
        // Простая проверка формата email с использованием регулярного выражения
        const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/;
        return GMAIL_REGEX.test(email);
    }

	checkSettings(ctx: IBotContext) {
		if(ctx.session.convert_to === 'Новая таблица') {
			this.settings = `📥 Ваша почта:\n→ ${ctx.session.email}\n`+
		`#️⃣ Конвертация в таблицу:\n→ ${ctx.session.convert_to}\n`+
		`#️⃣ Выборка выгрузки:\n→ ${ctx.session.convert_settings}\n\n`;
		} else if(ctx.session.url !== '') {
			this.settings = `📥 Ваша почта:\n→ ${ctx.session.email}\n`+
		`#️⃣ Конвертация в таблицу:\n→ ${ctx.session.convert_to}\n`+
		`#️⃣ Ваша таблица:\n→ ${ctx.session.url}\n`+
		`#️⃣ Выборка выгрузки:\n→ ${ctx.session.convert_settings}\n\n`;
		}
	}
}