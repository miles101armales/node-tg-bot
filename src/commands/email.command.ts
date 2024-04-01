import { Context, Markup, Telegraf } from 'telegraf';
import { Command } from './command.class';
import { IBotContext } from '../context/context.interface';

export class EmailCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}

	handle(): void {
		this.bot.command('email', (ctx) => this.email(ctx));
		this.bot.action('email', (ctx) => this.email(ctx));
	}

	email(ctx: IBotContext): void {
		try {
				console.log('Perehod')
				if(ctx.session.email){
					ctx.editMessageText(`⚡ Ваша активная Google-почта: ${ctx.session.email}\n\nЕсли все верно - вернитесь в главное меню. Если хотите изменить введите новую почту:`, Markup.inlineKeyboard([
						Markup.button.callback('Вернуться в главное меню', 'start')
					]));
				} else {
					ctx.reply('Введите вашу Google-почту для доступа к Google-таблицам:');
				}
				this.bot.hears(/.*?/, async (ctx) => {
					ctx.reply(`Ваш электронный адрес Google-почты: ${ctx.update.message.text}\n\nВсе верно?`, Markup.inlineKeyboard([
						Markup.button.callback('Потдвердить ✅', 'start'),
						Markup.button.callback('Изменить ↩️', 'restart')
					]));
					ctx.session.email = ctx.update.message.text as string;
				});

			this.bot.action('start', (ctx) => {
				ctx.editMessageText(
					`Список моих комманд доступен по кнопке "Меню"\n\n ⬇️ Выберите действие:`,
					{
						reply_markup: {
							inline_keyboard: [
								[ { text: '⚡ Конвертировать', callback_data: 'convert' }, { text: '🧷 Настройки выгрузки', callback_data: 'settings' } ],
								[ { text: '📥 Изменить почту', callback_data: 'email' } ]
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
}