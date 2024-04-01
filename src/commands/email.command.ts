import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';

export class EmailCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.command('email', (ctx) => {
			if(ctx.session.email){
				ctx.reply(`⚡ Ваша активная Google-почта: ${ctx.session.email}\n\nЕсли все верно - вернитесь в главное меню. Если хотите изменить введите новую почту:`, {
					reply_markup: {
						inline_keyboard: [
							[ { text: '📥 Вернуться в главное меню', callback_data: 'start' } ]
						]
					}
				});
			} else {
				ctx.reply('Введите вашу Google-почту для доступа к Google-таблицам:');
			}
			this.email(ctx);
		});
		this.bot.action('email_inline', (ctx) => {
			if(ctx.session.email){
				ctx.editMessageText(`⚡ Ваша активная Google-почта: ${ctx.session.email}\n\nЕсли все верно - вернитесь в главное меню. Если хотите изменить введите новую почту:`, {
					reply_markup: {
						inline_keyboard: [
							[ { text: '📥 Вернуться в главное меню', callback_data: 'start' } ]
						]
					}
				});
			} else {
				ctx.reply('Введите вашу Google-почту для доступа к Google-таблицам:');
			}
			this.email(ctx);
		});
	}

	email(ctx: IBotContext): void {
		try {
			this.bot.hears(/.*?/, async (ctx) => {
				const email = ctx.update.message.text;
				if(this.validateEmail(email)) {
					ctx.reply(`Ваш электронный адрес Google-почты: ${ctx.update.message.text}\n\nВсе верно?`, Markup.inlineKeyboard([
						Markup.button.callback('Потдвердить ✅', 'start'),
						Markup.button.callback('Изменить ↩️', 'restart')
					]));
					ctx.session.email = ctx.update.message.text;
				} else {
					ctx.reply('Похоже ваша почта неверного формата 🤨\n\nВведите почту вашего Gmail-аккаунта');
					this.email(ctx);
				}
				
			});

			this.bot.action('start', (ctx) => {
				ctx.editMessageText(
					`Список моих комманд доступен по кнопке "Меню"\n\n ⬇️ Выберите действие:`,
					{
						reply_markup: {
							inline_keyboard: [
								[ { text: '⚡ Конвертировать', callback_data: 'convert_inline' }, { text: '🧷 Настройки выгрузки', callback_data: 'settings_inline' } ],
								[ { text: '📥 Изменить почту', callback_data: 'email_inline' } ]
							]
						}
					}
				)
			} )

			this.bot.action('restart', (ctx) => {
				this.email(ctx);
			});
				
		} catch (error) {
			throw new Error('Ошибка вызова команды email');
		}
	}
	// Функция для валидации электронной почты
    validateEmail(email: string): boolean {
        // Простая проверка формата email с использованием регулярного выражения
        const GMAIL_REGEX = /^[^\s@]+@gmail\.com$/;
        return GMAIL_REGEX.test(email);
    }
}